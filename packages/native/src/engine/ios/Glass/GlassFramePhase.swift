import QuartzCore
import UIKit
import os

// =============================================================================================
//  GlassFramePhase — put the glass pass in the same frame as the content it refracts.
//
//  Two independent sources of swim live in this file, and both are phase problems rather than
//  shader problems:
//
//  1. The glass pass must run BEFORE the CoreAnimation commit for the frame it belongs to. If it
//     runs after, the window capture shows commit N's content while the glass reads commit N-1's
//     positions — at 1,500 pt/s that is 25 pt of misalignment, visible as swimming. The scheduler
//     already drives from a `beforeWaiting` run-loop observer for exactly this reason; this file
//     pins the remaining half: `presentsWithTransaction`, so the drawable is presented inside the
//     same transaction instead of on Metal's own cadence.
//
//  2. `render(in:)` draws the MODEL tree. During a scroll, a drag or a spring, the model is where
//     the animation is GOING. Geometry, opacity and transform must therefore be read from
//     `presentation()`, while contents still come from the model layers (presentation layers
//     carry none).
// =============================================================================================

enum GlassFramePhase {

    private static let log = OSLog(subsystem: "com.glacia.glass", category: "FramePhase")

    /// Windows whose surfaces have already been switched to transactional presentation.
    ///
    /// `presentsWithTransaction` is a per-layer settable property, and switching it on every
    /// frame would flush the CA transaction for no reason, so it is set once per window and
    /// cleared when the last participant unsubscribes. Only windows with an active strip get it:
    /// a still photograph has no phase to align.
    private static var transactionalWindows: [ObjectIdentifier: WeakWindow] = [:]

    private struct WeakWindow {
        weak var window: UIWindow?
    }

    /// Marks every `CAMetalLayer` in `window` as inside the CA transaction. Idempotent.
    static func beginTransactionalPresentation(in window: UIWindow?) {
        guard let window else { return }
        let key = ObjectIdentifier(window)
        if transactionalWindows[key]?.window === window { return }

        setPresentsWithTransaction(true, in: window)
        transactionalWindows[key] = WeakWindow(window: window)
    }

    /// Restores Metal's own presentation cadence for a window that no longer has a strip.
    static func endTransactionalPresentation(in window: UIWindow?) {
        guard let window else { return }
        let key = ObjectIdentifier(window)
        guard transactionalWindows[key] != nil else { return }
        setPresentsWithTransaction(false, in: window)
        transactionalWindows.removeValue(forKey: key)
    }

    private static func setPresentsWithTransaction(_ value: Bool, in window: UIWindow) {
        var stack: [UIView] = [window]
        while let view = stack.popLast() {
            if let metal = view.layer as? CAMetalLayer {
                metal.presentsWithTransaction = value
            }
            stack.append(contentsOf: view.subviews)
        }
    }

    /// The window-space frame a surface will present this commit.
    ///
    /// Model frames are one commit ahead during an animation; the presentation layer is what the
    /// display is showing. Falls back to the model layer before the first commit, where both are
    /// the same and there is nothing to present yet.
    static func presentedFrame(of view: UIView, in window: UIWindow) -> CGRect {
        let frame = view.glaciaPresentationFrame
        guard frame.width > 0, frame.height > 0 else {
            return view.convert(view.bounds, to: window)
        }
        // Presentation frames live in the superlayer's coordinate space, which for a view that
        // has not moved relative to its superview is the model space. Convert through the
        // superview, which is the layer whose space the frame is expressed in.
        let anchor = view.superview ?? view
        let bounds = CGRect(origin: .zero, size: frame.size)
        let inAnchor = anchor.convert(bounds, to: window)
        return CGRect(
            x: inAnchor.minX + (frame.minX - view.frame.minX),
            y: inAnchor.minY + (frame.minY - view.frame.minY),
            width: frame.width,
            height: frame.height
        )
    }

    /// The content offset the display is showing, which the strip composite must use.
    static func presentedOffsetY(of scrollView: UIScrollView) -> CGFloat {
        scrollView.glaciaPresentedContentOffsetY
    }

    // ------------------------------------------------------------------------------- profiling

    /// Step 1 of the §3 prototype: is the frame's cost the tree walk or the pixels?
    ///
    /// Both the capture and the per-participant request build are bracketed, so a device profile
    /// separates "window snapshot" from "glass draw submission" without guessing. The intervals
    /// are named for Instruments' Points of Interest track.
    /// Brackets `body` and returns its result, so a call site keeps its shape.
    static func signpostResult<T>(_ name: StaticString, _ body: () -> T) -> T {
        os_signpost(.begin, log: log, name: name)
        let value = body()
        os_signpost(.end, log: log, name: name)
        return value
    }

    static func signpost(_ name: StaticString, _ body: () -> Void) {
        os_signpost(.begin, log: log, name: name)
        body()
        os_signpost(.end, log: log, name: name)
    }

    static func signpostBegin(_ name: StaticString) {
        os_signpost(.begin, log: log, name: name)
    }

    static func signpostEnd(_ name: StaticString) {
        os_signpost(.end, log: log, name: name)
    }
}
