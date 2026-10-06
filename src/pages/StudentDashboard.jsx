import { Link } from 'react-router-dom';
import { useAuth } from '../context/AppContext';
import { MOCK_STUDENT_DOCS } from '../utils/mockData';
import {
  Upload, Camera, FileText, ArrowRight, BookOpen, Volume2,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const quickActions = [
  { to: '/student/upload', icon: Upload, label: 'Upload Document', color: 'bg-teal/10 text-teal' },
  { to: '/student/webcam', icon: Camera, label: 'Webcam Scan', color: 'bg-coral/10 text-coral' },
  { to: '/student/output', icon: FileText, label: 'View Content', color: 'bg-ink/5 text-ink' },
  { to: '/student/chat', icon: BookOpen, label: 'AI Mentor', color: 'bg-sage/10 text-sage' },
];

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display mb-2">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-muted">Your personalized learning space. Pick up where you left off.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.to} to={action.to}>
            <Card hover className="text-center !p-5">
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mx-auto mb-3`}>
                <action.icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <p className="font-medium text-sm">{action.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Documents */}
      <section aria-labelledby="recent-docs">
        <div className="flex items-center justify-between mb-4">
          <h2 id="recent-docs" className="text-xl font-display">Recent Documents</h2>
          <Link to="/student/upload">
            <Button variant="outline" size="sm" icon={Upload}>New Upload</Button>
          </Link>
        </div>

        <div className="space-y-3">
          {MOCK_STUDENT_DOCS.map((doc) => (
            <Card key={doc.id} hover className="!p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-teal" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{doc.title}</h3>
                  <p className="text-sm text-muted">{doc.source}</p>
                </div>
                <Badge status={doc.status} />
                <Link to={doc.status === 'ready' ? '/student/output' : '/student/processing'}>
                  <Button variant="ghost" size="sm" icon={ArrowRight} aria-label={`Open ${doc.title}`} />
                </Link>
              </div>

              {doc.status === 'processing' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(doc.formats).map(([key, val]) => (
                    <span key={key} className="text-xs px-2 py-0.5 rounded-full bg-cream-dark text-muted capitalize">
                      {key}: {val.status}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Adaptive Engine */}
      <Card className="bg-gradient-to-r from-ink to-ink-light text-cream !border-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Volume2 className="w-10 h-10 text-teal-light shrink-0" aria-hidden="true" />
          <div className="flex-1">
            <h3 className="font-display text-lg mb-1">Adaptive Accessibility Engine</h3>
            <p className="text-cream/70 text-sm">
              Based on your profile, we prioritize audio, simplified text, and Braille formats.
              The AI mentor will re-explain content until you pass comprehension quizzes.
            </p>
          </div>
          <Link to="/student/settings">
            <Button variant="outline" className="border-cream/30 text-cream hover:bg-cream/10 shrink-0">
              Edit Profile
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
