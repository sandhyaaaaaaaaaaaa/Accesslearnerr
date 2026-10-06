import { PIPELINE_STAGES, OUTPUT_FORMATS } from './mockData';

export function simulateProcessing(onStageUpdate, onFormatUpdate, onComplete) {
  let stageIndex = 0;
  let formatIndex = 0;
  const formats = [...OUTPUT_FORMATS];

  const stageInterval = setInterval(() => {
    if (stageIndex < PIPELINE_STAGES.length) {
      onStageUpdate(PIPELINE_STAGES[stageIndex].id, 'complete');
      stageIndex++;
      if (stageIndex < PIPELINE_STAGES.length) {
        onStageUpdate(PIPELINE_STAGES[stageIndex].id, 'processing');
      }
    }
  }, 1200);

  const formatInterval = setInterval(() => {
    if (formatIndex < formats.length) {
      const format = formats[formatIndex];
      onFormatUpdate(format.id, 'processing', 0);

      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 25 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
          const failed = format.id === 'translation' && Math.random() < 0.1;
          onFormatUpdate(format.id, failed ? 'failed' : 'ready', progress);
          formatIndex++;
          if (formatIndex >= formats.length) {
            clearInterval(stageInterval);
            clearInterval(formatInterval);
            onComplete?.();
          }
        } else {
          onFormatUpdate(format.id, 'processing', Math.round(progress));
        }
      }, 300);
    }
  }, 800);

  onStageUpdate(PIPELINE_STAGES[0].id, 'processing');

  return () => {
    clearInterval(stageInterval);
    clearInterval(formatInterval);
  };
}

export function validateFile(file) {
  const errors = [];
  const acceptedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/tiff',
  ];
  const maxSize = 50 * 1024 * 1024;

  if (!acceptedTypes.includes(file.type)) {
    errors.push(`File type "${file.type || 'unknown'}" is not supported. Accepted: PDF, PPTX, DOCX, JPG, PNG, TIFF.`);
  }
  if (file.size > maxSize) {
    errors.push(`File size (${(file.size / 1024 / 1024).toFixed(1)} MB) exceeds the 50 MB limit.`);
  }
  if (file.size === 0) {
    errors.push('File appears to be empty.');
  }

  return { valid: errors.length === 0, errors };
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
