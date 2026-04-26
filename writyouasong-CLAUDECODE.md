# BUILD SPEC — writyouasong.com
## Instructions for Claude Code

---

## WHAT YOU ARE BUILDING

A guided, tap-driven web app that interviews a user about someone they love, then generates personalized song lyrics using the Anthropic API. The user takes those lyrics and a style prompt to Suno.com to generate the actual song.

**One sentence:** Tell us about someone. We'll write them a song.

---

## STACK — KEEP IT SIMPLE

- **Frontend:** Single `index.html` file — vanilla HTML, CSS, JavaScript. No React. No npm. No build step. Zero dependencies except Google Fonts.
- **Backend:** One Vercel Edge Function at `/api/generate.js` — proxies the Anthropic API so the key is never exposed client-side
- **Hosting:** Vercel
- **Model:** `claude-haiku-4-5-20251001` — cheapest capable Anthropic model, ~$0.004 per song generated
- **Domain:** writyouasong.com (already purchased)
- **Payments:** Not in this version. Free launch to validate first.

---

## FILE STRUCTURE

```
/
├── index.html           ← entire frontend (all CSS + JS inline)
├── api/
│   └── generate.js      ← Vercel edge function, Anthropic proxy
├── vercel.json          ← routing config
└── CLAUDE.md            ← this file
```

---

## FILE 1: vercel.json

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

---

## FILE 2: api/generate.js

Vercel Edge Function. Receives POST with `{ messages }` from the frontend. Adds the API key from environment variables. Forwards to Anthropic. Returns response.

```javascript
export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1200,
        messages: body.messages
      })
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

**Environment variable required in Vercel dashboard:**
`ANTHROPIC_API_KEY` = your key from console.anthropic.com

---

## FILE 3: index.html

### Design System

```
Background:     #0D0D0D
Surface:        #181818
Surface2:       #222222
Border:         rgba(255,255,255,0.07)
Border active:  rgba(255,255,255,0.18)
Text:           #F0EDE8
Muted:          rgba(240,237,232,0.35)
Muted2:         rgba(240,237,232,0.55)
Gold accent:    #C9A96E
Gold soft:      rgba(201,169,110,0.13)
Green accent:   #7EB89A
Border radius:  14px (cards), 10px (chips/buttons)

Display font:   Cormorant Garamond — Google Fonts — weights 300, 400 italic
Body font:      Outfit — Google Fonts — weights 300, 400, 500, 600
```

### Layout Rules — Critical

- Every screen is `position: fixed; inset: 0` — full viewport, no scroll
- One screen visible at a time
- Screens animate in: `opacity 0→1, translateY 24px→0` over 380ms
- Screens animate out: `opacity 1→0, translateY 0→-18px` over 220ms
- Max content width: 460px, centered
- Exception: Result screen scrolls (overflow-y: auto)
- Progress bar: 2px gold line, fixed top of screen
- Back button: fixed top-left, shows/hides per screen

### Interaction Rules — Critical

- **Tapping a card or chip = auto-advance.** No continue button. Wait 190ms after tap for visual feedback, then navigate forward.
- **Only exception:** Name text input — needs an explicit Continue button because text input requires intent
- Chips auto-advance the question flow in the same way

---

## USER FLOW

```
1. INTRO SCREEN
   - Animated orb icon
   - Title: "Turn a feeling into a song."
   - Subtitle: "A few taps. We write the lyrics. You bring it to life."
   - One CTA button: "Let's make a song"

2. TOPIC SCREEN — "Who is this song for?"
   - 8 tap cards in 2-column grid:
     👫 A sibling
     🧡 A parent
     ✨ A best friend
     💛 A partner
     🌱 A child
     🐾 A pet
     🎓 A milestone
     🕊️ A loss
   - Below grid: text input row "Something else — type and press Enter…"
   - Tapping a card auto-advances to Name screen

3. NAME SCREEN — "What's their name?"
   - Single large text input (Cormorant Garamond 26px)
   - Label above: "THEIR NAME"
   - Placeholder: "e.g. Marco, Mom, Hurricane Maisie…"
   - Continue button (only manual button in the app)
   - Enter key also advances

4. GENRE SCREEN — "What kind of song?"
   - 9 genre cards in 3-column grid:
     🤠 Country
     🌟 Pop
     🎶 R&B / Soul
     🪗 Folk / Indie
     🎤 Hip Hop
     🎸 Rock
     🎷 Jazz
     🎻 Cinematic
     🌊 Electronic
   - Tapping auto-advances to Feeling screen

5. FEELING SCREEN — "When they hear this — what hits them?"
   - 5 vertical cards:
     🥹 I want them to cry — "The good kind. Overwhelmed with love."
     😂 I want them to laugh — "The kind that brings up everything."
     💫 I want them to feel seen — "Like someone finally said it."
     🌟 I want them to feel proud — "Of who they are. Of how far we've come."
     🕰️ I want them to remember — "A moment. A feeling. A version of us."
   - Each card has a dot indicator (turns green when selected)
   - Tapping auto-advances to Questions

6. QUESTIONS SCREEN — 6 questions, one at a time
   - Same screen, content swaps between questions
   - Eyebrow: "Question X of 6"
   - Title: the question text (Cormorant Garamond 28px)
   - Below: vertical list of chip buttons (rounded pills)
   - Below chips: text input row "Write your own answer…" with pencil emoji
   - Tapping a chip auto-advances to next question
   - Pressing Enter in text input advances
   - After question 6: trigger generateSong()
   - Question content is adaptive — different questions per topic (see Question Bank below)

7. LOADING SCREEN
   - Spinning gold ring with ♪ in center
   - Title: "Writing your song…"
   - Cycling lines that fade in/out:
     "Listening to everything you shared…"
     "Finding the right words…"
     "Shaping the verses…"
     "Almost there…"

8. RESULT SCREEN (scrollable)
   - Green badge: "✦ Your song is ready"
   - Song title in italic Cormorant Garamond
   - Meta line: "[Genre] · For [Name]"
   - Lyrics card: full lyrics with section labels ([Verse 1], [Chorus], etc.)
   - Copy Lyrics button
   - Suno Style Prompt card: style tags as pills + prompt text
   - Copy Prompt button
   - Suno Guide card: 5 numbered steps explaining exactly how to use Suno
   - Copy Everything button (primary CTA)
   - Make another song button (ghost)
```

---

## QUESTION BANK

Questions are adaptive based on the topic selected. Route by checking if the topic string includes keywords.

### Routing logic:
```javascript
function getQB(topic) {
  const t = topic.toLowerCase();
  if (t.includes('sibling') || t.includes('brother') || t.includes('sister')) return QB.sibling;
  if (t.includes('parent') || t.includes('mom') || t.includes('dad') || t.includes('mother') || t.includes('father')) return QB.parent;
  if (t.includes('friend')) return QB.friend;
  if (t.includes('partner') || t.includes('spouse') || t.includes('husband') || t.includes('wife')) return QB.partner;
  if (t.includes('child') || t.includes('toddler') || t.includes('baby') || t.includes('kid') || t.includes('son') || t.includes('daughter')) return QB.child;
  return QB.default;
}
```

### QB.sibling
```
Q1: Growing up, what was the dynamic?
  - Best friends from day one
  - We fought but always had each other
  - I looked up to them
  - They looked up to me
  - We were in our own worlds — until we weren't

Q2: A memory you never want to forget.
  - Something we got away with together
  - A trip we still talk about
  - Something dumb that became a legend
  - A quiet moment no one else knows about

Q3: How has the relationship changed over the years?
  - Only gotten closer
  - We drifted and found our way back
  - Life got busy but the bond never changed
  - We understand each other more now
  - It's complicated — but we're still here

Q4: Something they did you've never fully thanked them for.
  - Showed up when I needed it most
  - Believed in me before I did
  - Let me be who I needed to be
  - Kept my secret
  - Been my person when I had no one

Q5: A detail only the two of you share.
  - A nickname or phrase only we use
  - A running joke that never gets old
  - Something from home only we remember
  - A song or show that's just ours

Q6: The one thing you want them to hear.
  - Having you as my sibling is a gift
  - We've been through it — and I'd do it again
  - I don't say it enough but I love you
  - You made me who I am
  - Here's to all the years still ahead
```

### QB.parent
```
Q1: One word to describe them.
  - Strong / Sacrificing / Funny / Wise / Complicated / My everything

Q2: Something they taught you that you carry every day.
  - Work hard — always
  - Show up for the people you love
  - Laugh at yourself
  - Nothing is permanent
  - How to love without conditions

Q3: A moment — big or small — that captures who they are.
  - Something they gave up for me
  - A time they showed up when it mattered
  - Something they said I've never forgotten
  - The quiet way they handle hard things

Q4: What do you understand about them now that you didn't growing up?
  - How hard they worked just to keep things together
  - That they were figuring it out too
  - How much they sacrificed without saying a word
  - That they love differently than they say it

Q5: What's the occasion?
  - Their birthday / A holiday / Just because / A milestone / No occasion — I just want them to know

Q6: What do you most want them to feel?
  - That they did a good job
  - That I see them — really see them
  - That everything they gave me mattered
  - That I love them more than I say
  - That I'm proud to be their kid
```

### QB.friend
```
Q1: How did you become friends?
  - School — we never really left
  - Work threw us together and we stayed
  - Right place, right time
  - A mutual friend who doesn't know what they started
  - Gradual and then all at once

Q2: What makes this friendship different from all the rest?
  - We pick up right where we left off
  - They know my worst and stay anyway
  - We've been through the real stuff together
  - They make me funnier and braver
  - It just feels effortless

Q3: A story that's just the two of you.
  - A trip that went sideways in the best way
  - A night we still talk about
  - Something we survived together
  - An inside joke that will never die

Q4: When did they show up in a way that really mattered?
  - During a breakup or hard personal time
  - When I was at my lowest
  - When everyone else disappeared
  - In a quiet way — without me even asking

Q5: What's the current chapter of this friendship?
  - Same city, deep in it together
  - Different cities — but nothing has changed
  - We've grown a lot, and grown together
  - Life is busy but we're still us

Q6: What does this song need to say?
  - You are irreplaceable
  - I don't know who I'd be without you
  - You make my life so much better
  - Thank you — for all of it
  - I love you — in the full non-weird way
```

### QB.partner
```
Q1: How would you describe what you've built together?
  - A life I never could have imagined
  - A partnership that makes everything easier
  - Something complicated and beautiful
  - A family — in every sense
  - A love story still being written

Q2: A small detail about them you quietly adore.
  - Something they do every day without thinking
  - The way they are with the people they love
  - Something that used to drive me crazy — I'd miss it now
  - Something only I ever notice

Q3: A hard thing you've gotten through together.
  - Something big we didn't see coming
  - A season where everything felt uncertain
  - Something that tested us and made us stronger
  - Just being human together, honestly

Q4: A moment you'd relive if you could.
  - The moment I knew
  - An ordinary day that was somehow perfect
  - Something we laughed about until we couldn't breathe
  - The first time things felt real

Q5: What do you want to say that you don't say enough?
  - I choose you — every single day
  - What you carry for us doesn't go unnoticed
  - You are the best decision I ever made
  - You make me better

Q6: What's the occasion?
  - Anniversary / Birthday / Just because / Something we're celebrating / No occasion — I just want them to know
```

### QB.child
```
Q1: How has having them changed you?
  - I love differently than I knew was possible
  - I'm braver — because I have to be
  - Everything is harder and richer at once
  - I see the world through completely new eyes

Q2: One small thing about them you never want to forget.
  - The way they laugh
  - Something they say that's just them
  - A ritual or habit we share
  - The way they look at the world

Q3: What do you want to tell them about themselves?
  - You are braver than you know
  - You make everyone around you better
  - You are loved beyond measure
  - I'm so proud of who you're becoming

Q4: What milestone is this marking?
  - A birthday — they're growing up fast
  - A new chapter — school, growing, changing
  - Just right now, this exact age and moment
  - No milestone. Pure love.

Q5: What tone are you going for?
  - Joyful and celebratory
  - Tender and emotional
  - Playful and fun
  - Quiet and sincere

Q6: What do you most want them to know?
  - I loved you before I ever met you
  - Every single day with you is a gift
  - You can do anything — and I'll be right here
  - Nothing in this world matters more than you
```

### QB.default (pet, milestone, loss, custom)
```
Q1: How long has this been part of your life?
  - My whole life / More than 10 years / 5–10 years / A few years / Not long — but feels like forever

Q2: One word that captures it.
  - Unbreakable / Rare / Complicated / Easy / Everything

Q3: A memory or moment that defines it.
  - A road trip or adventure
  - A hard time we got through together
  - Something absurd that became legendary
  - A quiet moment I never forgot

Q4: Something you've never fully said thank you for.
  - Showed up when no one else did
  - Believed in me before I did
  - Made me laugh when I needed it most
  - Loved me through the hard version of me

Q5: A detail only you two would understand.
  - A phrase or nickname
  - A place only we know
  - A habit or ritual we share
  - A song or show that's ours

Q6: What do you want them to walk away knowing?
  - You changed my life
  - I don't say it enough — but I love you
  - We're in this together, always
  - Thank you. For all of it.
```

---

## CLAUDE API CALL

Client sends POST to `/api/generate`:
```javascript
const res = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
});
```

### Prompt template:
```
You are an expert songwriter. Create a deeply personal, emotionally resonant song. Return ONLY valid JSON — no markdown, no explanation, nothing else.

TOPIC: [S.topic]
NAME (use naturally in lyrics, minimum twice): [S.name]
GENRE: [S.genre]
EMOTIONAL INTENTION: [S.feeling]

ANSWERS:
- [Q1 text]
  → [user answer]
- [Q2 text]
  → [user answer]
[...repeat for all 6 questions]

Return this exact JSON:
{
  "title": "evocative song title — not generic",
  "sections": [
    {"label": "Verse 1", "lines": ["l1","l2","l3","l4"]},
    {"label": "Pre-Chorus", "lines": ["l1","l2"]},
    {"label": "Chorus", "lines": ["l1","l2","l3","l4"]},
    {"label": "Verse 2", "lines": ["l1","l2","l3","l4"]},
    {"label": "Chorus", "lines": ["l1","l2","l3","l4"]},
    {"label": "Bridge", "lines": ["l1","l2","l3"]},
    {"label": "Final Chorus", "lines": ["l1","l2","l3","l4"]},
    {"label": "Outro", "lines": ["l1","l2"]}
  ],
  "styleTags": ["tag1","tag2","tag3","tag4","tag5"],
  "sunoPrompt": "under 120 chars: genre, tempo, instrumentation, mood, vocal style"
}

Rules:
- Use [NAME] naturally in lyrics at least twice
- Pull specific details from the interview answers — specificity is everything
- Match lyric rhythm and structure to the genre
- Bridge = a turning point or revelation
- Outro = resolution or a lingering feeling
- No filler lines. No clichés. Write like a real songwriter.
```

### Parse response:
```javascript
const data = await res.json();
const raw = data.content.map(i => i.text || '').join('');
const result = JSON.parse(raw.replace(/```json|```/g, '').trim());
```

---

## SUNO GUIDE (shown on result screen)

Step 1: Go to suno.com and sign in or create a free account.
Step 2: Click Create → enable Custom Mode (toggle top right).
Step 3: Paste your lyrics in the Lyrics field. Paste the Style Prompt in Style of Music.
Step 4: Enter the song title shown above.
Step 5: Hit Create. Two versions generate — keep the one that lands hardest.

---

## STATE OBJECT

```javascript
const S = {
  topic: '',    // full topic string e.g. "A sibling — a brother or sister..."
  name: '',     // their name e.g. "Marco"
  genre: '',    // e.g. "Folk / Indie"
  feeling: '',  // full feeling string e.g. "I want them to cry — the good kind..."
  answers: {}   // keyed by question id: { q1: "answer", q2: "answer", ... }
};
```

---

## NAVIGATION

Use a screen history array. Each `go(screenId)` pushes to history and animates screens.
Back button pops history. When going back into questions, decrement question index and re-render.

```javascript
let screenHist = ['s-intro'];

function go(id) {
  // animate out current screen
  // push id to screenHist
  // animate in new screen
  // call updateChrome() to show/hide progress bar and back button
}

function goBack() {
  // pop screenHist
  // animate back to previous screen
  // if previous screen was s-q and qIdx > 0, decrement qIdx and re-render question
}
```

---

## PROGRESS BAR

Visible on all screens except: intro, loading, result.
Calculates percentage based on current screen and question index.

```javascript
const flow = ['s-topic', 's-name', 's-genre', 's-feeling', 's-q'];
// s-q counts as 4 + (qIdx / 6) steps out of 5 total
```

---

## DO NOT

- Add npm, package.json, or any build step
- Put ANTHROPIC_API_KEY anywhere in index.html or client code
- Add scroll to any screen except result
- Use Inter, Roboto, or system fonts
- Add continue buttons to tap screens (except name)
- Use a framework — vanilla only
- Add any features not listed here — ship lean, validate first

---

## AFTER BUILDING

1. Create GitHub repo named `writyouasong`
2. Push all files maintaining folder structure
3. Go to vercel.com → Add New Project → Import GitHub repo
4. Before deploying: Settings → Environment Variables → add `ANTHROPIC_API_KEY`
5. Deploy
6. Project Settings → Domains → add `writyouasong.com`
7. Update DNS at your registrar with the values Vercel provides
8. Test on mobile — open on iPhone, go through full flow, generate a song

---

## SUCCESS CRITERIA

The app works when:
- A user taps through in under 2 minutes with zero confusion
- A song generates with the person's name used naturally in lyrics
- The Suno prompt is specific and production-ready
- Copy buttons work on mobile
- The whole thing feels beautiful, calm, and emotional — not like a form
