# WriteYouASong — Tasks

**Last updated:** September 28, 2026

No `PROJECT.md` yet — the original build spec is `writyouasong-CLAUDECODE.md`.

## Next up
- [ ] **Turn on the Gemini voice for "Talk it through."** Danny adds `GEMINI_API_KEY` in Vercel → project `write-you-a-song` → Settings → Environment Variables (tick Preview and Production). A fresh free key from aistudio.google.com/apikey keeps RoadLore's allowance separate. Then redeploy the `experience-and-voice` preview. Until then the interviewer uses the phone's built-in voice.
- [ ] **Test "Talk it through" on a real iPhone** with the Gemini voice on: it speaks the first question, listens hands-free, sends the answer after a pause, and wraps up with "Write my song."
- [ ] Try the Gemini voice "Aoede" (same as RoadLore) and decide whether to keep it or pick another Gemini voice.
- [ ] Merge branch `experience-and-voice` into `main` once the phone test passes (main is the live site).

## Doing now
- [ ] Nothing in progress.

## Done
- [x] Sep 27, 2026 — "A person / A moment we shared" toggle with question sets for trips, college days, favorite memories, and family traditions.
- [x] Sep 27, 2026 — Best-fit style suggestions on the genre screen, with a vibe line passed to the songwriter.
- [x] Sep 27, 2026 — "Talk it through" spoken interview (adapted from Embers), with typing as a fallback.
- [x] Sep 27, 2026 — Gemini voice (Aoede) wired in on the server with automatic fallback to the built-in voice. Tested with stand-ins only.
- [x] Sep 27, 2026 — Gold-trim restyle and logo brought over from the design-exploration branch.

## Someday / maybe
- Kokoro (the free voice that runs on the phone itself, used in Loomiverse) as a no-cost alternative. Parked because of its big first-time download on phones.
- Fix the old timing quirk where two screens can show at once if the AI answers in under a quarter second (only seen with instant test stand-ins).
