import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const SAMPLE_DOUBTS = [
  {
    id: 1,
    question: 'What is the difference between light-dependent and light-independent reactions?',
    answer: 'Light-dependent reactions occur in thylakoids and require sunlight to produce ATP and NADPH. Light-independent reactions (Calvin cycle) occur in the stroma and use those products to fix CO₂ into glucose.',
    topic: 'Photosynthesis',
  },
  {
    id: 2,
    question: 'Why do plants release oxygen during photosynthesis?',
    answer: 'Oxygen is released when water molecules are split during the light-dependent reactions (photolysis). This oxygen is a byproduct, not used in making glucose.',
    topic: 'Photosynthesis',
  },
  {
    id: 3,
    question: 'How does chlorophyll help in photosynthesis?',
    answer: 'Chlorophyll absorbs light energy, primarily in blue and red wavelengths, and converts it into chemical energy used to drive the photosynthesis process.',
    topic: 'Photosynthesis',
  },
];

export default function Doubts() {
  const [doubts] = useState(SAMPLE_DOUBTS);
  const [newDoubt, setNewDoubt] = useState('');
  const [expanded, setExpanded] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newDoubt.trim()) return;
    setNewDoubt('');
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="w-7 h-7 text-teal" aria-hidden="true" />
          <h1 className="text-3xl font-display">Doubts & Questions</h1>
        </div>
        <p className="text-muted">
          Ask questions about your learning material. Use the index finger gesture or type below.
        </p>
      </header>

      <Card className="mb-6">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <label htmlFor="doubt-input" className="sr-only">Ask a doubt</label>
          <input
            id="doubt-input"
            type="text"
            value={newDoubt}
            onChange={(e) => setNewDoubt(e.target.value)}
            placeholder="Type your doubt here…"
            className="flex-1 px-4 py-2.5 rounded-xl border border-ink/10 bg-surface focus:border-teal focus:ring-1 focus:ring-teal"
          />
          <Button type="submit" icon={Send} aria-label="Submit doubt">Ask</Button>
        </form>
      </Card>

      <div className="space-y-4" role="list" aria-label="Doubts and answers">
        {doubts.map((doubt) => (
          <Card key={doubt.id} className="!p-5">
            <button
              className="w-full text-left"
              onClick={() => setExpanded(expanded === doubt.id ? null : doubt.id)}
              aria-expanded={expanded === doubt.id}
            >
              <span className="text-xs text-teal font-medium uppercase tracking-wide">{doubt.topic}</span>
              <p className="font-medium mt-1">{doubt.question}</p>
            </button>
            {expanded === doubt.id && (
              <div className="mt-4 p-4 bg-cream rounded-xl text-sm leading-relaxed" role="region">
                {doubt.answer}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
