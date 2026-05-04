import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Navigation } from './Navigation';
import { Flashcard } from './Flashcard';
import { ExamSettingsDialog } from './ExamSettingsDialog';
import { Page, User, FlashcardSet } from '../App';
import { Sparkles, Save, Calendar, Upload, FileText, BookOpen } from 'lucide-react';
import { generateQuizFromNotes, generateQuizFromPDF, generateExamQuestions, DifficultyLevel, MultipleChoiceQuestion } from '../../utils/quizGenerator';

interface HomePageProps {
  navigateTo: (page: Page) => void;
  user: User | null;
  onLogout: () => void;
  onSaveFlashcards: (title: string, questions: Array<{ question: string; answer: string }>) => void;
  savedFlashcards: FlashcardSet[];
  onStartExam: (questions: MultipleChoiceQuestion[]) => void;
}

export function HomePage({ navigateTo, user, onLogout, onSaveFlashcards, savedFlashcards, onStartExam }: HomePageProps) {
  const [notes, setNotes] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Array<{ question: string; answer: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showExamSettings, setShowExamSettings] = useState(false);
  const [flashcardTitle, setFlashcardTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [numGeneratedQuestions, setNumGeneratedQuestions] = useState(0);

  const generateQuiz = async () => {
    if (!notes.trim()) return;

    setIsGenerating(true);
    try {
      const questions = await generateQuizFromNotes(notes);
      if (questions.length === 0) {
        toast.error('Could not generate questions. Please provide more detailed notes.');
      } else {
        setGeneratedQuestions(questions);
        setNumGeneratedQuestions(questions.length);
        toast.success(`Generated ${questions.length} quiz questions!`);
      }
    } catch (error) {
      toast.error('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      toast.error('Please upload a valid PDF file');
      return;
    }

    setIsGenerating(true);
    try {
      const questions = await generateQuizFromPDF(file);
      if (questions.length === 0) {
        toast.error('Could not extract content from PDF. Please ensure it contains readable text.');
      } else {
        setGeneratedQuestions(questions);
        setNumGeneratedQuestions(questions.length);
        setNotes(`Extracted from: ${file.name}`);
        toast.success(`Generated ${questions.length} quiz questions from PDF!`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process PDF');
    } finally {
      setIsGenerating(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveFlashcards = () => {
    if (!flashcardTitle.trim()) {
      toast.error('Please enter a title for this flashcard set');
      return;
    }
    if (generatedQuestions.length === 0) {
      toast.error('No questions to save');
      return;
    }
    onSaveFlashcards(flashcardTitle, generatedQuestions);
    setShowSaveDialog(false);
    setFlashcardTitle('');
    setGeneratedQuestions([]);
    setNotes('');
  };

  const handleStartExam = async (numQuestions: number, difficulty: DifficultyLevel) => {
    if (!notes.trim()) return;

    setIsGenerating(true);
    try {
      const questions = await generateExamQuestions(notes, numQuestions, difficulty);
      if (questions.length === 0) {
        toast.error('Could not generate exam questions. Please provide more detailed notes.');
      } else {
        onStartExam(questions);
        setShowExamSettings(false);
      }
    } catch (error) {
      toast.error('Failed to generate exam. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage="home" 
        navigateTo={navigateTo} 
        user={user} 
        onLogout={onLogout} 
      />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Notes Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-quiz-blue" />
              Generate Quiz from Notes or PDF
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your study notes here... The AI will generate quiz questions based on your content."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[200px] bg-input-background"
              disabled={isGenerating}
            />
            {!notes.trim() && <p className="text-sm text-muted-foreground">Enter some notes or upload a PDF to generate questions</p>}

            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={generateQuiz}
                disabled={!notes.trim() || isGenerating}
                className="bg-quiz-blue hover:bg-quiz-blue/90 text-white"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Quiz
                  </>
                )}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handlePDFUpload}
                className="hidden"
                disabled={isGenerating}
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating}
                variant="outline"
                className="border-quiz-green text-quiz-green hover:bg-quiz-green/10"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Flashcards */}
        {generatedQuestions.length > 0 && (
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
              <CardTitle>Generated Flashcards</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowExamSettings(true)}
                  className="bg-quiz-blue hover:bg-quiz-blue/90 text-white"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Take Exam
                </Button>
                <Button
                  onClick={() => setShowSaveDialog(true)}
                  className="bg-quiz-green hover:bg-quiz-green/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save to My Flashcards
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedQuestions.map((q, index) => (
                  <Flashcard
                    key={index}
                    question={q.question}
                    answer={q.answer}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Save Flashcard Set</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2">Flashcard Set Title</label>
                  <input
                    type="text"
                    value={flashcardTitle}
                    onChange={(e) => setFlashcardTitle(e.target.value)}
                    placeholder="Enter a title for this flashcard set"
                    className="w-full p-3 border border-border rounded-lg bg-input-background"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveFlashcards}
                    className="flex-1 bg-quiz-green hover:bg-quiz-green/90 text-white"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSaveDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Exam Settings Dialog */}
        {showExamSettings && (
          <ExamSettingsDialog
            maxQuestions={numGeneratedQuestions}
            onStart={handleStartExam}
            onCancel={() => setShowExamSettings(false)}
          />
        )}

        {/* Recently Saved Flashcards */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Saved Flashcard Sets</CardTitle>
          </CardHeader>
          <CardContent>
            {savedFlashcards.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No saved flashcard sets yet. Generate some quizzes to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {savedFlashcards.slice(0, 3).map((set) => (
                  <div
                    key={set.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <h4 className="text-foreground">{set.title}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created on {new Date(set.dateCreated).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {set.questions.length} cards
                    </div>
                  </div>
                ))}
                
                {savedFlashcards.length > 3 && (
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigateTo('flashcards')}
                    >
                      View All Flashcard Sets
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
