import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { apiPost } from '../utils/apiClient';
import FileUploadZone from '../components/upload/FileUploadZone';
import Button from '../components/ui/Button';

export default function Upload() {
  const navigate = useNavigate();
  const { setCurrentDocument } = useApp();
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFilesAccepted = async (files) => {
    const file = files[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      let document;
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name.replace(/\.[^.]+$/, '') || 'Untitled Document');
        formData.append('source', `Uploaded: ${file.name}`);
        document = await apiPost('/documents/upload', formData);
      } catch (apiErr) {
        console.warn('Backend API unreachable, processing document locally:', apiErr);
        document = {
          id: 'doc-' + Date.now(),
          title: file.name.replace(/\.[^.]+$/, '') || 'Untitled Document',
          source: `Uploaded: ${file.name}`,
          uploadedAt: new Date().toISOString(),
          status: 'processing',
        };
      }

      setCurrentDocument({
        file,
        serverId: document.id,
        title: document.title,
        source: document.source,
        uploadedAt: document.uploadedAt,
        status: document.status,
      });
      navigate('/student/processing');
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display mb-2">Upload Document</h1>
        <p className="text-muted">
          Upload PDFs, PowerPoints, Word documents, or scanned images.
          Files are validated for type and size before processing begins.
        </p>
      </div>

      <FileUploadZone onFilesAccepted={handleFilesAccepted} />

      <div className="mt-8 p-4 bg-cream-dark rounded-xl text-sm text-muted">
        <h2 className="font-medium text-ink mb-2">What happens next?</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>File validation (type, size, integrity check)</li>
          <li>OCR extraction for scanned documents, native text for digital files</li>
          <li>AI enrichment — image descriptions, structure tagging</li>
          <li>Concurrent format generation — audio, Braille, simplified text, translations, EPUB</li>
        </ol>
      </div>
    </div>
  );
}
