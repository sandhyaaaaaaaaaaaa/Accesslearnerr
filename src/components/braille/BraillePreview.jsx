import { useState } from 'react';
import { textToBraille, downloadBRF } from '../../utils/braille';
import { Download, Eye, EyeOff } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function BraillePreview({ text, title = 'Document' }) {
  const [showBraille, setShowBraille] = useState(true);
  const braille = textToBraille(text.slice(0, 500));

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display">Braille Preview (Grade 1 UEB)</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBraille(!showBraille)}
            icon={showBraille ? EyeOff : Eye}
          >
            {showBraille ? 'Hide' : 'Show'}
          </Button>
          <Button
            size="sm"
            onClick={() => downloadBRF(text, `${title.replace(/\s+/g, '_')}.brf`)}
            icon={Download}
          >
            Download .BRF
          </Button>
        </div>
      </div>

      {showBraille && (
        <div
          className="p-6 bg-ink text-cream rounded-xl font-mono text-2xl leading-loose tracking-widest overflow-x-auto"
          role="region"
          aria-label="Braille preview"
        >
          {braille}
          {text.length > 500 && (
            <p className="text-sm text-cream/50 mt-4 font-body">
              Preview truncated. Download full .BRF file for complete content.
            </p>
          )}
        </div>
      )}

      <p className="text-xs text-muted mt-3">
        Full liblouis Grade 1/2 contraction rules will be applied on the backend. This preview uses basic UEB mapping.
      </p>
    </Card>
  );
}
