import clsx from 'clsx';
import { Activity, Hand } from 'lucide-react';
import Card from '../../../components/ui/Card';

export default function GestureFeedback({ detection, lastAction }) {
  const { gestureName, confidence, handedness, gestureId } = detection;

  return (
    <Card className="!p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-teal" aria-hidden="true" />
        <h2 className="font-display text-lg">Live Detection</h2>
      </div>

      <div
        className={clsx(
          'p-6 rounded-xl text-center transition-colors duration-300',
          gestureId ? 'bg-teal/10 border-2 border-teal/30' : 'bg-cream-dark border-2 border-transparent'
        )}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <Hand className="w-10 h-10 mx-auto text-teal mb-3" aria-hidden="true" />
        <p className="text-xl font-display font-semibold text-ink mb-1">
          {gestureName}
        </p>
        {handedness && (
          <p className="text-sm text-muted mb-3">{handedness} hand detected</p>
        )}
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-sm text-muted">Confidence</span>
          <span
            className={clsx(
              'text-2xl font-display font-bold',
              confidence >= 70 ? 'text-teal' : confidence >= 40 ? 'text-coral' : 'text-muted'
            )}
          >
            {confidence}%
          </span>
        </div>
        
        {detection.featureVector && (
          <div className="mt-3 p-2 bg-ink/5 rounded-lg border border-ink/10 text-left">
            <p className="text-[10px] font-semibold text-teal uppercase tracking-wider mb-1">Normalized ML Features (63D)</p>
            <p className="text-xs font-mono text-muted break-words leading-tight opacity-75">
              [ {detection.featureVector.slice(0, 9).map(v => v.toFixed(2)).join(', ')} ... ]
            </p>
          </div>
        )}

        {confidence >= 70 && gestureId && (
          <p className="text-xs text-teal mt-3 font-medium">Action threshold reached</p>
        )}
      </div>

      {lastAction && (
        <div className="mt-4 p-3 rounded-xl bg-ink text-cream text-sm" role="log" aria-live="assertive">
          <span className="font-medium">Last action:</span> {lastAction}
        </div>
      )}
    </Card>
  );
}
