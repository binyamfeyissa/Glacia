import ExpoModulesCore
import UIKit

// =============================================================================================
//  GlassBackdrop — a bounded backdrop scope for the pre-iOS-26 renderer.
//
//  The renderer used to photograph the whole window and let the glass lens read that snapshot.
//  That is fine for a fixed background and wrong for content that scrolls: the snapshot is of
//  the screen, the content moves inside it, and the governor stops capturing during motion, so a
//  dragged pane refracts a stale photograph until the finger lifts.
//
//  A `GlassBackdrop` narrows the scope instead. Glass inside it photographs the scroll content
//  in CONTENT coordinates (see StripCache) and the two static bands around it in window
//  coordinates. The scroll view to track is found deterministically: an explicit tag wins, then
//  the first descendant UIScrollView (RN's Fabric host `RCTScrollViewComponentView` hosts one),
//  and only with none of those does the window walk fall back to the old whole-window capture.
//
//  This is the Dart/ArkUI provider contract the Android renderer already uses, expressed for
//  UIKit: the view exists to mark the subtree, it draws nothing and never lays out content.
// =============================================================================================

/// Marks a subtree whose glass should photograph its own scroll content, not the window.
///
/// Add it above a glass surface and the scroll view inside it, in any order; the provider and
/// the surfaces find each other through the registry, so neither needs a ref to the other.
final class GlassBackdropView: ExpoView {

    /// The scroll view to photograph in content coordinates. Set it directly when the subtree
    /// holds more than one; otherwise the first descendant scroll view is used.
    weak var trackedScrollView: UIScrollView?

    /// The strip cache for this scope. One per provider: two providers on screen are two
    /// independent content scopes with their own ring buffers.
    private(set) var strip: StripCache?

    /// Set while `strip` cannot honour the geometry (an oversized band, a jump, a chip stack of
    /// failures) so the scheduler uses the window capture for this scope and the surface labels
    /// the glass as borrowing a still photograph.
    private(set) var stripIsUsable = true

    override class var layerClass: AnyClass { NonRenderableLayer.self }

    override func didMoveToWindow() {
        super.didMoveToWindow()
        if window == nil {
            GlassBackdropRegistry.shared.unregister(self)
        } else {
            GlassBackdropRegistry.shared.register(self)
        }
    }

    /// Resolves once per frame and caches until the view tree changes.
    func resolveScrollView() -> UIScrollView? {
        if let trackedScrollView { return trackedScrollView }
        trackedScrollView = firstScrollView(in: self)
        return trackedScrollView
    }

    private func firstScrollView(in view: UIView) -> UIScrollView? {
        for child in view.subviews {
            if let scroll = child as? UIScrollView { return scroll }
            if let nested = firstScrollView(in: child) { return nested }
        }
        return nil
    }

    /// The cache for this scope, created on first use. Nil when Metal is unavailable.
    func stripCache(for scroll: UIScrollView) -> StripCache? {
        guard scroll.contentSize.height > scroll.bounds.height else { return nil }
        if let strip { return strip }
        guard let device = GlassRenderContext.shared?.device,
              let cache = StripCache(device: device)
        else { return nil }
        strip = cache
        return cache
    }

    /// Scale the ring is rasterised at. The fallback capture scale, capped: a strip at 3x of a
    /// tall viewport is memory the cache cannot justify, and the lens blurs more than it resolves.
    var stripScale: CGFloat {
        max(1, min(window?.screen.scale ?? 2, 2))
    }

    /// The view whose layer is drawn in content coordinates.
    ///
    /// In RN Fabric the scroll view hosts `RCTScrollContentView` as its first child; on UIKit
    /// it is the document view. The tallest direct child is the content container in both, and
    /// the scroll view itself is only the last resort (drawing it would apply the clip and
    /// photograph the window band the strip exists to replace).
    func resolveContentContainer() -> UIView? {
        guard let scroll = resolveScrollView() else { return nil }
        return scroll.subviews
            .filter { !$0.isHidden && $0.alpha > 0.01 }
            .max { $0.frame.height < $1.frame.height } ?? scroll
    }

    /// True when any glass surface on screen is inside this provider.
    var isInUse: Bool { GlassBackdropRegistry.shared.isReferenced(self) }

    func reportUnusable(_ unusable: Bool) {
        stripIsUsable = !unusable
    }
}

/// Finds the provider that owns a given view, and keeps track of live providers.
///
/// Walking up from the surface is bounded by the view hierarchy's depth, not by the window's
/// size, and stops at the first match, so a provider inside a provider scopes the inner glass
/// only. That is the rule the Android provider has: the nearest scope wins.
final class GlassBackdropRegistry {

    static let shared = GlassBackdropRegistry()

    private struct Entry {
        weak var view: GlassBackdropView?
    }

    private var entries: [Entry] = []

    func register(_ view: GlassBackdropView) {
        prune()
        if entries.contains(where: { $0.view === view }) { return }
        entries.append(Entry(view: view))
    }

    func unregister(_ view: GlassBackdropView) {
        entries.removeAll { $0.view == nil || $0.view === view }
    }

    /// The nearest enclosing provider for `view`, or nil when the view photographs the window.
    func nearestProvider(for view: UIView) -> GlassBackdropView? {
        var node: UIView? = view.superview
        while let current = node {
            if let provider = current as? GlassBackdropView { return provider }
            node = current.superview
        }
        return nil
    }

    /// Providers currently on screen, oldest first. The scheduler only audits referenced ones.
    var providers: [GlassBackdropView] {
        prune()
        return entries.compactMap(\.view)
    }

    func isReferenced(_ view: GlassBackdropView) -> Bool {
        view.window != nil
    }

    private func prune() {
        entries.removeAll { $0.view == nil }
    }
}

extension UIView {

    /// The frame the next commit will present.
    ///
    /// `render(in:)` draws the MODEL tree, so a capture taken during an animation shows where
    /// the layer is going, not where it is on screen this frame. Every geometry read on the
    /// capture path goes through the presentation layer for that reason; content still arrives
    /// from the model tree, because presentation layers carry no contents of their own.
    var glaciaPresentationFrame: CGRect {
        layer.presentation()?.frame ?? layer.frame
    }

    /// The content offset the current frame is presenting, in content coordinates. This is the
    /// number the strip cache must use: the model offset is one frame ahead at 60 Hz.
    var glaciaPresentedContentOffsetY: CGFloat {
        if let scroll = self as? UIScrollView,
           let presented = scroll.layer.presentation() {
            return presented.bounds.origin.y
        }
        return (self as? UIScrollView)?.contentOffset.y ?? 0
    }
}
