import { useApp } from '../context/AppContext';
import { READING_LEVELS, SUPPORTED_LANGUAGES } from '../utils/mockData';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const NEEDS_OPTIONS = [
  { id: 'visual_impairment', label: 'Visual Impairment' },
  { id: 'dyslexia', label: 'Dyslexia' },
  { id: 'dysgraphia', label: 'Dysgraphia' },
  { id: 'adhd', label: 'ADHD-related Reading Challenges' },
  { id: 'hearing_impairment', label: 'Hearing Impairment' },
];

const FORMAT_OPTIONS = [
  { id: 'audio', label: 'Audio (TTS)' },
  { id: 'braille', label: 'Braille' },
  { id: 'simplified', label: 'Simplified Text' },
  { id: 'translation', label: 'Translation' },
  { id: 'epub', label: 'EPUB/HTML' },
];

export default function Settings() {
  const { learnerProfile, updateProfile, a11ySettings, updateA11y } = useApp();

  const toggleNeed = (id) => {
    const needs = learnerProfile.needs.includes(id)
      ? learnerProfile.needs.filter((n) => n !== id)
      : [...learnerProfile.needs, id];
    updateProfile({ needs });
  };

  const toggleFormat = (id) => {
    const preferredFormats = learnerProfile.preferredFormats.includes(id)
      ? learnerProfile.preferredFormats.filter((f) => f !== id)
      : [...learnerProfile.preferredFormats, id];
    updateProfile({ preferredFormats });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display mb-2">Learner Profile & Settings</h1>
        <p className="text-muted">
          Customize your adaptive accessibility experience. The engine uses this profile
          to prioritize formats and reading levels.
        </p>
      </div>

      <Card>
        <h2 className="font-display text-lg mb-4">Reading Level</h2>
        <div className="space-y-2">
          {READING_LEVELS.map((level) => (
            <label
              key={level.id}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                learnerProfile.readingLevel === level.id
                  ? 'border-teal bg-teal/5'
                  : 'border-ink/10 hover:border-ink/20'
              }`}
            >
              <input
                type="radio"
                name="readingLevel"
                value={level.id}
                checked={learnerProfile.readingLevel === level.id}
                onChange={() => updateProfile({ readingLevel: level.id })}
                className="accent-teal"
              />
              <div>
                <p className="font-medium text-sm">{level.label}</p>
                <p className="text-xs text-muted">{level.description}</p>
              </div>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-lg mb-4">Preferred Language</h2>
        <select
          value={learnerProfile.preferredLanguage}
          onChange={(e) => updateProfile({ preferredLanguage: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-ink/10 bg-surface focus:border-teal focus:ring-1 focus:ring-teal"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.label}</option>
          ))}
        </select>
      </Card>

      <Card>
        <h2 className="font-display text-lg mb-4">Accessibility Needs</h2>
        <div className="flex flex-wrap gap-2">
          {NEEDS_OPTIONS.map((need) => (
            <button
              key={need.id}
              onClick={() => toggleNeed(need.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${
                learnerProfile.needs.includes(need.id)
                  ? 'border-teal bg-teal/10 text-teal'
                  : 'border-ink/10 text-muted hover:border-ink/20'
              }`}
              aria-pressed={learnerProfile.needs.includes(need.id)}
            >
              {need.label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-lg mb-4">Preferred Output Formats</h2>
        <div className="flex flex-wrap gap-2">
          {FORMAT_OPTIONS.map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => toggleFormat(fmt.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${
                learnerProfile.preferredFormats.includes(fmt.id)
                  ? 'border-teal bg-teal/10 text-teal'
                  : 'border-ink/10 text-muted hover:border-ink/20'
              }`}
              aria-pressed={learnerProfile.preferredFormats.includes(fmt.id)}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-lg mb-4">TTS Defaults</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tts-speed" className="block text-sm font-medium mb-1">
              Default Speed: {learnerProfile.ttsSpeed}x
            </label>
            <input
              id="tts-speed"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={learnerProfile.ttsSpeed}
              onChange={(e) => updateProfile({ ttsSpeed: parseFloat(e.target.value) })}
              className="w-full accent-teal"
            />
          </div>
          <div>
            <label htmlFor="tts-pitch" className="block text-sm font-medium mb-1">
              Default Pitch: {learnerProfile.ttsPitch}
            </label>
            <input
              id="tts-pitch"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={learnerProfile.ttsPitch}
              onChange={(e) => updateProfile({ ttsPitch: parseFloat(e.target.value) })}
              className="w-full accent-teal"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button size="lg">Save Profile</Button>
      </div>
    </div>
  );
}
