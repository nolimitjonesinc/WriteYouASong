# WriteYouASong — Status
_Auto-updated by Status Brain on every push. Last change: Add Status Brain workflow to auto-generate project status on each commit._

**Status:** Live  
**What it is:** A web app that generates custom songs based on user input, powered by Claude AI and Suno music generation.  
**Stack:** HTML/JavaScript frontend, Node.js backend (Vercel serverless), Claude API, Suno API.

## What works right now
- User enters song details (topic, style, mood, etc.)
- Editable prompt review screen before generation
- Song generation using Claude Sonnet 4.6 for lyrics
- Result screen displaying generated song with lyrics
- Try Again button to regenerate songs
- Refine button to adjust and regenerate
- Editable lyrics directly on result screen
- Copy button in prompt card header (Suno style UI)
- Auto-scroll to top after regenerate or refine actions
- Deployed and accessible live

## Recent changes (newest first)
- 2026-07-20 — Added Status Brain workflow automation
- 2026-07-20 — Added Status Brain script for auto-generating project status
- 2026-04-26 — Switched song generation model from Haiku to Claude Sonnet 4.6
- 2026-04-26 — Added editable prompt review screen before song generation
- 2026-04-26 — Moved copy button inside Suno-style prompt card header
- 2026-04-26 — Auto-scroll result screen to top after regenerate or refine
- 2026-04-26 — Added Try Again, Refine, and editable lyrics to result screen
- 2026-04-25 — Initial build: full WriteYouASong app with core functionality

## Reusable parts (for other projects)
- **Status Brain automation** — Auto-generates project status file on every push via GitHub Actions — `.github/workflows/status-brain.yml` and `status-brain.mjs`

## Not done / next
- No package.json visible (dependencies unclear)
- No README documenting how to run/deploy locally
- No error handling details visible
- Suno API integration status unclear from code review
- Music generation UI/UX flow not fully documented
- User authentication/rate limiting not implemented
- No analytics or usage tracking
