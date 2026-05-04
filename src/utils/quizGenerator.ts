/**
 * Smart Quiz Generator using local AI simulation
 * Analyzes text content and generates meaningful quiz questions
 */

export interface GeneratedQuestion {
  question: string;
  answer: string;
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
 * Basic PDF text extraction using ArrayBuffer parsing
 * Note: This is a simplified implementation. For production use pdf.js or similar
 */
function extractPDFText(arrayBuffer: ArrayBuffer): string {
  try {
    // Convert ArrayBuffer to string
    const uint8Array = new Uint8Array(arrayBuffer);
    let text = '';
    
    // Attempt basic text extraction by looking for readable text streams
    for (let i = 0; i < uint8Array.length; i++) {
      const byte = uint8Array[i];
      
      // Extract ASCII printable characters
      if ((byte >= 32 && byte <= 126) || byte === 10 || byte === 13) {
        text += String.fromCharCode(byte);
      }
    }
    
    // Clean up extracted text
    text = text
      .replace(/[^\w\s.!?,()\-:;'"]/g, ' ') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
    
    if (text.length < 50) {
      throw new Error('Insufficient text extracted from PDF');
    }
    
    return text;
  } catch (error) {
    throw new Error('Could not extract text from PDF. Please ensure the PDF contains readable text.');
  }
}

/**
 * Generate quiz from PDF file
 */
export async function generateQuizFromPDF(file: File): Promise<GeneratedQuestion[]> {
  const text = await extractTextFromPDF(file);
  return generateQuizFromNotes(text);
}
