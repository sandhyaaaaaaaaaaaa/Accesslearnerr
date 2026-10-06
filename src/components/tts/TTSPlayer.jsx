import { useTTS } from '../../hooks/useTTS';
import { Play, Pause, Square, Volume2, Download } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import clsx from 'clsx';

export default function TTSPlayer({ text, title = 'Audio Playback' }) {
  const {
    isPlaying, currentWordIndex, voices, selectedVoice, setSelectedVoice,
    rate, setRate, pitch, setPitch, speak, pause, resume, stop,
  } = useTTS();

  const words = text.split(/(\s+)/);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (currentWordIndex >= 0) {
      resume();
    } else {
      speak(text);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  let wordCounter = -1;

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-teal" aria-hidden="true" />
          {title}
        </h3>
        <span className="text-xs text-muted bg-cream-dark px-2 py-1 rounded-full">
          Powered by Web Speech API (Gemini TTS on backend)
        </span>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="voice-select" className="block text-sm font-medium text-muted mb-1">Voice</label>
          <select
            id="voice-select"
            value={selectedVoice?.name || ''}
            onChange={(e) => {
              const voice = voices.find((v) => v.name === e.target.value);
              setSelectedVoice(voice);
            }}
            className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-surface text-sm focus:border-teal focus:ring-1 focus:ring-teal"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
            ))}
          </select>
        </div>
        <div className="w-32">
          <label htmlFor="rate-slider" className="block text-sm font-medium text-muted mb-1">
            Speed: {rate.toFixed(1)}x
          </label>
          <input
            id="rate-slider"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full accent-teal"
          />
        </div>
        <div className="w-32">
          <label htmlFor="pitch-slider" className="block text-sm font-medium text-muted mb-1">
            Pitch: {pitch.toFixed(1)}
          </label>
          <input
            id="pitch-slider"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full accent-teal"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Button onClick={handlePlayPause} icon={isPlaying ? Pause : Play} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button variant="outline" onClick={stop} icon={Square} aria-label="Stop">Stop</Button>
        <Button variant="ghost" onClick={handleDownload} icon={Download} aria-label="Download transcript">
          Download
        </Button>
      </div>

      <div
        className="p-6 bg-cream rounded-xl leading-relaxed text-ink/90"
        aria-live="polite"
        aria-label="Text with karaoke highlighting"
      >
        {words.map((word, i) => {
          const isWord = /\S/.test(word);
          if (isWord) wordCounter++;
          return (
            <span
              key={i}
              className={clsx(
                isWord && wordCounter === currentWordIndex && 'karaoke-active'
              )}
            >
              {word}
            </span>
          );
        })}
      </div>
    </Card>
  );
}
