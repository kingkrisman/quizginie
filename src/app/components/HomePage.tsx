import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Navigation } from './Navigation';
import { Flashcard } from './Flashcard';
import { Page, User, FlashcardSet } from '../App';
import { Sparkles, Save, Calendar } from 'lucide-react';

interface HomePageProps {
  navigateTo: (page: Page) => void;
  user: User | null;
  onLogout: () => void;
  onSaveFlashcards: (title: string, questions: Array<{ question: string; answer: string }>) => void;
  savedFlashcards: FlashcardSet[];
}

export function HomePage({ navigateTo, user, onLogout, onSaveFlashcards, savedFlashcards }: HomePageProps) {
  const [notes, setNotes] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Array<{ question: string; answer: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [flashcardTitle, setFlashcardTitle] = useState('');

  // Mock AI quiz generation
  const generateQuiz = async () => {
    if (!notes.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock generated questions based on notes content
    const mockQuestions = [
      {
        question: "What is the main topic discussed in these notes?",
        answer: "The main topic relates to the key concepts mentioned in your study material."
      },
      {
        question: "What are the key points to remember?",
        answer: "The essential points include the fundamental principles outlined in your notes."
      },
      {
        question: "How do these concepts relate to each other?",
        answer: "These concepts are interconnected through the relationships described in your material."
      },
      {
        question: "What examples were provided?",
        answer: "Several practical examples were given to illustrate the main concepts."
      },
      {
        question: "What should you focus on for studying?",
        answer: "Focus on understanding the core principles and their practical applications."
      }
    ];
    
    setGeneratedQuestions(mockQuestions);
    setIsGenerating(false);
  };

  const handleSaveFlashcards = () => {
    if (flashcardTitle.trim() && generatedQuestions.length > 0) {
      onSaveFlashcards(flashcardTitle, generatedQuestions);
      setShowSaveDialog(false);
      setFlashcardTitle('');
      setGeneratedQuestions([]);
      setNotes('');
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
              Generate Quiz from Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your study notes here... The AI will generate quiz questions based on your content."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[200px] bg-input-background"
            />
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
          </CardContent>
        </Card>

        {/* Generated Flashcards */}
        {generatedQuestions.length > 0 && (
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generated Flashcards</CardTitle>
              <Button
                onClick={() => setShowSaveDialog(true)}
                className="bg-quiz-green hover:bg-quiz-green/90 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save to My Flashcards
              </Button>
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