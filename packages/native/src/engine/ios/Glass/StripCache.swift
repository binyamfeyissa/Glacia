import Metal
import QuartzCore
import UIKit
import os

// =============================================================================================
//  StripCache — the Metal tier photographs scroll content in CONTENT coordinates.
//
//  The window capture answers "what is at window (x, y) right now?". For scrolling content that
//  question is only true for one frame, and the capture governor deliberately skips frames while
//  the region moves, so a dragged pane refracts a still photograph of where the list used to be.
//  This cache replaces the content band with a ring buffer in the scroll view's own coordinate
//  space: rows are rasterised once as they come into view and re-composited every frame at the
//  presented content offset. Cost scales with how many NEW rows a frame exposes, not with the
//  size of the glass or the length of the content.
//
//  What the cache is not: it cannot see sticky headers that move in window space at a different
//  rate, parallax layers driven by their own transforms, nested scrollers, video or Lottie frames
//  that redraw without changing geometry, or images that arrive asynchronously. Those are the
//  honest degradations. `fingerprint` catches the cheap ones (a subtree whose shape or transform
//  changed since its rows were drawn) and reports the cache untrustworthy; the scheduler then
//  falls back to the improved governor — low-resolution band captures during motion, one sharp
//  capture on settle — and takes the cache back only once the fingerprint settles again.
//
//  Ring addressing: row y in content space lives at pixel row `(y * scale) mod ringPixelHeight`,
//  which is `fract(contentY / stripHeight)` in the shader's language. The cache does the wrap in
//  the blit instead: up to two source rectangles per frame, so the lens shader is untouched and
//  the backdrop texture keeps its window-space `uvRect` contract.
// =============================================================================================

final class StripCache {

    private enum Tuning {

        /// The band the cache keeps beyond the viewport on each side: the largest blur radius
        /// the glass can ask for plus the largest refraction/dispersion displacement, so a lens
        /// near the edge never reads a row that has scrolled out of the ring.
        static let refractionHeadroom: CGFloat = 48

        /// Velocity lookahead, seconds. At 1,500 pt/s this is 25 pt — one 60 Hz frame — of rows
        /// the cache keeps ahead of the presented offset, so a fling never outruns it.
        static let lookahead: CFTimeInterval = 1.0 / 60.0

        /// The ring never shrinks below this many points of content, and never exceeds the
        /// cap: past it the band is too tall to keep coherent and the window capture is honest.
        static let minimumStripHeight: CGFloat = 512
        static let maximumStripHeight: CGFloat = 4096

        /// Rows allowed in one frame before the cache gives up and re-rasterises the visible
        /// band only. This is the "cost scales with scroll speed" ceiling: a fast fling past a
        /// gap does not get to rerasterise the whole ring in one frame.
        static let maximumRowsPerFrame = 1_200

        /// A fingerprint mismatch inside this window keeps the cache distrusted; after it the
        /// cache is re-seeded from the render tree.
        static let distrustDuration: CFTimeInterval = 1.0

        /// Luminance cells per axis for the validator. Matches the capturer's grid so the two
        /// compare like for like.
        static let validationGrid = 12

        /// Mean luminance difference (0...1) above which the strip and a fresh window capture
        /// disagree about the same band, and the cache is no longer trusted.
        static let validationTolerance: Double = 0.12
    }

    private let device: MTLDevice
    private let queue: MTLCommandQueue?

    private(set) var texture: MTLTexture?

    /// Scale at which the ring is rasterised. The window capture must run at the same scale
    /// while a strip is active, or the composite cannot be a blit.
    private(set) var scale: CGFloat = 2

    /// Height of the ring in points. `fract(contentY / stripHeight)` must use this number.
    private(set) var stripHeight: CGFloat = Tuning.minimumStripHeight

    private var ringHeightPixels = 0
    private var widthPixels = 0

    /// The content-Y range currently valid in the ring. Not wrapped for the caller: these are
    /// content coordinates, and the modulo happens at upload and composite time.
    private var validMin: CGFloat = 0
    private var validMax: CGFloat = 0
    private var hasContent = false

    /// Fingerprint of the render tree at the time the valid rows were drawn.
    private var fingerprint: UInt64 = 0
    private var distrustUntil: CFTimeInterval = 0

    /// Diagnostics for the report: rows rasterised this frame and total, and the ring's
    /// occupancy. Read only under `EXPO_LIQUID_GLASS_DEBUG`.
    private(set) var lastRasterisedRows = 0
    private(set) var lastCompositeWasBlit = false

    private static let log = OSLog(subsystem: "com.glacia.glass", category: "StripCache")

    init?(device: MTLDevice) {
        guard let queue = device.makeCommandQueue() else { return nil }
        queue.label = "GlaciaStripComposite"
        self.device = device
        self.queue = queue
    }

    // ----------------------------------------------------------------------------------- layout

    /// Sizes the ring to the scroll view and its viewport.
    ///
    /// Returns false when the content is too short to need a ring (the window capture is
    /// already exact for a list that does not move), and marks itself unusable when the band
    /// would exceed the cap — an extremely tall glass over a short viewport.
    @discardableResult
    func layout(scrollView: UIScrollView, scale: CGFloat) -> Bool {
        let viewport = scrollView.bounds.height
        guard viewport > 1, scrollView.contentSize.height > 1 else { return false }

        let headroom = Tuning.refractionHeadroom + viewport * CGFloat(Tuning.lookahead)
        let wanted = min(
            max(viewport + headroom * 2, Tuning.minimumStripHeight),
            Tuning.maximumStripHeight
        )
        let height = min(wanted, scrollView.contentSize.height)
        let width = scrollView.bounds.width

        guard width > 1, height > 1 else { return false }

        let widthPixels = Int((width * scale).rounded(.up))
        let ringPixels = Int((height * scale).rounded(.up))
        if widthPixels == self.widthPixels,
           ringPixels == ringHeightPixels,
           abs(scale - self.scale) < 0.01,
           texture != nil {
            return true
        }

        guard widthPixels > 0, ringPixels > 0,
              widthPixels * ringPixels <= 8_192 * 8_192
        else {
            invalidateAll()
            return false
        }

        let descriptor = MTLTextureDescriptor.texture2DDescriptor(
            pixelFormat: .bgra8Unorm,
            width: widthPixels,
            height: ringPixels,
            mipmapped: false
        )
        descriptor.usage = [.shaderRead]
        // Shared storage: the rows arrive from CGContext on the CPU and are uploaded with
        // replace(region:). Private storage would need a staging buffer per upload for no gain
        // at these sizes (≤ 8 MB).
        descriptor.storageMode = .shared

        guard let texture = device.makeTexture(descriptor: descriptor) else {
            invalidateAll()
            return false
        }
        texture.label = "GlaciaStrip"

        self.texture = texture
        self.scale = scale
        self.stripHeight = height
        self.ringHeightPixels = ringPixels
        self.widthPixels = widthPixels
        invalidateAll()
        return true
    }

    /// True when the ring holds rows that a lens at `contentY` can read.
    func covers(_ contentY: CGFloat, height: CGFloat) -> Bool {
        guard hasContent, texture != nil else { return false }
        let top = contentY
        let bottom = contentY + height
        return top >= validMin - 0.5 && bottom <= validMax + 0.5
    }

    /// True while a fingerprint mismatch has forced the cache out of service.
    var isDistrusted: Bool { CACurrentMediaTime() < distrustUntil }

    func distrust() {
        distrustUntil = CACurrentMediaTime() + Tuning.distrustDuration
        hasContent = false
    }

    // ---------------------------------------------------------------------------------- capture

    /// Brings the ring up to the rows this frame needs, in content coordinates.
    ///
    /// Rasterises only the newly exposed intervals. Returns the presented content offset the
    /// composite should use, or nil when the caller must fall back to the window capture.
    func sync(
        scrollView: UIScrollView,
        content: UIView,
        offsetY: CGFloat,
        contentHeight: CGFloat,
        scale: CGFloat
    ) -> CGFloat? {
        os_signpost(.begin, log: Self.log, name: "stripSync")

        defer { os_signpost(.end, log: Self.log, name: "stripSync") }

        guard layout(scrollView: scrollView, scale: scale) else { return nil }
        guard let texture else { return nil }

        let viewport = scrollView.bounds.height
        let wantedMin = max(0, offsetY - Tuning.refractionHeadroom)
        let wantedMax = min(contentHeight, offsetY + viewport + Tuning.refractionHeadroom)

        // A jump larger than the ring, or a content size change, leaves the ring describing a
        // document that no longer exists. Re-seed rather than splice.
        if hasContent, wantedMin > validMax || wantedMax < validMin {
            hasContent = false
        }

        let nextFingerprint = Self.fingerprint(of: content)
        if hasContent, nextFingerprint != fingerprint { distrust() }
        fingerprint = nextFingerprint

        guard !isDistrusted else { return nil }

        if !hasContent {
            hasContent = true
            validMin = wantedMin
            validMax = wantedMin
        }

        let advanceFrom = min(validMax, wantedMax)
        if wantedMax > advanceFrom {
            let height = wantedMax - advanceFrom
            guard height * scale <= CGFloat(Tuning.maximumRowsPerFrame) else {
                // Too much new content in one frame: draw the visible band, leave the rest to
                // the next frames. The lens only reads the band it covers, so this is a cost
                // ceiling, not a correctness hole.
                let bandMin = max(0, offsetY)
                let bandMax = min(contentHeight, offsetY + viewport)
                guard rasterise(
                    content: content,
                    from: bandMin,
                    to: bandMax,
                    texture: texture,
                    scrollView: scrollView
                ) else {
                    distrust()
                    return nil
                }
                validMin = bandMin
                validMax = bandMax
                lastRasterisedRows = Int((bandMax - bandMin) * scale)
                return offsetY
            }

            guard rasterise(
                content: content,
                from: advanceFrom,
                to: wantedMax,
                texture: texture,
                scrollView: scrollView
            ) else {
                distrust()
                return nil
            }
            validMax = wantedMax
            lastRasterisedRows = Int(height * scale)
        } else {
            lastRasterisedRows = 0
        }

        // The band must cover everything the glass can read; if the content is shorter than the
        // viewport plus headroom the ring holds all of it and the check is trivially true.
        guard covers(offsetY - Tuning.refractionHeadroom,
                     height: viewport + Tuning.refractionHeadroom * 2)
        else {
            return nil
        }

        return offsetY
    }

    /// Rasterises one content-space range into the ring.
    ///
    /// The content container is drawn directly, not the scroll view: drawing the scroll view
    /// would apply its clip and photograph exactly the window band the cache exists to replace.
    private func rasterise(
        content: UIView,
        from: CGFloat,
        to: CGFloat,
        texture: MTLTexture,
        scrollView: UIScrollView
    ) -> Bool {
        let rows = to - from
        guard rows > 0.5 else { return true }

        let widthPoints = scrollView.bounds.width
        let widthPixels = Int((widthPoints * scale).rounded(.up))
        let rowsPixels = Int((rows * scale).rounded(.up))
        guard widthPixels > 0, rowsPixels > 0,
              let bitmap = CGContext(
                  data: nil,
                  width: widthPixels,
                  height: rowsPixels,
                  bitsPerComponent: 8,
                  bytesPerRow: widthPixels * 4,
                  space: CGColorSpaceCreateDeviceRGB(),
                  bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue
                      | CGBitmapInfo.byteOrder32Little.rawValue
              )
        else { return false }

        bitmap.interpolationQuality = .none
        bitmap.setShouldSmoothFonts(false)
        bitmap.scaleBy(x: scale, y: scale)
        // Content-space y = from lands on bitmap row 0. The content view's own origin is
        // irrelevant: it draws its full document in content coordinates either way.
        bitmap.translateBy(x: 0, y: -from)

        let drawn = content.layer
        drawn.render(in: bitmap)

        guard let data = bitmap.data else { return false }
        let bytesPerRow = bitmap.bytesPerRow

        // Wrap at the ring seam: at most two regions.
        let startPixel = Self.pixelRow(for: from, scale: scale, ringHeight: ringHeightPixels)
        let firstRows = min(rowsPixels, ringHeightPixels - startPixel)
        texture.replace(
            region: MTLRegionMake2D(0, startPixel, widthPixels, firstRows),
            mipmapLevel: 0,
            withBytes: data,
            bytesPerRow: bytesPerRow
        )
        if firstRows < rowsPixels {
            texture.replace(
                region: MTLRegionMake2D(0, 0, widthPixels, rowsPixels - firstRows),
                mipmapLevel: 0,
                withBytes: data.advanced(by: firstRows * bytesPerRow),
                bytesPerRow: bytesPerRow
            )
        }
        return true
    }

    // ------------------------------------------------------------------------------ composite

    /// Copies the content band of `scrollFrame` from the ring into the window-space backdrop.
    ///
    /// The backdrop texture belongs to `BackdropCapturer` and already holds the static bands
    /// above and below the scroller; this overwrites only the band the scroller occupies, so the
    /// lens keeps its single window-space `uvRect` and the shader never learns about content
    /// coordinates. Returns false when the ring cannot serve the band and the caller should
    /// capture the window instead.
    @discardableResult
    func composite(
        into backdrop: MTLTexture,
        scrollFrame: CGRect,
        capturedOrigin: CGPoint,
        contentOffsetY: CGFloat
    ) -> Bool {
        lastCompositeWasBlit = false
        guard let strip = texture, let queue else { return false }
        guard backdrop.width == widthPixels, backdrop.height > 0 else { return false }

        let viewport = scrollFrame.height
        guard covers(contentOffsetY, height: viewport) else { return false }

        // Destination: the band in backdrop pixels.
        let x = (scrollFrame.minX - capturedOrigin.x) * scale
        let y = (scrollFrame.minY - capturedOrigin.y) * scale
        let w = scrollFrame.width * scale
        let h = viewport * scale
        let destX = max(0, Int(x.rounded()))
        let destY = max(0, Int(y.rounded()))
        let destW = min(Int(w.rounded()), backdrop.width - destX)
        let destH = min(Int(h.rounded()), backdrop.height - destY)
        guard destW > 0, destH > 0, destX + destW <= backdrop.width,
              destY + destH <= backdrop.height
        else { return false }

        // Source: the same rows in the ring, split at the seam.
        let sourceTop = contentOffsetY + CGFloat(destY - Int(y.rounded())) / scale
        let startPixel = Self.pixelRow(
            for: sourceTop,
            scale: scale,
            ringHeight: ringHeightPixels
        )

        guard let command = queue.makeCommandBuffer(),
              let blit = command.makeBlitCommandEncoder()
        else { return false }
        command.label = "StripComposite"
        blit.label = "StripCompositeBlit"

        var copied = 0

        func copyRows(_ rows: Int, from ringPixel: Int, to destPixel: Int) {
            guard rows > 0 else { return }
            blit.copy(
                from: strip,
                sourceSlice: 0,
                sourceLevel: 0,
                sourceOrigin: MTLOrigin(x: 0, y: ringPixel, z: 0),
                sourceSize: MTLSize(width: destW, height: rows, depth: 1),
                to: backdrop,
                destinationSlice: 0,
                destinationLevel: 0,
                destinationOrigin: MTLOrigin(x: destX, y: destPixel, z: 0)
            )
            copied += rows
        }

        let firstRows = min(destH, ringHeightPixels - startPixel)
        copyRows(firstRows, from: startPixel, to: destY)
        if firstRows < destH {
            copyRows(destH - firstRows, from: 0, to: destY + firstRows)
        }

        blit.endEncoding()
        command.commit()
        lastCompositeWasBlit = copied == destH
        return lastCompositeWasBlit
    }

    // ------------------------------------------------------------------------------ validator

    /// Compares the strip's band against a fresh window capture of the same band.
    ///
    /// Called on a settle capture, never during motion. A mean luminance difference past the
    /// tolerance means the content moved in a way the strip did not model — a per-frame redraw,
    /// an image that arrived, a transformed layer — and the cache is distrusted until the
    /// fingerprint settles again. This is the §2 validator, reduced to what the ring can answer
    /// from bytes it already has.
    func validate(
        against capture: MTLTexture,
        scrollFrame: CGRect,
        capturedOrigin: CGPoint,
        contentOffsetY: CGFloat
    ) {
        guard let strip = texture else { return }
        let bandY = (scrollFrame.minY - capturedOrigin.y) * scale
        let bandX = (scrollFrame.minX - capturedOrigin.x) * scale
        let bandH = min(scrollFrame.height * scale, CGFloat(capture.height) - bandY)
        guard bandH > 8, bandX >= 0, bandX < CGFloat(capture.width) else { return }

        let cells = Tuning.validationGrid
        var stripMean: Double = 0
        var captureMean: Double = 0
        var samples = 0

        // Window pixel y -> content y: the band starts at scrollFrame.minY in the window, which
        // is contentY = contentOffsetY at that row, so every other row maps by the pixel delta.
        let bandTopContentY = contentOffsetY

        for cell in 0..<cells {
            let destRow = Int(bandY + bandH * (CGFloat(cell) + 0.5) / CGFloat(cells))
            guard destRow >= 0, destRow < capture.height else { continue }

            let contentY = bandTopContentY + (CGFloat(destRow) - bandY) / scale
            let sourceRow = Self.pixelRow(
                for: contentY,
                scale: scale,
                ringHeight: ringHeightPixels
            )
            let x = max(0, min(Int(bandX), strip.width - 1))
            stripMean += Self.luminance(strip, x: x, y: sourceRow)
            captureMean += Self.luminance(capture, x: x, y: destRow)
            samples += 1
        }

        guard samples > 0 else { return }
        let delta = abs(stripMean - captureMean) / Double(samples)
        if delta > Tuning.validationTolerance {
            distrust()
        }
    }

    // ------------------------------------------------------------------------------ lifecycle

    func invalidateAll() {
        hasContent = false
        validMin = 0
        validMax = 0
    }

    func releaseResources() {
        texture = nil
        ringHeightPixels = 0
        widthPixels = 0
        invalidateAll()
    }

    // -------------------------------------------------------------------------------- helpers

    private static func pixelRow(for contentY: CGFloat, scale: CGFloat, ringHeight: Int) -> Int {
        guard ringHeight > 0 else { return 0 }
        let row = Int((contentY * scale).rounded(.down))
        return ((row % ringHeight) + ringHeight) % ringHeight
    }

    /// A cheap structural digest of the content subtree.
    ///
    /// Geometry and membership only: it costs one walk of the scroll content per frame and
    /// catches the failures a strip cannot model (a row inserted, a layer transformed). It
    /// cannot see a pixel change inside an otherwise identical subtree — that is what the
    /// settle validator is for.
    static func fingerprint(of content: UIView) -> UInt64 {
        var hash: UInt64 = 1469598103934665603
        var stack: [UIView] = [content]
        var visited = 0
        while let view = stack.popLast(), visited < 512 {
            visited += 1
            func mix(_ value: UInt64) {
                hash = (hash ^ value) &* 1099511628211
            }
            mix(UInt64(view.subviews.count))
            mix(UInt64(bitPattern: Int64(view.frame.origin.y.rounded())))
            mix(UInt64(bitPattern: Int64(view.frame.height.rounded())))
            mix(UInt64(bitPattern: Int64(view.alpha * 1000)))
            mix(UInt64(view.isHidden ? 1 : 0))
            if let presented = view.layer.presentation() {
                mix(UInt64(bitPattern: Int64(presented.transform.m11 * 10_000)))
                mix(UInt64(bitPattern: Int64(presented.opacity * 1000)))
            }
            stack.append(contentsOf: view.subviews)
        }
        return hash
    }

    private static func luminance(_ texture: MTLTexture, x: Int, y: Int) -> Double {
        var pixel = [UInt8](repeating: 0, count: 4)
        pixel.withUnsafeMutableBytes { buffer in
            texture.getBytes(
                buffer.baseAddress!,
                bytesPerRow: 4,
                from: MTLRegionMake2D(x, y, 1, 1),
                mipmapLevel: 0
            )
        }
        // bgra8Unorm
        let b = Double(pixel[0]) / 255
        let g = Double(pixel[1]) / 255
        let r = Double(pixel[2]) / 255
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
}
