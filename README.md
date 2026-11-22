# করহিসাব: NBR Tax & Investment Rebate Simulator

A Bangladesh income-tax and investment-rebate calculator for salaried people. It follows NBR's **আয়কর নির্দেশিকা ২০২৬-২৭** (tax year 2026-27, income year 2025-26).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # tests built from NBR's own worked examples
npm run build
```

## Stack

- Next.js 16 (App Router) with TypeScript
- Tailwind CSS v4
- Zustand, saving inputs to localStorage
- lucide-react icons
- Vitest for tests

## Docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): the architecture, the tax rules with their NBR page references, and how to add a new budget year.
- `nbr_tax_simulator_a_to_z_blueprint.md`: the original blueprint. Its tax rules (3.5 lakh threshold, 15% rebate, 10 lakh cap) are outdated. The current rules live in `src/lib/tax/rules/`.

## Disclaimer

The results are estimates, not legal or financial advice.
