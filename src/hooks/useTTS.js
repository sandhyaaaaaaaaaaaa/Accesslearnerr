import { useState, useEffect, useCallback, useRef } from 'react';

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const utteranceRef = useRef(null);
  const wordsRef = useRef([]);
  const wordBoundariesRef = useRef([]);

  useEffect(() => {
    const loadVoices = () => {
      const available = speechSynthesis.getVoices();
      setVoices(available);
      if (!selectedVoice && available.length > 0) {
        const preferred = available.find((v) => v.lang.startsWith('en')) || available[0];
        setSelectedVoice(preferred);
      }
    };
    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, [selectedVoice]);

  const speak = useCallback(
    (text) => {
      speechSynthesis.cancel();
      const words = text.split(/(\s+)/).filter(Boolean);
      wordsRef.current = words;
      wordBoundariesRef.current = [];
      setCurrentWordIndex(-1);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      if (selectedVoice) utterance.voice = selectedVoice;

      let charIndex = 0;
      const plainWords = text.split(/\s+/).filter(Boolean);
      let wordIdx = 0;

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          setCurrentWordIndex(wordIdx);
          wordIdx++;
        }
      };

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentWordIndex(-1);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
        setCurrentWordIndex(-1);
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    },
    [rate, pitch, selectedVoice]
  );

  const pause = useCallback(() => {
    speechSynthesis.pause();
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    speechSynthesis.resume();
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentWordIndex(-1);
  }, []);

  return {
    isPlaying,
    currentWordIndex,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch,
    speak,
    pause,
    resume,
    stop,
  };
}

export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      const val = value instanceof Function ? value(stored) : value;
      setStored(val);
      localStorage.setItem(key, JSON.stringify(val));
    },
    [key, stored]
  );

  return [stored, setValue];
}
