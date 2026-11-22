# Smooth Interactions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every click, drag and toggle in the simulator animates smoothly and gives clear feedback, with no tax-logic changes.

**Architecture:** Pure motion helpers (`src/lib/motion.ts`) and a debounced storage adapter (`src/store/debouncedStorage.ts`) are unit-tested. React hooks and components (`useAnimatedNumber`, `<AnimatedNumber>`, `<Collapse>`, `ToastProvider`) are built on them, and the existing cards adopt them. CSS handles transitions and reduced motion.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, Zustand 5 persist, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-22-smooth-interactions-design.md`

## Global Constraints
- No new runtime dependencies.
- Count-up duration is 350ms, ease-out, starting from the currently displayed value. The final value must always be rendered within 400ms.
- `prefers-reduced-motion: reduce` means no tweens: numbers jump straight to the value and CSS transitions are off.
- The localStorage write is debounced by 300ms and flushed on `pagehide`.
- Undo toast: 5000ms. At most 3 toasts are stacked.
- There must be no hydration mismatch: server render and first client render are identical.
- UI copy is in Bangla. Chat replies are in Banglish.

## Review Focus
1. Fast slider drag (≈60 updates/s): the last value must be persisted after the drag stops. Test: debounced storage writes only the final value.
2. A reload within 300ms of a change loses nothing. Test: `flush()` on `pagehide` writes the pending value.
3. A number changing again mid-tween must not snap back to the old value. Test: `interpolate` starts from the displayed value (hook uses current display as `from`).
4. Undo after reset restores exactly the previous income, investments and year. Covered in Task 3 by restoring a snapshot taken before `reset()`.
5. Reduced motion: values must still update, just with no animation. Test: `shouldAnimate(false)` returns the target immediately.

---

### Task 1: Motion helpers, `useAnimatedNumber`, global CSS

**Files:**
- Create: `src/lib/motion.ts`, `src/lib/__tests__/motion.test.ts`, `src/hooks/useAnimatedNumber.ts`, `src/components/ui/AnimatedNumber.tsx`
- Modify: `src/app/globals.css`, `vitest.config.mts` (add `src/**/*.test.ts` already covers `lib/__tests__`)

**Interfaces — Produces:**
- `easeOutCubic(t: number): number`, clamped to [0,1].
- `interpolate(from: number, to: number, t: number): number`, which returns `Math.round(from + (to - from) * easeOutCubic(t))`. When `t >= 1` it returns exactly `to`.
- `useAnimatedNumber(value: number, durationMs = 350): number`, which tweens from the last displayed value. Under reduced motion it returns `value` immediately.
- `<AnimatedNumber value={number} format={(n) => string} className? />`

- [ ] **Step 1: Failing tests:** `easeOutCubic(0)===0`, `easeOutCubic(1)===1`, `easeOutCubic(0.5)>0.5`; `interpolate(100,200,1)===200`; `interpolate(100,200,0)===100`; `interpolate(200,100,2)===100`.
- [ ] **Step 2:** Run `npx vitest run src/lib`. Expected: FAIL (module missing).
- [ ] **Step 3:** Implement `motion.ts`. The hook uses `requestAnimationFrame`. Reduced motion is read through `useSyncExternalStore` on `matchMedia('(prefers-reduced-motion: reduce)')`, with a server snapshot of `true` so SSR renders the raw value.
- [ ] **Step 4:** Add to `globals.css`:
  - `html{scroll-behavior:smooth}`
  - `[id]{scroll-margin-top:88px}`
  - `@keyframes pulse-ring` and `.flash` (an emerald ring that fades over 900ms)
  - `@keyframes toast-in`
  - a `@media (prefers-reduced-motion: reduce)` block that sets `scroll-behavior:auto` and gives all `*` elements a near-zero transition and animation duration
- [ ] **Step 5:** Run `npm test`. Expected: all pass. Commit `feat: motion helpers and animated numbers`.

### Task 2: Debounced persist storage

**Files:**
- Create: `src/store/debouncedStorage.ts`, `src/store/__tests__/debouncedStorage.test.ts`
- Modify: `src/store/useTaxStore.ts` (persist option `storage: createJSONStorage(() => debouncedLocalStorage)`)

**Interfaces — Produces:** `createDebouncedStorage(base: Pick<Storage,'getItem'|'setItem'|'removeItem'>, waitMs = 300): StateStorage & { flush(): void }`. `debouncedLocalStorage` registers `pagehide` → `flush()` (client only).

- [ ] **Step 1: Failing tests** (`vi.useFakeTimers()`, with a fake base that records calls):
  - Three `setItem` calls within 300ms → one base write containing the last value.
  - `flush()` before the timer fires → the pending value is written immediately.
  - `getItem` reads through to the base.
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3:** Implement and wire into the store. Use a lazy getter so the `window` check only happens on the client.
- [ ] **Step 4:** `npm test` passes. Commit `perf: debounce localStorage writes`.

### Task 3: Toasts, apply-plan feedback, reset with undo

**Files:**
- Create: `src/components/ui/Toast.tsx`
- Modify: `src/app/page.tsx` (wrap in `<ToastProvider>`), `src/components/AppShell.tsx` (reset), `src/components/AdviceCard.tsx` (apply), `src/components/InvestmentCard.tsx` (add `id="investments"` and a flash target)

**Interfaces — Produces:**
- `useToast(): { show(t: { message: string; tone?: 'success'|'info'; action?: { label: string; onClick: () => void }; durationMs?: number }): void }`
- `flash(elementId: string): void`, exported from `src/lib/motion.ts`. It removes and re-adds the `.flash` class.

- [ ] **Step 1:** Toast stack fixed at the bottom centre, above `MobileTaxBar` (`bottom-24 lg:bottom-6`). It animates in with `toast-in`, auto-dismisses, keeps at most 3, and uses `role="status"`.
- [ ] **Step 2: Reset.**
  1. Snapshot `{income, investments, rulesId, monthlyEntry}`.
  2. Call `reset()`.
  3. Show the toast "সব ইনপুট রিসেট হয়েছে" with the action "ফিরিয়ে আনুন", lasting 5000ms. The action restores the snapshot through `useTaxStore.setState`.
- [ ] **Step 3: Apply plan.** Call `setInvestments`, then:
  - show the toast "প্ল্যানটি বসানো হয়েছে — কর কমলো ৳X" (X = `advice.totalSaving`, formatted with `taka`);
  - call `flash('investments')`;
  - scroll the investments card into view on mobile only (`matchMedia('(max-width: 1023px)')`).
- [ ] **Step 4:** Run `npx tsc --noEmit && npm run lint && npm test`. Then check manually: drag, apply, reset → undo. Commit `feat: toast feedback, undo reset`.

### Task 4: Component polish

**Files:**
- Create: `src/components/ui/Collapse.tsx` (`<Collapse open={boolean}>`). It uses a `grid-rows-[0fr]` ↔ `grid-rows-[1fr]` transition over 300ms. Its children are inert when closed.
- Modify:
  - `SummaryCard.tsx`: net tax, monthly amount and rows use `<AnimatedNumber>`. Add `key={rules.id}` on a wrapper that gets the `.flash` class when the year changes.
  - `InvestmentCard.tsx`: rebate meter amounts use `AnimatedNumber`, and the extras panel uses `Collapse`.
  - `AdviceCard.tsx`: amounts use `AnimatedNumber`. The status change fades in (`animate-[fade-in_250ms]`, keyed by `advice.status`).
  - `AppShell.tsx`: `MobileTaxBar` amount uses `AnimatedNumber`. When the year selector changes, call `flash('summary')`.
  - `ui/primitives.tsx`: `Segmented` gets an absolutely positioned sliding pill. Its width and offset come from the index, since the options are equal-width (`grid-cols-N`). `Hint` becomes a `<button>` with an `open` state that toggles on click, opens on focus, and closes on blur or Escape. All buttons get `active:scale-[0.98]`. The category and stepper buttons in `ProfileCard.tsx` get the same press feedback.
  - `BreakdownCard.tsx`: totals use `AnimatedNumber`.
- [ ] **Step 1:** Implement.
- [ ] **Step 2:** Run `npx tsc --noEmit && npm run lint && npm test && npm run build`. Expected: all green.
- [ ] **Step 3:** Take headless screenshots at desktop (1440) and narrow (500) widths. Check: no layout shift, Segmented pill aligned, Collapse closed by default.
- [ ] **Step 4:** Commit `feat: smooth interactions across cards`.
