import Metal
import UIKit

protocol GlassFrameParticipant: AnyObject {

    var glassWindow: UIWindow? { get }

    var glassRegionInWindow: CGRect? { get }

    var glassBackdropPadding: CGFloat { get }

    var glassCaptureScale: CGFloat { get }

    func glassDrawRequest(backdrop: MTLTexture, captureScale: CGFloat, backdropDidChange: Bool)
        -> GlassDrawRequest?
}

final class GlassFrameScheduler {

    static let shared = GlassFrameScheduler()

    private final class Weak {
        weak var value: GlassFrameParticipant?
        init(_ value: GlassFrameParticipant) { self.value = value }
    }

    private var participants: [Weak] = []
    private var displayLink: CADisplayLink?
    private var observer: CFRunLoopObserver?

    private var batch: [GlassDrawRequest] = []

    private var frameIsPending = false

    private var backdropDidChange = false

    private var lastSubmissionDropped = false

    private var frameDuration: CFTimeInterval = 1.0 / 60.0

    private var lastFrameTimestamp: CFTimeInterval = 0
    private var isUnderLoad = false

    private init() {}

    func add(_ participant: GlassFrameParticipant) {
        prune()
        guard !participants.contains(where: { $0.value === participant }) else { return }
        participants.append(Weak(participant))
        start()
    }

    func remove(_ participant: GlassFrameParticipant) {
        participants.removeAll { $0.value === participant || $0.value == nil }
        stopIfIdle()
    }

    private func prune() {
        participants.removeAll { $0.value == nil }
    }

    private func start() {
        guard displayLink == nil else { return }

        let link = CADisplayLink(target: self, selector: #selector(tick))
        link.add(to: .main, forMode: .common)
        displayLink = link

        let observer = CFRunLoopObserverCreateWithHandler(
            kCFAllocatorDefault,
            CFRunLoopActivity.beforeWaiting.rawValue,
            true,
            0
        ) { [weak self] _, _ in
            self?.gatherIfPending()
        }

        if let observer {
            CFRunLoopAddObserver(CFRunLoopGetMain(), observer, .commonModes)
            self.observer = observer
        }
    }

    private func stopIfIdle() {
        guard participants.isEmpty else { return }

        displayLink?.invalidate()
        displayLink = nil

        if let observer {
            CFRunLoopRemoveObserver(CFRunLoopGetMain(), observer, .commonModes)
        }
        observer = nil
        frameIsPending = false
        batch.removeAll(keepingCapacity: false)

        BackdropCapturer.shared.releaseResources()
    }

    @objc private func tick(_ link: CADisplayLink) {
        frameDuration = max(link.targetTimestamp - link.timestamp, 1.0 / 120.0)

        let elapsed = link.timestamp - lastFrameTimestamp
        isUnderLoad = lastFrameTimestamp > 0 && elapsed > frameDuration * 1.5
        lastFrameTimestamp = link.timestamp

        if frameIsPending { gather() }

        prune()
        guard !participants.isEmpty else { return }

        backdropDidChange = captureBackdrop()
        frameIsPending = true
    }

    /// Photographs the backdrop for this frame, in whichever scope the participants use.
    ///
    /// A participant inside a `GlassBackdrop` photographs the scroll content in content
    /// coordinates and the static bands in window coordinates; everyone else keeps the
    /// whole-window capture. When a strip is in service its scale owns the capture, because the
    /// content band is composited into the capturer's texture with a blit and a blit cannot
    /// resize.
    private func captureBackdrop() -> Bool {

        var region: CGRect = .null
        var window: UIWindow?
        var scale: CGFloat = 1
        var stripScope: StripScope?

        for entry in participants {
            guard let participant = entry.value,
                  let frame = participant.glassRegionInWindow
            else { continue }
            window = window ?? participant.glassWindow
            let padding = participant.glassBackdropPadding
            let padded = frame.insetBy(dx: -padding, dy: -padding)
            region = region.isNull ? padded : region.union(padded)
            scale = max(scale, participant.glassCaptureScale)

            if stripScope == nil,
               let view = participant as? UIView,
               let provider = GlassBackdropRegistry.shared.nearestProvider(for: view),
               let scroll = provider.resolveScrollView(),
               let content = provider.resolveContentContainer(),
               let cache = provider.stripCache(for: scroll) {
                let offset = GlassFramePhase.presentedOffsetY(of: scroll)
                if let served = cache.sync(
                    scrollView: scroll,
                    content: content,
                    offsetY: offset,
                    contentHeight: scroll.contentSize.height,
                    scale: provider.stripScale
                ) {
                    stripScope = StripScope(
                        cache: cache,
                        provider: provider,
                        scrollView: scroll,
                        servedOffsetY: served
                    )
                    scale = cache.scale
                } else {
                    provider.reportUnusable(true)
                }
            }
        }

        guard !region.isNull, let window else { return false }

        let stripActive = stripScope != nil
        if stripActive {
            GlassFramePhase.beginTransactionalPresentation(in: window)
        } else {
            GlassFramePhase.endTransactionalPresentation(in: window)
        }

        let didCapture = GlassFramePhase.signpostResult("captureBackdrop") {
            BackdropCapturer.shared.capture(
                window: window,
                region: region,
                scale: scale,
                frameDuration: frameDuration,
                isUnderLoad: isUnderLoad,
                // A strip only replaces the content band; the static bands above and below it
                // must still be fresh, so their capture is not gated by the movement margin.
                ignoreMovementGate: stripActive
            )
        }

        guard let scope = stripScope, let texture = BackdropCapturer.shared.texture else {
            return didCapture
        }

        let presented = GlassFramePhase.presentedFrame(of: scope.scrollView, in: window)
        let composited = scope.cache.composite(
            into: texture,
            scrollFrame: presented,
            capturedOrigin: BackdropCapturer.shared.capturedOrigin,
            contentOffsetY: scope.servedOffsetY
        )

        if composited {
            scope.provider.reportUnusable(false)
        } else {
            // The ring could not serve the band. The capture that just ran holds the true band
            // for this frame, so nothing is stale yet — but the next frame needs rows, so the
            // cache re-seeds rather than continuing to composite a hole.
            scope.cache.invalidateAll()
        }

        if didCapture {
            scope.cache.validate(
                against: texture,
                scrollFrame: presented,
                capturedOrigin: BackdropCapturer.shared.capturedOrigin,
                contentOffsetY: scope.servedOffsetY
            )
        }

        return didCapture
    }

    /// The one strip scope this frame serves. Only the first is tracked: two independently
    /// scrolling documents under one glass is a nested-scroller case the strip model does not
    /// claim, and the second scope keeps the window capture.
    private struct StripScope {
        let cache: StripCache
        let provider: GlassBackdropView
        let scrollView: UIScrollView
        let servedOffsetY: CGFloat
    }

    private func gatherIfPending() {
        guard frameIsPending else { return }
        frameIsPending = false
        gather()
    }

    private func gather() {
        let capturer = BackdropCapturer.shared
        guard let backdrop = capturer.texture else { return }

        let changed = backdropDidChange || lastSubmissionDropped
        backdropDidChange = false

        let scale = capturer.textureScale
        batch.removeAll(keepingCapacity: true)

        for entry in participants {
            guard let participant = entry.value,
                  let request = participant.glassDrawRequest(
                      backdrop: backdrop,
                      captureScale: scale,
                      backdropDidChange: changed
                  )
            else { continue }
            batch.append(request)
        }

        lastSubmissionDropped = !GlassRenderer.shared.submit(batch)
    }
}
