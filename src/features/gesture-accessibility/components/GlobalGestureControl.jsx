import { useState, useCallback } from 'react';
import { Hand, Square, AlertCircle, Loader } from 'lucide-react';
import clsx from 'clsx';
import { useMediaPipeHands } from '../hooks/useMediaPipeHands';
import { useGestureNavigation } from '../hooks/useGestureNavigation';

export default function GlobalGestureControl() {
  const [isMinimized, setIsMinimized] = useState(false);
  const { executeGestureAction } = useGestureNavigation();
  const [lastAction, setLastAction] = useState(null);

  const handleGestureAction = useCallback(
    (gestureId) => {
      const acted = executeGestureAction(gestureId);
      if (acted) {
        setLastAction(`Fired: ${gestureId}`);
        setTimeout(() => setLastAction(null), 3000);
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

  const toggleControl = async () => {
    if (isActive) {
      stop();
    } else {
      await start();
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4 pointer-events-none">
      
      {/* PiP Webcam Window */}
      {(isActive || isLoading || error) && !isMinimized && (
        <div 
          className="bg-ink shadow-xl rounded-2xl overflow-hidden w-64 aspect-video pointer-events-auto transform transition-all duration-300 animate-fade-in relative border border-ink/20"
          role="region"
          aria-label="Gesture Control Camera Feed"
        >
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-cream z-10 bg-ink/80">
              <Loader className="w-8 h-8 text-teal-light animate-spin mb-2" />
              <p className="text-xs">Starting Camera...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 z-10 bg-surface/90 p-4 text-center">
              <AlertCircle className="w-8 h-8 mb-2" />
              <p className="text-xs font-medium">{error}</p>
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

          {/* Status Overlay */}
          {isActive && (
            <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-ink/80 to-transparent p-2 z-20">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] text-cream font-medium uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse-soft"></span>
                  Tracking
                </span>
                {detection.confidence > 0 && (
                  <span className="text-[10px] text-teal-light font-mono font-bold">
                    {detection.confidence}%
                  </span>
                )}
              </div>
              {detection.gestureName && detection.gestureId && (
                <p className="text-xs text-cream mt-0.5 truncate drop-shadow-md">
                  {detection.gestureName}
                </p>
              )}
            </div>
          )}
          
          {/* Action Feedback Toast */}
          {lastAction && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-teal text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-30 animate-fade-in whitespace-nowrap">
              {lastAction}
            </div>
          )}
        </div>
      )}

      {/* Toggle Button Container */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          onClick={toggleControl}
          className={clsx(
            'p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center',
            isActive 
              ? 'bg-coral text-white hover:bg-red-600' 
              : 'bg-teal text-white hover:bg-teal-dark'
          )}
          aria-label={isActive ? 'Stop gesture control' : 'Start gesture control'}
          aria-pressed={isActive}
        >
          {isActive ? <Square className="w-6 h-6" /> : <Hand className="w-6 h-6" />}
        </button>
        
        {isActive && (
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-xs px-3 py-1.5 rounded-full bg-surface shadow-md border border-ink/10 text-ink/70 hover:text-ink font-medium transition-colors"
          >
            {isMinimized ? 'Show Camera' : 'Hide Camera'}
          </button>
        )}
      </div>
    </div>
  );
}
