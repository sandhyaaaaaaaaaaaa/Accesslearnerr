import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { createWorker } from 'tesseract.js';
import {
  Camera, RotateCcw, Sun, Contrast, Crop, Check, ArrowRight, Loader,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SAMPLE_DOCUMENT } from '../utils/mockData';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Progress from '../components/ui/Progress';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'environment',
};

export default function WebcamCapture() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const { setCurrentDocument } = useApp();

  const [capturedImage, setCapturedImage] = useState(null);
  const [preprocessing, setPreprocessing] = useState({ brightness: 100, contrast: 100, cropped: false });
  const [ocrText, setOcrText] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [step, setStep] = useState('capture');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setStep('preprocess');
    }
  }, []);

  const retake = () => {
    setCapturedImage(null);
    setOcrText('');
    setOcrProgress(0);
    setStep('capture');
  };

  const runOCR = async () => {
    if (!capturedImage) return;
    setIsScanning(true);
    setOcrProgress(0);
    setStep('ocr');

    try {
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });
      const { data: { text } } = await worker.recognize(capturedImage);
      await worker.terminate();
      setOcrText(text.trim() || 'No text detected. Try adjusting brightness/contrast or recapturing.');
    } catch {
      setOcrText('OCR preview unavailable. Text will be extracted on the backend with Tesseract OCR.');
    }
    setIsScanning(false);
  };

  const applyPreprocessing = () => {
    setPreprocessing((prev) => ({ ...prev, cropped: true }));
  };

  const submitForProcessing = () => {
    setCurrentDocument({
      ...SAMPLE_DOCUMENT,
      title: 'Webcam Capture',
      source: 'Webcam scan',
      originalText: ocrText || SAMPLE_DOCUMENT.originalText,
      uploadedAt: new Date().toISOString(),
      status: 'processing',
    });
    navigate('/student/processing');
  };

  const filterStyle = {
    filter: `brightness(${preprocessing.brightness}%) contrast(${preprocessing.contrast}%)`,
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display mb-2">Webcam Scan</h1>
        <p className="text-muted">
          Capture textbook pages with your camera. OpenCV preprocessing (auto-crop, deskew, contrast)
          will be applied on the backend. Preview OCR text before submitting.
        </p>
      </div>

      {/* Steps indicator */}
      <nav aria-label="Scan progress" className="flex gap-2 mb-6">
        {['Capture', 'Preprocess', 'OCR Preview', 'Submit'].map((s, i) => {
          const steps = ['capture', 'preprocess', 'ocr', 'submit'];
          const current = steps.indexOf(step);
          return (
            <div
              key={s}
              className={`flex-1 text-center py-2 rounded-lg text-xs font-medium ${
                i <= current ? 'bg-teal/10 text-teal' : 'bg-cream-dark text-muted'
              }`}
            >
              {s}
            </div>
          );
        })}
      </nav>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Camera / Preview */}
        <Card>
          {step === 'capture' ? (
            <div>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full rounded-xl"
              />
              <Button onClick={capture} className="w-full mt-4" size="lg" icon={Camera}>
                Capture Page
              </Button>
            </div>
          ) : (
            <div>
              <img
                src={capturedImage}
                alt="Captured page"
                className="w-full rounded-xl"
                style={filterStyle}
              />
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={retake} icon={RotateCcw} className="flex-1">
                  Retake
                </Button>
                {step === 'preprocess' && (
                  <Button onClick={runOCR} icon={ArrowRight} className="flex-1">
                    Run OCR Preview
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Controls */}
        <div className="space-y-4">
          {step !== 'capture' && (
            <Card>
              <h3 className="font-display mb-4">Preprocessing Controls</h3>
              <p className="text-xs text-muted mb-4">
                Simulated OpenCV adjustments. Backend applies auto-crop, deskew, and adaptive thresholding.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-1">
                    <Sun className="w-4 h-4" aria-hidden="true" />
                    Brightness: {preprocessing.brightness}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={preprocessing.brightness}
                    onChange={(e) => setPreprocessing((p) => ({ ...p, brightness: +e.target.value }))}
                    className="w-full accent-teal"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-1">
                    <Contrast className="w-4 h-4" aria-hidden="true" />
                    Contrast: {preprocessing.contrast}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={preprocessing.contrast}
                    onChange={(e) => setPreprocessing((p) => ({ ...p, contrast: +e.target.value }))}
                    className="w-full accent-teal"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={applyPreprocessing}
                  icon={Crop}
                  className="w-full"
                  disabled={preprocessing.cropped}
                >
                  {preprocessing.cropped ? 'Auto-Crop Applied' : 'Apply Auto-Crop'}
                </Button>
              </div>
            </Card>
          )}

          {(step === 'ocr' || ocrText) && (
            <Card>
              <h3 className="font-display mb-4">OCR Text Preview</h3>
              {isScanning ? (
                <div className="text-center py-8">
                  <Loader className="w-8 h-8 mx-auto text-teal animate-spin mb-4" aria-hidden="true" />
                  <Progress value={ocrProgress} label="Recognizing text..." />
                </div>
              ) : (
                <>
                  <div
                    className="p-4 bg-cream rounded-xl text-sm leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap"
                    role="region"
                    aria-label="OCR extracted text"
                  >
                    {ocrText}
                  </div>
                  <p className="text-xs text-muted mt-2">
                    Verify the extracted text above. Backend Tesseract OCR with structure preservation will refine this.
                  </p>
                  <Button onClick={submitForProcessing} className="w-full mt-4" icon={Check} size="lg">
                    Confirm & Start Processing
                  </Button>
                </>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
