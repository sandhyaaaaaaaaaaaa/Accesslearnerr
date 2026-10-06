# AccessLearner

AI-powered inclusive learning accessibility platform — frontend prototype.

Converts textbooks, lecture notes, PDFs, PPTs, and scanned documents into accessible learning formats for students with visual impairments and reading disabilities.

## Tech Stack

- **React 19** + **Vite 8**
- **Tailwind CSS 4**
- **React Router 7**
- **react-webcam** — live page capture
- **Tesseract.js** — in-browser OCR preview
- **Web Speech API** — TTS with karaoke highlighting
- **Lucide React** — icons

## Features (Frontend)

- Landing page with feature overview and pipeline architecture
- Student & Teacher role-based dashboards (mock auth)
- Multi-format file upload with validation (PDF, PPTX, DOCX, images)
- Webcam scan flow with preprocessing controls and OCR preview
- 7-stage processing pipeline with per-format status tracking
- Output viewer: Audio/TTS, Braille (.BRF download), Simplified text, Translation, EPUB/HTML, Summary, Flashcards
- AI Learning Mentor chatbot (mock RAG responses)
- Comprehension quiz with adaptive feedback
- Learner profile & accessibility settings (WCAG 2.1 AA UI)
- High contrast mode, font size controls, skip links, ARIA landmarks

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Demo login:** Enter any email/password, select Student or Teacher role.

## Project Structure

```
src/
├── components/     # UI, layout, TTS, Braille, upload components
├── context/        # Auth & app state (mock)
├── hooks/          # TTS, localStorage hooks
├── pages/          # Route pages
└── utils/          # Mock data, Braille, processing simulator
```

## Backend (Planned)

The frontend is designed to connect to a Python backend with:
- OpenCV preprocessing, Tesseract OCR, PyMuPDF, python-pptx
- Gemini API for simplification, translation, TTS, image description
- liblouis for Braille, Firebase Auth/Firestore/Storage

## Accessibility

- WCAG 2.1 AA compliant interface
- Semantic HTML with ARIA landmarks
- Keyboard navigation and focus management
- `prefers-reduced-motion` support
- Skip-to-content link
- Screen-reader-friendly components
