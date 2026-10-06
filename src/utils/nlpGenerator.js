/**
 * NLP Generator Service
 * Since this is a frontend-only application without a live LLM backend,
 * this service uses heuristic (rule-based) algorithms to dynamically 
 * generate accessibility modules from the raw extracted text.
 */

export const generateModulesFromText = (rawText) => {
  if (!rawText || rawText.trim().length === 0) {
    throw new Error("No text could be extracted from the document.");
  }

  const sentences = rawText
    .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
    .split("|")
    .map(s => s.trim())
    .filter(s => s.length > 10); // Filter out tiny fragments

  return {
    originalText: rawText,
    summary: generateSummary(sentences),
    flashcards: generateFlashcards(sentences),
    quiz: generateQuiz(sentences),
    simplifiedText: generateSimplified(rawText),
    translations: generateTranslations(rawText),
  };
};

const generateSummary = (sentences) => {
  if (sentences.length <= 5) return sentences;
  
  // Heuristic: Take the first two sentences (intro) and last two sentences (conclusion)
  // Or grab random sentences for a longer document.
  const summary = [];
  summary.push(sentences[0]);
  if (sentences.length > 2) summary.push(sentences[1]);
  
  const midPoint = Math.floor(sentences.length / 2);
  if (midPoint > 1 && midPoint < sentences.length - 2) {
    summary.push(sentences[midPoint]);
  }
  
  if (sentences.length > 3) summary.push(sentences[sentences.length - 2]);
  summary.push(sentences[sentences.length - 1]);
  
  return summary;
};

const generateFlashcards = (sentences) => {
  const flashcards = [];
  
  // Heuristic: Create flashcards out of sentences that have a comma or "is" / "are"
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    if (flashcards.length >= 10) break; // Max 10 flashcards
    
    if (sentence.includes(" is ")) {
      const parts = sentence.split(" is ");
      flashcards.push({ front: `What is ${parts[0].toLowerCase()}?`, back: parts[1] });
    } else if (sentence.includes(" are ")) {
      const parts = sentence.split(" are ");
      flashcards.push({ front: `What are ${parts[0].toLowerCase()}?`, back: parts[1] });
    } else if (sentence.length > 30 && sentence.length < 150) {
      // Split the sentence in half
      const words = sentence.split(' ');
      const mid = Math.floor(words.length / 2);
      flashcards.push({ 
        front: words.slice(0, mid).join(' ') + '...', 
        back: '... ' + words.slice(mid).join(' ') 
      });
    }
  }

  // Fallback if we couldn't generate any
  if (flashcards.length === 0 && sentences.length > 0) {
    flashcards.push({ front: "Main Topic", back: sentences[0] });
  }

  return flashcards;
};

const generateSimplified = (rawText) => {
  // Heuristic: Just return the text. A real implementation requires an LLM.
  return {
    grade3: `[Simplified for Grade 3]\n\n${rawText.substring(0, 500)}...`,
    grade5: `[Simplified for Grade 5]\n\n${rawText.substring(0, 800)}...`,
    grade8: `[Simplified for Grade 8]\n\n${rawText}`,
  };
};

const generateQuiz = (sentences) => {
  const quiz = [];

  for (let i = 0; i < sentences.length && quiz.length < 5; i++) {
    const sentence = sentences[i];

    // Heuristic: sentences with "is" or "are" can be turned into definition questions
    if (sentence.includes(' is ') && sentence.length > 30) {
      const parts = sentence.split(' is ');
      const term = parts[0].split(' ').slice(-3).join(' ').trim();
      const definition = parts.slice(1).join(' is ').replace(/[.?!]$/, '');

      // Build 3 plausible-sounding wrong answers from OTHER sentences
      const distractors = sentences
        .filter((s, j) => j !== i && s.length > 20 && s.length < 120)
        .slice(0, 3)
        .map(s => s.split(' ').slice(0, 6).join(' ') + '...');

      if (distractors.length < 3) continue;

      const options = [definition, ...distractors];
      // Shuffle options
      for (let k = options.length - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1));
        [options[k], options[j]] = [options[j], options[k]];
      }
      const correctIndex = options.indexOf(definition);

      quiz.push({
        question: `What is ${term}?`,
        options,
        correct: correctIndex,
        explanation: `${term} is ${definition}.`,
      });
    }
  }

  // Fallback: if text is too short, generate a generic question
  if (quiz.length === 0 && sentences.length > 0) {
    quiz.push({
      question: 'What is the main topic of this document?',
      options: [
        sentences[0]?.split(' ').slice(0, 6).join(' ') + '...',
        'A historical account of ancient events',
        'A scientific formula derivation',
        'A fictional narrative',
      ],
      correct: 0,
      explanation: sentences[0] || 'Based on the content of this document.',
    });
  }

  return quiz;
};

const generateTranslations = (rawText) => {
  // Heuristic: We cannot translate offline in the browser easily.
  const preview = rawText.substring(0, 200) + '...';
  return {
    hi: `[Hindi Translation Placeholder]\n\n(Backend LLM required for real translation)\n\nOriginal: ${preview}`,
    mr: `[Marathi Translation Placeholder]\n\n(Backend LLM required for real translation)\n\nOriginal: ${preview}`,
    ta: `[Tamil Translation Placeholder]\n\n(Backend LLM required for real translation)\n\nOriginal: ${preview}`,
  };
};
