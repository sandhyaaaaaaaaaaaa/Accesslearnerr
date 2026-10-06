import { Mic, MicOff, Volume2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { useVoiceNavigation } from '../hooks/useVoiceNavigation';

export default function GlobalVoiceControl() {
  const {
    isListening,
    transcript,
    feedback,
    error,
    toggleListening
  } = useVoiceNavigation();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      
      {/* Feedback Panel */}
      {(isListening || error) && (
        <div 
          className="bg-surface/95 backdrop-blur-md border border-ink/10 shadow-xl rounded-2xl p-4 w-72 pointer-events-auto transform transition-all duration-300 animate-fade-in"
          role="region"
          aria-label="Voice Navigation Status"
        >
          {error ? (
            <div className="flex items-start gap-3 text-red-600">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal tracking-wider uppercase">Voice Navigation</span>
                <span className="flex items-center gap-2 text-xs text-ink">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Listening
                </span>
              </div>
              
              <div className="bg-cream-dark rounded-xl p-3 text-sm text-ink min-h-[3rem] flex items-center italic">
                {transcript || "Say something like 'Go to Dashboard'..."}
              </div>

              {feedback && (
                <div className="flex items-center gap-2 text-sm text-teal font-medium mt-1 animate-fade-in">
                  <Volume2 className="w-4 h-4" />
                  {feedback}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleListening}
        className={clsx(
          'p-4 rounded-full shadow-lg pointer-events-auto transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center',
          isListening 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-teal text-white hover:bg-teal-dark'
        )}
        aria-label={isListening ? 'Stop voice navigation' : 'Start voice navigation'}
        aria-pressed={isListening}
      >
        {isListening ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
