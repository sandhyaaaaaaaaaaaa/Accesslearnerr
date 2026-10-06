let lastSpokenAt = 0;

export function speakGesture(text, cooldownMs = 1500) {
  if (!window.speechSynthesis || !text) return;

  const now = Date.now();
  if (now - lastSpokenAt < cooldownMs) return;
  lastSpokenAt = now;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) => v.lang.startsWith('en')) || voices[0];
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}

export function pauseReading() {
  if (window.speechSynthesis) {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    } else {
      window.speechSynthesis.cancel();
    }
  }
}
