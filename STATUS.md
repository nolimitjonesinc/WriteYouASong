# WriteYouASong — Status
_Auto-updated by Status Brain on every push. Last change: Add Status Brain workflow for automated project status generation._

**Status:** Live  
**What it is:** A web app that generates custom songs based on user input, powered by Claude AI for lyrics and Suno for music generation.  
**Stack:** HTML/JavaScript frontend, Node.js backend (Vercel serverless), Claude Sonnet 4.6 API, Suno API.

## What works right now
- User enters song details (topic, style, mood, etc.) via web form
- Editable prompt review screen before song generation starts
- Song lyric generation using Claude Sonnet 4.6
- Result screen displaying generated lyrics
- Try Again button to regenerate songs with same prompt
- Refine button to modify prompt and regenerate
- Editable lyrics directly on result screen
- Copy button in prompt card header (Suno-style UI)
- Auto-scroll to top after regenerate or refine actions
- Deployed and live on Vercel

## Recent changes (newest first)
- 2026-07-20 — Added Status Brain workflow for automated status file generation
- 2026-07-20 — Added Status Brain script (`status-brain.mjs`)
- 2026-04-26 — Switched song generation model from Haiku to Claude Sonnet 4.6
- 2026-04-26 — Added editable prompt review screen before song generation
- 2026-04-26 — Moved copy button inside Suno-style prompt card header
- 2026-04-26 — Auto-scroll result screen to top after regenerate or refine
- 2026-04-26 — Added Try Again, Refine, and editable lyrics to result screen
- 2026-04-25 — Initial build: full WriteYouASong app with core functionality

## Reusable parts (for other projects)
- **Status Brain automation** — Auto-generates project status file on every push via GitHub Actions — `.github/workflows/status-brain.yml` and `status-brain.mjs`

## Not done / next
- No `package.json` visible (project dependencies and build setup unclear)
- No README documenting how to run or deploy locally
- Error handling and edge cases not documented
- Suno API integration status and music generation flow unclear from available code
- No user authentication or rate limiting implemented
- No analytics or usage tracking
- Missing documentation on API keys and environment variable setup
