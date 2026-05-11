import { GoogleGenerativeAI } from '@google/generative-ai';

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

const getApiKey = (): string => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    throw new Error('VITE_GEMINI_API_KEY environment variable is not set');
  }
  return key;
};

const initializeGemini = () => {
  return new GoogleGenerativeAI(getApiKey());
};

export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const text = await extractPDFTextWithGemini(arrayBuffer, file.name);
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

async function extractPDFTextWithGemini(arrayBuffer: ArrayBuffer, fileName: string): Promise<string> {
  const uint8Array = new Uint8Array(arrayBuffer);

  let base64String = '';
  const chunkSize = 8192;

  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.slice(i, i + chunkSize);
    base64String += String.fromCharCode.apply(null, Array.from(chunk));
  }

  base64String = btoa(base64String);

  const genAI = initializeGemini();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

  const prompt = `Extract all readable text from this PDF. Return ONLY the clean text content without any formatting or metadata.`;

  const response = await model.generateContent([
    {
      inlineData: {
        mimeType: 'application/pdf',
        data: base64String,
      },
    },
    prompt,
  ]);

  const text = response.response.text();

  if (!text || text.length < 20) {
    throw new Error('Insufficient text extracted from PDF');
  }

  return text.trim();
}

export async function generateQuizFromNotes(notes: string): Promise<GeneratedQuestion[]> {
  if (!notes.trim()) {
    return [];
  }

  const genAI = initializeGemini();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

  const prompt = `You are an expert educator. Create 6 diverse and high-quality quiz questions from the provided notes.
  
  Return a JSON array with exactly this structure (no markdown, just raw JSON):
  [
    {
      "question": "question text",
      "answer": "detailed answer"
    }
  ]
  
  Requirements:
  - Create a mix of question types: definitions, conceptual understanding, application, analysis, synthesis, and recall
  - Each question should test deeper understanding, not just memorization
  - Answers should be comprehensive and educational
  - Questions should progressively increase in complexity
  - Focus on the most important concepts in the material
  
  Notes to create questions from:
  ${notes}`;

  const response = await model.generateContent(prompt);
  const responseText = response.response.text();

  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Failed to parse quiz questions from AI response');
  }

  const questions: GeneratedQuestion[] = JSON.parse(jsonMatch[0]);
  return questions.slice(0, 6);
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

  const genAI = initializeGemini();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

  const difficultyPrompt = {
    easy: 'factual recall and basic definitions. Options should have one obvious correct answer.',
    medium: 'conceptual understanding and simple application. Options should be plausible but distinguishable with study.',
    hard: 'critical thinking, analysis, and application. Options should be similar and require deep understanding to distinguish.'
  };

  const prompt = `You are an expert exam creator. Generate exactly ${numQuestions} multiple-choice exam questions at ${difficulty} difficulty level.
  
  Return a JSON array with this exact structure (no markdown, just raw JSON):
  [
    {
      "question": "question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "the correct option text",
      "explanation": "detailed explanation of why this is correct and why others are wrong"
    }
  ]
  
  Requirements for ${difficulty} difficulty:
  - ${difficultyPrompt[difficulty]}
  - Create varied question types: multiple choice with single answer
  - Ensure each option is a complete, grammatically correct statement
  - Options should be roughly the same length
  - Correct answer should not be always in the same position
  - Each question should test a different concept or skill
  - Explanations should be educational and help students learn
  
  Material to create questions from:
  ${notes}`;

  const response = await model.generateContent(prompt);
  const responseText = response.response.text();

  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Failed to parse exam questions from AI response');
  }

  const questionsData = JSON.parse(jsonMatch[0]);
  
  const questions: MultipleChoiceQuestion[] = questionsData.map(
    (q: any, idx: number) => ({
      id: `q${idx + 1}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: difficulty,
      explanation: q.explanation,
    })
  );

  return questions.slice(0, numQuestions);
}
