import { MOCK_TEACHER_STATS } from '../utils/mockData';
import { Users, FileText, Clock, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const statCards = [
  { label: 'Total Documents', value: MOCK_TEACHER_STATS.totalDocuments, icon: FileText, color: 'text-teal' },
  { label: 'Active Students', value: MOCK_TEACHER_STATS.studentsActive, icon: Users, color: 'text-coral' },
  { label: 'Formats Generated', value: MOCK_TEACHER_STATS.formatsGenerated, icon: TrendingUp, color: 'text-sage' },
  { label: 'Avg. Processing', value: MOCK_TEACHER_STATS.avgProcessingTime, icon: Clock, color: 'text-ink' },
];

export default function TeacherDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display mb-2">Teacher Dashboard</h1>
        <p className="text-muted">Monitor student uploads and format generation across your class.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="!p-5">
            <div className="flex items-center gap-3 mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} aria-hidden="true" />
              <span className="text-sm text-muted">{stat.label}</span>
            </div>
            <p className="text-3xl font-display font-semibold">{stat.value}</p>
          </Card>
        ))}
      </div>

      <section aria-labelledby="recent-activity">
        <h2 id="recent-activity" className="text-xl font-display mb-4">Recent Student Activity</h2>
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-ink/5 text-left text-muted">
                  <th className="px-6 py-3 font-medium" scope="col">Student</th>
                  <th className="px-6 py-3 font-medium" scope="col">Document</th>
                  <th className="px-6 py-3 font-medium" scope="col">Status</th>
                  <th className="px-6 py-3 font-medium" scope="col">Time</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TEACHER_STATS.recentUploads.map((item, i) => (
                  <tr key={i} className="border-b border-ink/5 last:border-0 hover:bg-cream/50">
                    <td className="px-6 py-4 font-medium">{item.student}</td>
                    <td className="px-6 py-4">{item.document}</td>
                    <td className="px-6 py-4"><Badge status={item.status} /></td>
                    <td className="px-6 py-4 text-muted">{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section aria-labelledby="format-status">
        <h2 id="format-status" className="text-xl font-display mb-4">Format Generation Overview</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {['Audio', 'Braille', 'Simplified', 'Translation', 'EPUB', 'Summary', 'Flashcards', 'Quiz'].map((format) => {
            const ready = Math.floor(Math.random() * 30) + 70;
            return (
              <Card key={format} className="!p-4 text-center">
                <p className="text-sm text-muted mb-1">{format}</p>
                <p className="text-2xl font-display font-semibold text-teal">{ready}%</p>
                <p className="text-xs text-muted">success rate</p>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
