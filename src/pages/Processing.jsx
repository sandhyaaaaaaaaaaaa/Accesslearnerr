import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PIPELINE_STAGES, OUTPUT_FORMATS } from '../utils/mockData';
import { parseDocument } from '../utils/documentParser';
import { generateModulesFromText } from '../utils/nlpGenerator';
import {
  CheckCircle, Loader, XCircle, Circle, ArrowRight,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Progress from '../components/ui/Progress';
import Button from '../components/ui/Button';

const statusIcon = {
  complete: CheckCircle,
  processing: Loader,
  failed: XCircle,
  pending: Circle,
  ready: CheckCircle,
};

export default function Processing() {
  const navigate = useNavigate();
  const { currentDocument, setCurrentDocument } = useApp();
  const [stages, setStages] = useState(
    Object.fromEntries(PIPELINE_STAGES.map((s) => [s.id, 'pending']))
  );
  const [formats, setFormats] = useState(
    Object.fromEntries(OUTPUT_FORMATS.map((f) => [f.id, { status: 'pending', progress: 0 }]))
  );
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const processDocument = async () => {
      if (!currentDocument?.file) {
        // No file — mark everything complete so the user can still click through
        setStages(Object.fromEntries(PIPELINE_STAGES.map((s) => [s.id, 'complete'])));
        setFormats(Object.fromEntries(OUTPUT_FORMATS.map((f) => [f.id, { status: 'complete', progress: 100 }])));
        setIsComplete(true);
        return;
      }

      try {
        // Stage 1: Ingestion
        setStages(prev => ({ ...prev, ingestion: 'processing' }));
        await new Promise(r => setTimeout(r, 300)); // brief visual delay
        if (!isMounted) return;
        setStages(prev => ({ ...prev, ingestion: 'complete' }));

        // Stage 2: Extraction (OCR / document parsing)
        setStages(prev => ({ ...prev, extraction: 'processing' }));
        const rawText = await parseDocument(currentDocument.file);
        if (!isMounted) return;
        setStages(prev => ({ ...prev, extraction: 'complete' }));

        // Stage 3: Enrichment (NLP — flashcards, quiz, summary)
        setStages(prev => ({ ...prev, enrichment: 'processing' }));
        const generatedModules = generateModulesFromText(rawText);
        if (!isMounted) return;
        setStages(prev => ({ ...prev, enrichment: 'complete' }));

        // Stage 4: Transformation (formats)
        setStages(prev => ({ ...prev, transformation: 'processing' }));
        setFormats(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(k => { updated[k] = { status: 'complete', progress: 100 }; });
          return updated;
        });
        if (!isMounted) return;
        setStages(prev => ({ ...prev, transformation: 'complete' }));

        // Stage 5 & 6: Personalization + Delivery
        setStages(prev => ({ ...prev, personalization: 'processing', delivery: 'pending' }));
        await new Promise(r => setTimeout(r, 200));
        if (!isMounted) return;
        setStages(prev => ({ ...prev, personalization: 'complete', delivery: 'processing' }));
        await new Promise(r => setTimeout(r, 200));
        if (!isMounted) return;
        setStages(prev => ({ ...prev, delivery: 'complete' }));

        // Persist to context
        setCurrentDocument(prev => ({
          ...prev,
          ...generatedModules,
          status: 'ready',
        }));
        setIsComplete(true);

      } catch (error) {
        console.error('Processing failed:', error);
        setStages(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(k => {
            if (updated[k] === 'processing' || updated[k] === 'pending') updated[k] = 'failed';
          });
          return updated;
        });
      }
    };

    processDocument();

    return () => {
      isMounted = false;
    };
  }, [currentDocument?.file, setCurrentDocument]);

  const docTitle = currentDocument?.title || 'Your Document';

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display mb-2">Processing Pipeline</h1>
        <p className="text-muted">
          Converting <span className="font-medium text-ink">"{docTitle}"</span> into accessible formats.
          Each stage and format operates independently.
        </p>
      </div>

      {/* Pipeline Stages */}
      <section className="mb-8" aria-labelledby="pipeline-stages">
        <h2 id="pipeline-stages" className="text-lg font-display mb-4">Pipeline Stages</h2>
        <div className="space-y-3">
          {PIPELINE_STAGES.map((stage) => {
            const status = stages[stage.id];
            const Icon = statusIcon[status] || Circle;
            return (
              <Card key={stage.id} className="!p-4">
                <div className="flex items-center gap-4">
                  <Icon
                    className={`w-6 h-6 shrink-0 ${
                      status === 'complete' ? 'text-teal' :
                      status === 'processing' ? 'text-coral animate-spin' :
                      'text-muted/30'
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{stage.label}</h3>
                    <p className="text-sm text-muted">{stage.description}</p>
                  </div>
                  <Badge status={status === 'complete' ? 'ready' : status} />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Format Generation */}
      <section className="mb-8" aria-labelledby="format-generation">
        <h2 id="format-generation" className="text-lg font-display mb-4">Format Generation Status</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {OUTPUT_FORMATS.map((format) => {
            const fmt = formats[format.id];
            return (
              <Card key={format.id} className="!p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">{format.label}</h3>
                  <Badge status={fmt.status} />
                </div>
                {fmt.status === 'processing' && (
                  <Progress value={fmt.progress} size="sm" />
                )}
                {fmt.status === 'failed' && (
                  <p className="text-xs text-red-600 mt-1">
                    Generation failed. Other formats are unaffected.
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {isComplete && (
        <div className="text-center animate-slide-up">
          <p className="text-teal font-medium mb-4">All formats processed successfully!</p>
          <Button onClick={() => navigate('/student/output')} size="lg" icon={ArrowRight}>
            View Accessible Content
          </Button>
        </div>
      )}
    </div>
  );
}
