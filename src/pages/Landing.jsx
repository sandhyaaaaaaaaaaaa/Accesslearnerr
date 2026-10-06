import { Link } from 'react-router-dom';
import {
  Upload, Camera, Volume2, CircleDot, Languages, BookOpen,
  Shield, Sparkles, ArrowRight, CheckCircle,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const features = [
  {
    icon: Upload,
    title: 'Multi-Format Upload',
    description: 'Upload PDFs, PowerPoints, Word docs, and scanned images. Our pipeline handles both native text and OCR extraction.',
  },
  {
    icon: Camera,
    title: 'Webcam Scan',
    description: 'Capture textbook pages with your webcam. OpenCV preprocessing auto-crops, deskews, and enhances contrast.',
  },
  {
    icon: Volume2,
    title: 'AI Text-to-Speech',
    description: 'Natural voices with karaoke-style highlighting, adjustable speed and pitch, and downloadable audio.',
  },
  {
    icon: CircleDot,
    title: 'Braille Generation',
    description: 'Convert content to Braille Ready Format (.BRF) with Grade 1/2 contraction rules via liblouis.',
  },
  {
    icon: BookOpen,
    title: 'Simplified Text',
    description: 'AI rewrites content at grade 3, 5, or 8 reading levels while preserving factual accuracy.',
  },
  {
    icon: Languages,
    title: 'Multilingual Translation',
    description: 'Translate into Hindi, Telugu, Tamil, and more — with accessibility tags preserved.',
  },
];

const standards = [
  'WCAG 2.1 AA Compliant',
  'EPUB Accessibility 1.1',
  'DAISY Compatible',
  'ARIA Landmarks & Semantic HTML',
];

export default function Landing() {
  return (
    <div className="pattern-dots">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-light to-teal/30" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cream text-sm mb-6">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              AI-Powered Inclusive Learning
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-white leading-tight mb-6">
              Learning accessible to{' '}
              <span className="text-teal-light">every mind</span>
            </h1>
            <p className="text-lg text-cream/80 mb-8 leading-relaxed max-w-2xl">
              AccessLearner transforms textbooks, lecture notes, and scanned documents into audio,
              Braille, simplified text, translations, and screen-reader-friendly formats — adapting
              until every learner demonstrates comprehension.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" icon={ArrowRight}>
                  Start Learning Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="relative h-16 bg-cream" aria-hidden="true">
          <svg className="absolute bottom-0 w-full h-16 text-cream" viewBox="0 0 1440 64" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,32 C360,64 720,0 1080,32 C1260,48 1380,48 1440,32 L1440,64 L0,64 Z" />
          </svg>
        </div>
      </section>

      {/* Standards */}
      <section className="py-8 border-b border-ink/5" aria-label="Accessibility standards">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-6">
          {standards.map((s) => (
            <div key={s} className="flex items-center gap-2 text-sm text-muted">
              <Shield className="w-4 h-4 text-teal" aria-hidden="true" />
              {s}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 id="features-heading" className="text-3xl sm:text-4xl font-display mb-4">
              Every format. Every learner.
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              A modular processing pipeline generates multiple accessible outputs concurrently.
              Each format fails gracefully — translation issues won't block your audio or Braille.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card key={f.title} hover className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-teal" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-display mb-2">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-20 bg-ink text-cream" aria-labelledby="pipeline-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="pipeline-heading" className="text-3xl font-display text-center mb-12">
            7-Stage Processing Pipeline
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Ingestion', 'Extraction', 'Enrichment', 'Transformation', 'Personalization', 'Delivery', 'Interaction'].map((stage, i) => (
              <div key={stage} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-teal-light text-sm font-medium">Stage {i + 1}</span>
                <p className="font-display mt-1">{stage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 id="cta-heading" className="text-3xl font-display mb-4">Ready to make learning inclusive?</h2>
          <p className="text-muted mb-8">Join students and teachers transforming how accessible education works.</p>
          <Link to="/register">
            <Button size="lg" icon={ArrowRight}>Create Free Account</Button>
          </Link>
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-muted">
            {['No credit card required', 'Free tier included', 'Student & Teacher roles'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-teal" aria-hidden="true" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-ink/5 text-center text-sm text-muted">
        <p>&copy; 2026 AccessLearner. Built for inclusive education.</p>
      </footer>
    </div>
  );
}
