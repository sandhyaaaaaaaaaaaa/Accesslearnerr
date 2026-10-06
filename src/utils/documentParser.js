import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import JSZip from 'jszip';
import Tesseract from 'tesseract.js';

// Use the CDN worker — avoids Vite bundling issues with the binary worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const parseDocument = async (file) => {
  const extension = file.name.split('.').pop().toLowerCase();

  try {
    switch (extension) {
      case 'txt':
        return await parseTxt(file);
      case 'pdf':
        return await parsePdf(file);
      case 'docx':
        return await parseDocx(file);
      case 'pptx':
        return await parsePptx(file);
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'tiff':
      case 'tif':
        return await parseImage(file);
      default:
        throw new Error(`Unsupported file format: .${extension}`);
    }
  } catch (err) {
    console.error('Error parsing document:', err);
    throw new Error(`Failed to parse .${extension} file. ${err.message || ''}`);
  }
};

const parseTxt = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

const parsePdf = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => item.str)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    fullText += pageText + '\n\n';
  }

  return fullText.trim();
};

const parseDocx = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
};

const parsePptx = async (file) => {
  const zip = new JSZip();
  const contents = await zip.loadAsync(file);

  // Find all slide XML files sorted by slide number
  const slideFiles = Object.keys(contents.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort();

  if (slideFiles.length === 0) return '';

  let fullText = '';

  for (const slideName of slideFiles) {
    const slideXml = await contents.file(slideName).async('string');
    const matches = slideXml.match(/<a:t[^>]*>(.*?)<\/a:t>/g);
    if (matches) {
      const texts = matches
        .map((m) => m.replace(/<a:t[^>]*>/, '').replace(/<\/a:t>/, ''))
        .filter((t) => t.trim().length > 0);
      if (texts.length > 0) {
        fullText += texts.join(' ') + '\n\n';
      }
    }
  }

  return fullText.trim();
};

const parseImage = async (file) => {
  const worker = await Tesseract.createWorker('eng');
  try {
    const ret = await worker.recognize(file);
    return ret.data.text.trim();
  } finally {
    await worker.terminate();
  }
};
