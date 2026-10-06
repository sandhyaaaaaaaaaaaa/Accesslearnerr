import { useCallback, useState } from 'react';
import { Upload, File, X, AlertCircle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { validateFile, formatFileSize } from '../../utils/processingSimulator';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_MB } from '../../utils/mockData';
import Button from '../ui/Button';
import Progress from '../ui/Progress';

export default function FileUploadZone({ onFilesAccepted }) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const processFiles = useCallback((fileList) => {
    const newFiles = Array.from(fileList).map((file) => {
      const validation = validateFile(file);
      return { file, ...validation, id: `${file.name}-${Date.now()}` };
    });
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleUpload = () => {
    const validFiles = files.filter((f) => f.valid);
    if (validFiles.length === 0) return;

    setUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploading(false);
        onFilesAccepted?.(validFiles.map((f) => f.file));
      }
      setUploadProgress(Math.round(progress));
    }, 200);
  };

  const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const acceptedExtensions = Object.values(ACCEPTED_FILE_TYPES).flat().join(', ');

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={clsx(
          'relative border-2 border-dashed rounded-2xl p-12 text-center transition-colors duration-200',
          dragOver ? 'border-teal bg-teal/5' : 'border-ink/15 hover:border-teal/40'
        )}
        role="region"
        aria-label="File upload zone"
      >
        <Upload className="w-12 h-12 mx-auto text-teal mb-4" aria-hidden="true" />
        <h3 className="text-lg font-display mb-2">Drop files here or browse</h3>
        <p className="text-muted text-sm mb-4">
          PDF, PPTX, DOCX, JPG, PNG, TIFF — up to {MAX_FILE_SIZE_MB} MB each
        </p>
        <label className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl border-2 border-ink/15 text-ink hover:border-teal hover:text-teal bg-transparent transition-colors cursor-pointer">
          <input
            type="file"
            multiple
            accept={acceptedExtensions}
            onChange={(e) => processFiles(e.target.files)}
            className="sr-only"
          />
          Browse Files
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-3" role="list" aria-label="Selected files">
          {files.map((f) => (
            <div
              key={f.id}
              role="listitem"
              className={clsx(
                'flex items-center gap-4 p-4 rounded-xl border',
                f.valid ? 'border-ink/10 bg-surface' : 'border-red-200 bg-red-50'
              )}
            >
              <File className="w-8 h-8 text-teal shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{f.file.name}</p>
                <p className="text-sm text-muted">{formatFileSize(f.file.size)}</p>
                {!f.valid && (
                  <ul className="mt-1 text-sm text-red-600">
                    {f.errors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                )}
              </div>
              {f.valid ? (
                <CheckCircle className="w-5 h-5 text-teal shrink-0" aria-label="Valid file" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" aria-label="Invalid file" />
              )}
              <button onClick={() => removeFile(f.id)} className="p-1 hover:bg-ink/5 rounded-lg" aria-label={`Remove ${f.file.name}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploading && <Progress value={uploadProgress} label="Uploading..." />}

      {files.some((f) => f.valid) && !uploading && (
        <Button onClick={handleUpload} className="w-full" size="lg">
          Upload {files.filter((f) => f.valid).length} file(s) & Start Processing
        </Button>
      )}
    </div>
  );
}
