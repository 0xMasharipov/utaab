# Thinking Orbs for CUTII AI

Replace CUTII's current 9-box "thinking" loader with the animated Thinking Orb, shown next to a "CUTİİ is thinking" label while Grok prepares a reply.

## What changes
- While CUTII is answering, the waiting bubble shows a blue orb (reasoning state) plus the translated "CUTİİ is thinking" text.
- Orb uses the UTAAB blue palette (no purple), about 20px, and stays still for users who prefer reduced motion.
- Header subtitle ("Course assistant") gets a small idle orb that switches to the thinking state while a reply is loading, so the status is visible at a glance.
- CUTII avatar, launcher, messages and Grok chat logic stay unchanged.

## Technical details
- Install `@yogesharc/thinking-orbs` (React only, no extra dependencies).
- In `src/components/education/CutiiAIPanel.tsx`, rewrite `ThinkingLoader` to render `<Orb state="reasoning" size={20} label=... className="text-sky-400" />` with the label text; keep `role="status"`.
- Header: `<Orb state={isLoading ? "reasoning" : "base"} size={14} />` before the status text.
- Remove unused `.cutii-thinking*` styles from `src/styles/education.css`.
- Verify build and take a Playwright screenshot of the open panel.
