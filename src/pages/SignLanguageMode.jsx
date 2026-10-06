import { Signpost } from 'lucide-react';
import GestureControlPanel from '../features/gesture-accessibility/components/GestureControlPanel';

export default function SignLanguageMode() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <header className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-4">
          <Signpost className="w-8 h-8 text-teal" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-display mb-2">Sign Language & Gesture Mode</h1>
        <p className="text-muted max-w-2xl mx-auto">
          Sign Language Mode is active. Use your webcam to control the application entirely through hand signs.
          MediaPipe Hand Landmarker is detecting your 21 landmarks in real-time.
        </p>
      </header>

      <GestureControlPanel />
    </div>
  );
}
