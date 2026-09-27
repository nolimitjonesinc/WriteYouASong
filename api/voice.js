export const config = { runtime: 'edge' };

// Speaks the talk-it-through interviewer's lines with Gemini TTS, the same
// voice engine and voice RoadLore uses. Gemini returns raw PCM audio, so we
// wrap it in a WAV header. The key stays server-side.
//
// No key configured → 503, and the browser quietly falls back to its
// built-in voice.

const MODEL = 'gemini-2.5-flash-preview-tts';
const VOICE = 'Aoede';
const MAX_CHARS = 600; // interviewer lines are two short sentences

function wavHeader(pcmLength, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const buf = new ArrayBuffer(44);
  const v = new DataView(buf);
  const str = (off, s) => { for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i)); };
  str(0, 'RIFF');
  v.setUint32(4, 36 + pcmLength, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, channels, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * channels * (bitsPerSample / 8), true);
  v.setUint16(32, channels * (bitsPerSample / 8), true);
  v.setUint16(34, bitsPerSample, true);
  str(36, 'data');
  v.setUint32(40, pcmLength, true);
  return new Uint8Array(buf);
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: 'voice-not-configured' }, 503);

  let text = '';
  try {
    const body = await req.json();
    text = String(body.text || '').trim().slice(0, MAX_CHARS);
  } catch (err) {
    return json({ error: 'Bad request.' }, 400);
  }
  if (!text) return json({ error: 'Nothing to read.' }, 400);

  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } }
        }
      })
    });
    if (!res.ok) return json({ error: 'voice-failed' }, 502);

    const data = await res.json();
    const b64 = data && data.candidates && data.candidates[0] && data.candidates[0].content &&
      data.candidates[0].content.parts && data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].inlineData && data.candidates[0].content.parts[0].inlineData.data;
    if (!b64) return json({ error: 'voice-failed' }, 502);

    const bin = atob(b64);
    const pcm = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) pcm[i] = bin.charCodeAt(i);
    const header = wavHeader(pcm.length);
    const wav = new Uint8Array(header.length + pcm.length);
    wav.set(header, 0);
    wav.set(pcm, header.length);

    return new Response(wav, { status: 200, headers: { 'Content-Type': 'audio/wav', 'Cache-Control': 'no-store' } });
  } catch (err) {
    return json({ error: 'voice-failed' }, 502);
  }
}
