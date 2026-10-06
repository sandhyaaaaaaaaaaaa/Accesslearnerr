import { GESTURE_DEFINITIONS } from '../constants/gestureMappings';
import Card from '../../../components/ui/Card';

export default function GestureMappingGuide() {
  return (
    <Card className="!p-5">
      <h2 className="font-display text-lg mb-4">Gesture Mapping Guide</h2>
      <ul className="space-y-3" role="list">
        {GESTURE_DEFINITIONS.map((gesture) => (
          <li
            key={gesture.id}
            className="flex gap-3 p-3 rounded-xl bg-cream hover:bg-cream-dark transition-colors"
          >
            <span className="text-2xl shrink-0" aria-hidden="true">{gesture.icon}</span>
            <div className="min-w-0">
              <p className="font-medium text-sm text-ink">{gesture.name}</p>
              <p className="text-xs text-muted mt-0.5">{gesture.description}</p>
              <p className="text-xs text-teal mt-1">→ {gesture.voice}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
