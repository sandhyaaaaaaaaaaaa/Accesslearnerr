import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle, RotateCcw, Trophy, Upload } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Progress from '../components/ui/Progress';

export default function Quiz() {
  const navigate = useNavigate();
  const { currentDocument } = useApp();
  const quiz = currentDocument?.quiz;

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  // Guard: no document or no quiz questions
  if (!quiz || quiz.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center animate-fade-in py-20">
        <Card className="p-12">
          <Upload className="w-12 h-12 mx-auto text-muted mb-4" aria-hidden="true" />
          <h1 className="text-2xl font-display mb-2">No Quiz Available</h1>
          <p className="text-muted mb-6">
            Upload a document first and the quiz will be automatically generated from its content.
          </p>
          <Button onClick={() => navigate('/student/upload')}>Upload a Document</Button>
        </Card>
      </div>
    );
  }

  const question = quiz[currentQ];

  const handleSelect = (index) => {
    if (showResult) return;
    setSelected(index);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    const correct = selected === question.correct;
    setAnswers((prev) => [...prev, { question: currentQ, selected, correct }]);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQ < quiz.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    setFinished(false);
  };

  const score = answers.filter((a) => a.correct).length;
  const percentage = Math.round((score / quiz.length) * 100);

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto text-center animate-fade-in">
        <Card>
          <Trophy className="w-16 h-16 mx-auto text-coral mb-4" aria-hidden="true" />
          <h1 className="text-3xl font-display mb-2">Quiz Complete!</h1>
          <p className="text-5xl font-display font-bold text-teal mb-2">{percentage}%</p>
          <p className="text-muted mb-6">
            You got {score} out of {quiz.length} questions correct.
          </p>

          {percentage < 70 ? (
            <div className="p-4 bg-coral/10 rounded-xl text-sm mb-6">
              <p className="font-medium text-coral mb-1">Adaptive Engine Activated</p>
              <p className="text-muted">
                Based on your results, we'll prioritize simplified text and re-explanations
                for topics you missed. Visit the AI Mentor for targeted help.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-teal/10 rounded-xl text-sm mb-6">
              <p className="font-medium text-teal">Great comprehension!</p>
              <p className="text-muted">You've demonstrated understanding of this material.</p>
            </div>
          )}

          <div className="space-y-3 mb-6 text-left">
            {quiz.map((q, i) => {
              const ans = answers[i];
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-cream">
                  {ans?.correct ? (
                    <CheckCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{q.question}</p>
                    {!ans?.correct && (
                      <p className="text-xs text-muted mt-1">{q.explanation}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Button onClick={handleRestart} icon={RotateCcw}>Retake Quiz</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display mb-1">Comprehension Quiz</h1>
        <p className="text-muted text-sm">{currentDocument?.title}</p>
      </div>

      <Progress value={((currentQ + (showResult ? 1 : 0)) / quiz.length) * 100} label={`Question ${currentQ + 1} of ${quiz.length}`} className="mb-6" />

      <Card>
        <h2 className="text-lg font-medium mb-6">{question.question}</h2>

        <fieldset>
          <legend className="sr-only">Answer options</legend>
          <div className="space-y-3">
            {question.options.map((option, i) => {
              let style = 'border-ink/10 hover:border-teal/40';
              if (showResult) {
                if (i === question.correct) style = 'border-teal bg-teal/5';
                else if (i === selected) style = 'border-red-300 bg-red-50';
              } else if (selected === i) {
                style = 'border-teal bg-teal/5';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={showResult}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors ${style}`}
                  aria-pressed={selected === i}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>

        {showResult && (
          <div className={`mt-4 p-4 rounded-xl text-sm ${selected === question.correct ? 'bg-teal/10' : 'bg-coral/10'}`} role="status">
            <p className="font-medium mb-1">
              {selected === question.correct ? 'Correct!' : 'Not quite.'}
            </p>
            <p className="text-muted">{question.explanation}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          {!showResult ? (
            <Button onClick={handleSubmit} disabled={selected === null}>Submit Answer</Button>
          ) : (
            <Button onClick={handleNext}>
              {currentQ < quiz.length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
