# Smooth interactions: short design

**Intent:** Every click, drag and toggle in the simulator should feel smooth and give clear feedback before the public launch. Numbers should not jump, the layout should not shift, and no action should leave the user unsure what happened.

**Goals**
- Animated number changes (count-up) for the net tax, summary rows, the rebate meter and the advice amounts.
- Smooth slider dragging: store updates stay live, but the localStorage write is debounced.
- "Apply plan" shows a toast confirming the plan was added, highlights the investment card, and the advice card changes state with a transition instead of jumping.
- Reset shows a toast with an **Undo** button for 5 seconds.
- The "more investment types" panel opens and closes with a height animation.
- The segmented controls get a sliding highlight.
- Smooth anchor scrolling, with `scroll-margin` so the sticky header never covers the summary.
- Tooltips also open on tap and keyboard focus (mobile).
- The year selector gives a brief visual pulse on the summary when the year changes.
- All motion respects `prefers-reduced-motion`.

**Non-goals:** no new animation library, no visual redesign, no change to any tax logic.

**Anti-goals:** animation must never delay or hide the real number (the final value always shows within ~400ms), and nothing may cause a hydration mismatch.

**Approaches considered**
1. **CSS transitions plus small hooks (chosen).** No dependency, tiny bundle, and full control over reduced motion.
2. **Framer Motion.** A richer API, but it adds about 40KB and is overkill for these effects.
3. **The View Transitions API.** Browser support is uneven and it is awkward for continuous slider updates.

The user approved approach 1 on 2026-11-22.

**Builder's calls**
- Count-up uses `requestAnimationFrame` with ease-out over about 350ms and starts from the currently displayed value.
- The toast is a single context provider with a stack of at most 3 toasts.
- The localStorage debounce is about 300ms and flushes on `pagehide`.
- The height animation uses the CSS `grid-template-rows: 0fr → 1fr` technique.
