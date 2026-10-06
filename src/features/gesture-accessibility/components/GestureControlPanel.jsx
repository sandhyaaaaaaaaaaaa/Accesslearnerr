import { useCallback, useState } from 'react';
import { Hand, Play, Square, AlertCircle, Loader } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { useMediaPipeHands } from '../hooks/useMediaPipeHands';
import { useGestureNavigation } from '../hooks/useGestureNavigation';
import { GESTURE_DEFINITIONS } from '../constants/gestureMappings';
import GestureFeedback from './GestureFeedback';
import GestureMappingGuide from './GestureMappingGuide';

export default function GestureControlPanel() {
  const [lastAction, setLastAction] = useState(null);
  const { executeGestureAction } = useGestureNavigation();

  const handleGestureAction = useCallback(
    (gestureId) => {
      const acted = executeGestureAction(gestureId);
      if (acted) {
        const def = GESTURE_DEFINITIONS.find((g) => g.id === gestureId);
        setLastAction(def ? `${def.name} — ${def.voice}` : gestureId);
      }
      return acted;
    },
    [executeGestureAction]
  );

  const {
    videoRef,
    canvasRef,
    isLoading,
    error,
    isActive,
    detection,
    start,
    stop,
  } = useMediaPipeHands({
    onGestureAction: handleGestureAction,
  });

  const handleStart = async () => {
    setLastAction(null);
    await start();
  };

  const handleStop = () => {
    stop();
  };

  return (
    <div className="space-y-6">
      <Card className="!p-0 overflow-hidden">
        <div className="relative bg-ink aspect-video max-h-[480px]">
          {!isActive && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-cream z-10">
              <Hand className="w-16 h-16 text-teal-light mb-4" aria-hidden="true" />
              <p className="text-lg font-display mb-2">Gesture Control Inactive</p>
              <p className="text-sm text-cream/60 mb-6 text-center max-w-sm px-4">
                Click Start to enable webcam-based hand gesture navigation using MediaPipe Hands.
              </p>
              <Button size="lg" icon={Play} onClick={handleStart}>
                Start Gesture Control
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-cream z-10 bg-ink/80">
              <Loader className="w-10 h-10 text-teal-light animate-spin mb-3" aria-hidden="true" />
              <p className="text-sm">Loading MediaPipe Hands & requesting webcam…</p>
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-full object-cover mirror"
            style={{ transform: 'scaleX(-1)' }}
            playsInline
            muted
            aria-label="Webcam feed for gesture detection"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ transform: 'scaleX(-1)' }}
            aria-hidden="true"
          />

          {isActive && (
            <div className="absolute top-4 right-4 z-20">
              <Button variant="danger" size="sm" icon={Square} onClick={handleStop}>
                Stop
              </Button>
            </div>
          )}

          {isActive && (
            <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-full bg-ink/70 text-cream text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse-soft" aria-hidden="true" />
              21 landmarks active
            </div>
          )}
        </div>
      </Card>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700" role="alert">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-medium text-sm">Gesture control error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <GestureFeedback detection={detection} lastAction={lastAction} />
        <GestureMappingGuide />
      </div>
    </div>
  );
}
