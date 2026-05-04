/**
 * Smart Quiz Generator using local AI simulation
 * Analyzes text content and generates meaningful quiz questions
 */

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

/**
 * Extract key concepts and facts from text
 */
function extractKeyTerms(text: string): Array<{ term: string; context: string }> {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const terms: Array<{ term: string; context: string }> = [];

  // Find capitalized terms and important phrases
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

  return terms.slice(0, 10); // Limit to top 10 terms
}

/**
 * Generate questions based on extracted terms and content
 */
function generateQuestionsFromTerms(
  text: string,
  terms: Array<{ term: string; context: string }>
): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  // Question type 1: Definition questions
  terms.slice(0, 3).forEach(({ term, context }) => {
    questions.push({
      question: `What is ${term}?`,
      answer: context.includes(term) 
        ? context.trim()
        : `${term} is a key concept in the provided material. Based on context: ${context.trim()}`
    });
  });

  // Question type 2: Relationship questions
  if (sentences.length > 2) {
    const randomSentences = sentences.sort(() => Math.random() - 0.5).slice(0, 2);
    randomSentences.forEach((sentence, idx) => {
      questions.push({
        question: `Explain the significance of: ${sentence.trim().substring(0, 50)}...?`,
        answer: sentence.trim()
      });
    });
  }

  // Question type 3: Main concept question
  if (sentences.length > 0) {
    const mainContext = sentences.slice(0, Math.min(3, sentences.length)).join('. ');
    questions.push({
      question: "What are the main concepts discussed?",
      answer: mainContext.length > 200 
        ? mainContext.substring(0, 200) + "..."
        : mainContext
    });
  }

  // Question type 4: Application questions
  if (terms.length > 1) {
    const term1 = terms[0].term;
    const term2 = terms[1].term;
    questions.push({
      question: `How do ${term1} and ${term2} relate to each other?`,
      answer: `Based on the provided material, ${term1} and ${term2} are interconnected concepts. ${sentences[0] || 'They work together to form a comprehensive understanding of the topic.'}`
    });
  }

  // Question type 5: Summary question
  const wordCount = text.split(/\s+/).length;
  questions.push({
    question: "What is the key takeaway from this material?",
    answer: wordCount > 100
      ? `The material covers ${terms.length} main concepts: ${terms.map(t => t.term).join(', ')}. Focus on understanding how these concepts interconnect.`
      : `The essential point is: ${sentences[0]?.trim() || 'Review the material to understand the core concepts.'}`
  });

  return questions.filter((q, idx, arr) => arr.findIndex(a => a.question === q.question) === idx).slice(0, 6);
}

/**
 * Generate quiz from notes
 */
export async function generateQuizFromNotes(notes: string): Promise<GeneratedQuestion[]> {
  if (!notes.trim()) {
    return [];
  }

  // Simulate API processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Normalize text
  const cleanText = notes.trim().replace(/\s+/g, ' ');
  
  // Extract key terms
  const terms = extractKeyTerms(cleanText);
  
  // Generate questions
  const questions = generateQuestionsFromTerms(cleanText, terms);

  return questions;
}

/**
 * Extract text from PDF file
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        
        // Simple PDF text extraction using basic parsing
        // For production, use a library like pdf-parse or pdfjs-dist
        const text = extractPDFText(arrayBuffer);
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to extract text from PDF'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read PDF file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Improved PDF text extraction using ArrayBuffer parsing
 * Handles both text-based and partially scanned PDFs
 */
function extractPDFText(arrayBuffer: ArrayBuffer): string {
  try {
    const uint8Array = new Uint8Array(arrayBuffer);
    let text = '';
    let inTextStream = false;
    let consecutiveNonText = 0;

    // Strategy: Extract ASCII text between common PDF markers
    for (let i = 0; i < uint8Array.length; i++) {
      const byte = uint8Array[i];
      const prevByte = i > 0 ? uint8Array[i - 1] : 0;
      const nextByte = i < uint8Array.length - 1 ? uint8Array[i + 1] : 0;

      // Track if we're likely in a text stream
      const isReadableChar = (byte >= 32 && byte <= 126) || byte === 10 || byte === 13 || byte === 9;
      const isPossibleTextMarker = byte >= 33 && byte <= 126 && byte !== 37; // Not %

      if (isReadableChar) {
        // Add printable ASCII and whitespace
        if (byte === 10 || byte === 13) {
          if (text && !text.endsWith('\n')) {
            text += '\n';
          }
        } else if (byte === 9) {
          text += ' ';
        } else {
          text += String.fromCharCode(byte);
        }
        consecutiveNonText = 0;
        inTextStream = true;
      } else if (inTextStream && isPossibleTextMarker) {
        // Potential continuation of text
        consecutiveNonText = 0;
      } else {
        consecutiveNonText++;
        // Exit text stream after long binary section
        if (consecutiveNonText > 100) {
          inTextStream = false;
        }
      }
    }

    // Clean up extracted text
    text = text
      .split('\n')
      .map(line => line.trim().replace(/[^\w\s.!?,()\-:;'"\n]/g, ' ').replace(/\s+/g, ' '))
      .filter(line => line.length > 0)
      .join('\n')
      .trim();

    // Remove common PDF artifacts and metadata
    text = text
      .replace(/%%EOF[\s\S]*/g, '') // Remove EOF markers
      .replace(/\/Creator[^)]*\)/g, '')
      .replace(/\/Producer[^)]*\)/g, '')
      .replace(/\/CreationDate[^)]*\)/g, '')
      .replace(/obj\n/g, '\n')
      .replace(/endobj\n/g, '\n')
      .replace(/stream\n/g, '\n')
      .replace(/endstream\n/g, '\n')
      .replace(/\d+\s+\d+\s+obj/g, '') // Object declarations
      .replace(/BT[\s\S]*?ET/g, '') // Text objects
      .replace(/\/[A-Z]+\s+/g, '') // PDF operators
      .trim();

    // If extraction yielded too little, try alternative method
    if (text.length < 50) {
      text = extractPDFTextFallback(uint8Array);
    }

    if (text.length < 50) {
      throw new Error('Insufficient text extracted from PDF');
    }

    return text;
  } catch (error) {
    throw new Error('Could not extract text from PDF. Please ensure the PDF contains readable text.');
  }
}

/**
 * Fallback method for PDF text extraction
 * Simple character-by-character extraction for difficult PDFs
 */
function extractPDFTextFallback(uint8Array: Uint8Array): string {
  let text = '';
  let charCount = 0;

  // Extract any printable ASCII characters
  for (let i = 0; i < uint8Array.length; i++) {
    const byte = uint8Array[i];
    if ((byte >= 32 && byte <= 126) || byte === 10 || byte === 13 || byte === 9) {
      if (byte === 10 || byte === 13) {
        if (text && !text.endsWith('\n') && charCount > 10) {
          text += '\n';
          charCount = 0;
        }
      } else {
        text += String.fromCharCode(byte);
        charCount++;
      }
    }
  }

  return text
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, Math.min(5000, text.length)); // Limit size
}

/**
 * Generate quiz from PDF file
 */
export async function generateQuizFromPDF(file: File): Promise<GeneratedQuestion[]> {
  const text = await extractTextFromPDF(file);
  return generateQuizFromNotes(text);
}

/**
 * Generate multiple-choice exam questions from text
 */
export async function generateExamQuestions(
  notes: string,
  numQuestions: number = 5,
  difficulty: DifficultyLevel = 'medium'
): Promise<MultipleChoiceQuestion[]> {
  if (!notes.trim()) {
    return [];
  }

  await new Promise(resolve => setTimeout(resolve, 1200));

  const cleanText = notes.trim().replace(/\s+/g, ' ');
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const terms = extractKeyTerms(cleanText);

  const questions: MultipleChoiceQuestion[] = [];
  const usedSentences = new Set<number>();

  for (let i = 0; i < numQuestions && i < terms.length + sentences.length; i++) {
    const questionId = `q${i + 1}`;

    // Vary question types based on difficulty
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

/**
 * Generate easy-level questions (definition-based)
 */
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

/**
 * Generate medium-level questions (concept understanding)
 */
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
  const keyWord = extractMainConcept(sentence);

  return {
    id,
    question: `Which statement best describes: "${sentence.substring(0, 60)}..."?`,
    options: shuffleArray([
      sentence.substring(0, Math.min(80, sentence.length)),
      generateAlternativeStatement(sentence),
      generateAlternativeStatement(sentence),
      generateAlternativeStatement(sentence)
    ]),
    correctAnswer: sentence.substring(0, Math.min(80, sentence.length)),
    difficulty: 'medium',
    explanation: sentence
  };
}

/**
 * Generate hard-level questions (analysis and application)
 */
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

/**
 * Extract the main concept from a sentence
 */
function extractMainConcept(sentence: string): string {
  const words = sentence.split(/\s+/);
  return words.find(w => w.match(/^[A-Z]/)) || words[0] || '';
}

/**
 * Generate distractors (wrong answers) based on difficulty
 */
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
      // Easy: obvious distractors
      distractors.push(
        correctTerm + ' alternative ' + (i + 1),
        'Not ' + correctTerm,
        'Opposite of ' + correctTerm
      );
    } else {
      // Medium/Hard: more plausible distractors
      distractors.push(
        commonWrongAnswers[i % commonWrongAnswers.length] + ' ' + correctTerm,
        correctTerm.toLowerCase() + ' variant',
        commonWrongAnswers[(i + 1) % commonWrongAnswers.length]
      );
    }
  }

  return distractors.slice(0, count);
}

/**
 * Generate alternative statements for medium difficulty
 */
function generateAlternativeStatement(original: string): string {
  const alternatives = [
    original.substring(0, Math.max(10, original.length - 20)),
    'A related but different concept',
    'The opposite of the correct answer',
    'A common misconception about the topic'
  ];

  return alternatives[Math.floor(Math.random() * alternatives.length)];
}

/**
 * Shuffle array randomly
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
