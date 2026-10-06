import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

function buildInitialMessage(doc) {
  if (doc?.title && doc?.originalText) {
    return `Hi! I'm your AI learning mentor. I've read "${doc.title}" and I'm here to help you understand it. Ask me anything about the material, or say "quiz me" to test your comprehension.`;
  }
  return `Hi! I'm your AI learning mentor. Upload a document first and I'll answer your questions about it. You can also say "quiz me" to test your knowledge!`;
}

function getResponse(input, doc) {
  const lower = input.toLowerCase();
  const text = doc?.originalText?.toLowerCase() || '';
  const title = doc?.title || 'this document';

  if (lower.includes('quiz')) {
    return 'Great idea! Head to the Quiz section to test your understanding. I\'ll adapt my explanations based on which questions you miss. You can also ask me to re-explain any topic in simpler language.';
  }
  if (lower.includes('simplif') || lower.includes('easier')) {
    return `I can help with that! Try the Simplified Text tab in your content viewer — choose Grade 3, 5, or 8. Want me to explain a specific part of "${title}" right here? Just ask!`;
  }
  if (lower.includes('summary') || lower.includes('summarize') || lower.includes('summarise')) {
    if (doc?.summary?.length > 0) {
      return `Here's a summary of "${title}":\n\n${doc.summary.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
    }
    return `No summary is available yet. Upload a document and the summary will be auto-generated for you!`;
  }
  if (lower.includes('flashcard')) {
    const count = doc?.flashcards?.length ?? 0;
    return count > 0
      ? `I've generated ${count} flashcards from "${title}". Go to the Flashcards section to study them!`
      : 'No flashcards yet. Upload a document and I\'ll generate them automatically.';
  }

  // Keyword search against the actual document text
  if (text) {
    const words = lower.split(/\W+/).filter(w => w.length > 4);
    for (const word of words) {
      if (text.includes(word)) {
        // Find the sentence in the original text containing this word
        const sentences = doc.originalText.split(/[.!?]+/);
        const match = sentences.find(s => s.toLowerCase().includes(word));
        if (match && match.trim().length > 20) {
          return `Based on "${title}", here's what I found:\n\n"${match.trim()}"\n\nWould you like me to explain this in more detail?`;
        }
      }
    }
  }

  return `That's a great question about "${title}"! I'd suggest checking the main content sections. You can also try the Simplified Text tab or take the Quiz to test your understanding. Is there a specific term or concept you'd like me to focus on?`;
}

export default function Chatbot() {
  const { currentDocument } = useApp();
  const [messages, setMessages] = useState(() => [
    { role: 'assistant', content: buildInitialMessage(currentDocument) },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  // If a new document loads, add a new greeting message
  useEffect(() => {
    if (currentDocument?.title) {
      setMessages([{ role: 'assistant', content: buildInitialMessage(currentDocument) }]);
    }
  }, [currentDocument?.title]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: getResponse(userMsg.content, currentDocument) },
      ]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const suggestions = currentDocument?.title
    ? [
        `Summarize "${currentDocument.title}"`,
        'Generate flashcards',
        'Quiz me on this',
        'Simplify for grade 3',
      ]
    : ['Upload a document', 'How does this work?', 'Quiz me'];

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-12rem)] flex flex-col animate-fade-in">
      <div className="mb-4">
        <h1 className="text-3xl font-display mb-1 flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-teal" aria-hidden="true" />
          AI Learning Mentor
        </h1>
        <p className="text-muted text-sm">
          {currentDocument?.title
            ? `Discussing: "${currentDocument.title}"`
            : 'Upload a document to get started.'}
        </p>
      </div>

      <Card className="flex-1 flex flex-col !p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite" aria-label="Chat messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-ink text-white' : 'bg-teal/10 text-teal'
                }`}
                aria-hidden="true"
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-ink text-white rounded-br-md'
                    : 'bg-cream-dark text-ink rounded-bl-md'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-teal" aria-hidden="true" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-cream-dark rounded-bl-md">
                <span className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted animate-pulse-soft" />
                  <span className="w-2 h-2 rounded-full bg-muted animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
                  <span className="w-2 h-2 rounded-full bg-muted animate-pulse-soft" style={{ animationDelay: '0.4s' }} />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 border-t border-ink/5">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-cream-dark text-muted hover:text-ink hover:bg-teal/10 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <label htmlFor="chat-input" className="sr-only">Type your message</label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your learning material..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-ink/10 bg-surface focus:border-teal focus:ring-1 focus:ring-teal text-sm"
            />
            <Button type="submit" icon={Send} aria-label="Send message" disabled={!input.trim()}>
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
