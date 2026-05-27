# Perforce Feature Request — Skybridge App

## Value proposition

A polished Claude Desktop / ChatGPT app that helps users file feature requests for products in the Perforce portfolio (Puppet, Puppet Cloud, Delphix, Helix, Perfecto). The LLM auto-detects which product the user is talking about and pre-fills the requirement; the user refines via a drag-and-drop product picker, a guided requirement textarea, and a form whose extra fields are tailored on demand by Claude. A single submit button hands the composed prompt off to a local intake service.

## UX flow

File a feature request:
1. **Pick product** — five draggable product tiles + drop zone. Auto-pre-selected if the LLM passed `product`. Click also works.
2. **Describe** — autosizing textarea, pre-filled from the LLM's extracted `requirement`.
3. **Tailor form** — base fields (Priority, Effort, Component) plus 1–2 AI-tailored slider/dropdown fields requested via "Tailor form to my requirement" (sends a follow-up message; Claude re-invokes the tool with `extraFields`).
4. **Review & submit** — read-only prompt preview + Submit button opens `http://localhost:3001/submit-request?prompt=<encoded>`.

## Tools and views

**View: `feature-request`**
- **Input:** `{ product?, requirement?, extraFields? }` — all optional so the LLM can call early with partial info and re-call with more.
- **Output:** `{ product, requirement, baseFields, extraFields }`.
- **Component:** `feature-request` (`src/views/feature-request.tsx`).
- **CSP:** `resourceDomains: [Google Fonts]`, `redirectDomains: ["http://localhost:3001"]`.
- **Behavior:** view holds the 4-step UI, owns its own form state via `useViewState`, and calls `useSendFollowUpMessage` to ask Claude for tailored extra fields. Submit uses `useOpenExternal`.

No other tools — this is one flow, one view.

## Visual design

- Perforce deep-purple palette (`--color-p4-50…900`), aurora-animated gradient background, Inter type, JetBrains Mono for the prompt preview, soft float/shimmer/pulse animations. Light and dark themes both supported via `useLayout`.

## Out of scope

- The intake backend at `localhost:3001` (consumed, not built).
- Authentication / persistence.
- Deployment to Alpic.
