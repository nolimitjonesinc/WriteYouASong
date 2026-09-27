# WriteYouASong — Status
_Auto-updated by Status Brain on every push. Last change: Talk-it-through voice: use RoadLore's Gemini TTS voice (Aoede)._

**Status:** Live  
**What it is:** A web app that generates custom songs based on user input, powered by Claude AI for lyrics and Suno for music generation.  
**Stack:** HTML/JavaScript frontend, Node.js backend (Vercel serverless), Claude Sonnet 4.6 API, Suno API, Gemini TTS for voice.

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
- "A moment we shared" song template
- Style best-fit recommendations
- Talk-it-through voice interview mode with Gemini TTS voice (Aoede)
- Gold-accent visual polish and custom logo
- Deployed and live on Vercel

## Recent changes (newest first)
- 2026-09-27 — Talk-it-through voice: use RoadLore's Gemini TTS voice (Aoede)
- 2026-09-27 — Add "a moment we shared" songs, style best-fits, and talk-it-through voice interview
- 2026-09-27 — Design exploration: gold-accent visual polish, logo, twemoji
- 2026-07-20 — Harden Status Brain: retry-with-rebase on push
- 2026-07-20 — Add Status Brain workflow and script for automated status generation
- 2026-04-26 — Switch song generation from Haiku to Sonnet 4.6
- 2026-04-26 — Add editable prompt review screen before song generation
- 2026-04-26 — Move copy button inside Suno style prompt card header

## Reusable parts (for other projects)
- **Status Brain automation** — Auto-generates project status file on every push via GitHub Actions — `.github/workflows/status-brain.yml` and `status-brain.mjs`

## Not done / next
- No `package.json` visible (project dependencies and build setup unclear)
- No README documenting how to run or deploy locally
- Error handling and edge cases not documented
- Suno API integration status and music generation flow unclear from available code
- Voice interview feature implementation details unclear
- Style best-fit logic and algorithm not visible in provided code
- No user authentication or rate limiting implemented
- No analytics or usage tracking
- Missing documentation on API keys and environment variable setup
- TTS voice integration testing and reliability unclear
