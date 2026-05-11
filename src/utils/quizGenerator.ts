export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface GeneratedQuestion {
  question: string;
  answer: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: DifficultyLevel;
  explanation: string;
}

function extractKeyTerms(text: string): Array<{ term: string; context: string }> {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const terms: Array<{ term: string; context: string }> = [];

  const termRegex = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
  
  sentences.forEach(sentence => {
    const matches = sentence.match(termRegex) || [];
    matches.forEach(match => {
      if (match.length > 2) {
        terms.push({
          term: match.trim(),
          context: sentence.trim()
        });
      }
    });
  });

  return terms.slice(0, 15);
}

function generateQuestionsFromTerms(
  text: string,
  terms: Array<{ term: string; context: string }>
): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  terms.slice(0, 3).forEach(({ term, context }) => {
    questions.push({
      question: `What is ${term}?`,
      answer: context.includes(term) 
        ? context.trim()
        : `${term} is a key concept in the provided material. Based on context: ${context.trim()}`
    });
  });

  if (sentences.length > 2) {
    const randomSentences = sentences.sort(() => Math.random() - 0.5).slice(0, 2);
    randomSentences.forEach((sentence) => {
      questions.push({
        question: `Explain: ${sentence.trim().substring(0, 60)}...?`,
        answer: sentence.trim()
      });
    });
  }

  if (sentences.length > 0) {
    const mainContext = sentences.slice(0, Math.min(3, sentences.length)).join('. ');
    questions.push({
      question: "What are the main concepts discussed?",
      answer: mainContext.length > 200 
        ? mainContext.substring(0, 200) + "..."
        : mainContext
    });
  }

  if (terms.length > 1) {
    const term1 = terms[0].term;
    const term2 = terms[1].term;
    questions.push({
      question: `How do ${term1} and ${term2} relate?`,
      answer: `${term1} and ${term2} are interconnected concepts discussed in the material.`
    });
  }

  const wordCount = text.split(/\s+/).length;
  questions.push({
    question: "What is the key takeaway?",
    answer: wordCount > 100
      ? `The material covers ${terms.length} main concepts: ${terms.map(t => t.term).join(', ')}.`
      : `The essential point is: ${sentences[0]?.trim() || 'Review the core concepts.'}`
  });

  return questions.filter((q, idx, arr) => arr.findIndex(a => a.question === q.question) === idx).slice(0, 6);
}

export async function generateQuizFromNotes(notes: string): Promise<GeneratedQuestion[]> {
  if (!notes.trim()) {
    return [];
  }

  await new Promise(resolve => setTimeout(resolve, 800));

  const cleanText = notes.trim().replace(/\s+/g, ' ');
  const terms = extractKeyTerms(cleanText);
  const questions = generateQuestionsFromTerms(cleanText, terms);

  return questions;
}

export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const text = extractPDFTextLocally(arrayBuffer);
        resolve(text);
      } catch (error) {
        console.error('PDF extraction error:', error);
        reject(new Error('Failed to extract text from PDF. Please ensure it contains readable text.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read PDF file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

function extractPDFTextLocally(arrayBuffer: ArrayBuffer): string {
  try {
    const uint8Array = new Uint8Array(arrayBuffer);
    let text = '';

    for (let i = 0; i < uint8Array.length; i++) {
      const byte = uint8Array[i];
      if ((byte >= 32 && byte <= 126) || byte === 10 || byte === 13 || byte === 9) {
        if (byte === 10 || byte === 13) {
          if (!text.endsWith('\n')) {
            text += '\n';
          }
        } else if (byte === 9) {
          text += ' ';
        } else {
          text += String.fromCharCode(byte);
        }
      }
    }

    text = text
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\n+/g, '\n')
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        if (trimmed.length === 0) return false;
        if (trimmed.startsWith('%%')) return false;
        if (trimmed.startsWith('/')) return false;
        if (trimmed.match(/^\d+\s+\d+\s+obj/)) return false;
        if (trimmed === 'stream' || trimmed === 'endstream' || trimmed === 'endobj') return false;
        return true;
      })
      .map(line => line.trim())
      .join(' ')
      .trim();

    text = text
      .replace(/[^\w\s.!?:;,\-()'"]/g, ' ')
      .replace(/[ ]+/g, ' ')
      .trim();

    if (text.length < 20) {
      throw new Error('Insufficient text extracted');
    }

    return text;
  } catch (error) {
    console.error('PDF text extraction failed:', error);
    throw new Error('Could not extract text from PDF. Please ensure the PDF contains readable text.');
  }
}

export async function generateQuizFromPDF(file: File): Promise<GeneratedQuestion[]> {
  const text = await extractTextFromPDF(file);
  return generateQuizFromNotes(text);
}

export async function generateExamQuestions(
  notes: string,
  numQuestions: number = 5,
  difficulty: DifficultyLevel = 'medium'
): Promise<MultipleChoiceQuestion[]> {
  if (!notes.trim()) {
    return [];
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  const cleanText = notes.trim().replace(/\s+/g, ' ');
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const terms = extractKeyTerms(cleanText);

  const questions: MultipleChoiceQuestion[] = [];
  const usedSentences = new Set<number>();

  for (let i = 0; i < numQuestions && i < terms.length + sentences.length; i++) {
    const questionId = `q${i + 1}`;
    let question: MultipleChoiceQuestion | null = null;

    if (difficulty === 'easy') {
      question = generateEasyQuestion(questionId, terms, sentences, i, usedSentences);
    } else if (difficulty === 'medium') {
      question = generateMediumQuestion(questionId, terms, sentences, i, usedSentences);
    } else {
      question = generateHardQuestion(questionId, terms, sentences, i, usedSentences);
    }

    if (question) {
      questions.push(question);
    }
  }

  return questions.slice(0, numQuestions);
}

function generateEasyQuestion(
  id: string,
  terms: Array<{ term: string; context: string }>,
  sentences: string[],
  index: number,
  usedSentences: Set<number>
): MultipleChoiceQuestion | null {
  if (index >= terms.length) return null;

  const { term, context } = terms[index];
  const distractors = generateDistractors(term, 3, 'easy');

  return {
    id,
    question: `What is ${term}?`,
    options: shuffleArray([term, ...distractors]),
    correctAnswer: term,
    difficulty: 'easy',
    explanation: context
  };
}

function generateMediumQuestion(
  id: string,
  terms: Array<{ term: string; context: string }>,
  sentences: string[],
  index: number,
  usedSentences: Set<number>
): MultipleChoiceQuestion | null {
  if (sentences.length === 0) return null;

  let sentenceIndex = Math.floor(Math.random() * sentences.length);
  while (usedSentences.has(sentenceIndex) && usedSentences.size < sentences.length) {
    sentenceIndex = Math.floor(Math.random() * sentences.length);
  }
  usedSentences.add(sentenceIndex);

  const sentence = sentences[sentenceIndex].trim();

  return {
    id,
    question: `Which statement best describes: "${sentence.substring(0, 60)}..."?`,
    options: shuffleArray([
      sentence.substring(0, Math.min(80, sentence.length)),
      "A different concept not covered in material",
      "The opposite of what was explained",
      "A related but distinct topic"
    ]),
    correctAnswer: sentence.substring(0, Math.min(80, sentence.length)),
    difficulty: 'medium',
    explanation: sentence
  };
}

function generateHardQuestion(
  id: string,
  terms: Array<{ term: string; context: string }>,
  sentences: string[],
  index: number,
  usedSentences: Set<number>
): MultipleChoiceQuestion | null {
  if (terms.length < 2) return null;

  const term1 = terms[index % terms.length];
  const term2 = terms[(index + 1) % terms.length];

  const question = `How do ${term1.term} and ${term2.term} relate in the context of the provided material?`;
  const correctAnswer = `${term1.term} and ${term2.term} are interconnected concepts that work together`;

  return {
    id,
    question,
    options: shuffleArray([
      correctAnswer,
      `${term1.term} is more important than ${term2.term}`,
      `${term2.term} is unrelated to ${term1.term}`,
      `They are opposites in every way`
    ]),
    correctAnswer,
    difficulty: 'hard',
    explanation: `${term1.term}: ${term1.context}. ${term2.term}: ${term2.context}`
  };
}

function generateDistractors(
  correctTerm: string,
  count: number,
  difficulty: DifficultyLevel
): string[] {
  const distractors: string[] = [];
  const commonWrongAnswers = [
    'A process that defines',
    'A concept that explains',
    'An approach that involves',
    'A principle that represents',
    'A method that demonstrates'
  ];

  for (let i = 0; i < count; i++) {
    if (difficulty === 'easy') {
      distractors.push(
        correctTerm + ' alternative',
        'Not ' + correctTerm,
        'Opposite of ' + correctTerm
      );
    } else {
      distractors.push(
        commonWrongAnswers[i % commonWrongAnswers.length] + ' ' + correctTerm,
        correctTerm.toLowerCase() + ' variant',
        commonWrongAnswers[(i + 1) % commonWrongAnswers.length]
      );
    }
  }

  return distractors.slice(0, count);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
