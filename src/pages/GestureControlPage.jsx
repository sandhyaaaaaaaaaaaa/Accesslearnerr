import { Hand } from 'lucide-react';
import GestureControlPanel from '../features/gesture-accessibility/components/GestureControlPanel';

export default function GestureControlPage() {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center">
            <Hand className="w-5 h-5 text-teal" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-display">Gesture-Based Accessibility Navigation</h1>
        </div>
        <p className="text-muted max-w-3xl">
          Navigate AccessLearner entirely using hand gestures detected through your webcam.
          MediaPipe Hands tracks 21 landmarks in real time. Each recognized gesture triggers
          an application action with voice feedback via Text-to-Speech.
        </p>
      </header>

      <GestureControlPanel />
    </div>
  );
}
