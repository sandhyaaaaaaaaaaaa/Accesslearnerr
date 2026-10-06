import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Flashcards() {
  const navigate = useNavigate();
  const { currentDocument } = useApp();
  const cards = currentDocument?.flashcards;

  const [flipped, setFlipped] = useState({});
  const [current, setCurrent] = useState(0);

  const toggle = (i) => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }));

  // Guard: no document or no cards
  if (!cards || cards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center animate-fade-in py-20">
        <Card className="p-12">
          <Upload className="w-12 h-12 mx-auto text-muted mb-4" aria-hidden="true" />
          <h1 className="text-2xl font-display mb-2">No Flashcards Yet</h1>
          <p className="text-muted mb-6">
            Upload a document and flashcards will be automatically generated from its key concepts.
          </p>
          <Button onClick={() => navigate('/student/upload')}>Upload a Document</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <header className="mb-8 text-center">
        <Layers className="w-8 h-8 mx-auto text-teal mb-2" aria-hidden="true" />
        <h1 className="text-3xl font-display mb-1">Flashcards</h1>
        <p className="text-muted text-sm">{currentDocument?.title}</p>
      </header>

      <div className="mb-4 text-center text-sm text-muted">
        Card {current + 1} of {cards.length}
      </div>

      <button
        onClick={() => toggle(current)}
        className="w-full"
        aria-label={`Flashcard ${current + 1}: ${flipped[current] ? cards[current].back : cards[current].front}`}
      >
        <Card className={`relative min-h-[220px] flex items-center justify-center text-center cursor-pointer transition-all duration-300 ${
          flipped[current] ? 'bg-teal/5 border-teal/20' : ''
        }`}>
          <p className="text-lg font-medium px-4">
            {flipped[current] ? cards[current].back : cards[current].front}
          </p>
          <span className="absolute bottom-4 text-xs text-muted">
            Tap to flip — {flipped[current] ? 'Answer' : 'Question'}
          </span>
        </Card>
      </button>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-cream-dark disabled:opacity-40 hover:bg-ink/5"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrent((c) => Math.min(cards.length - 1, c + 1))}
          disabled={current === cards.length - 1}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-teal text-white disabled:opacity-40 hover:bg-teal-light"
        >
          Next
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-8">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-colors ${
              i === current ? 'bg-teal' : flipped[i] ? 'bg-teal/40' : 'bg-cream-dark'
            }`}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
