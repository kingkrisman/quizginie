import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Navigation } from './Navigation';
import { Flashcard } from './Flashcard';
import { Page, User, FlashcardSet } from '../App';
import { Calendar, Play, ArrowLeft } from 'lucide-react';

interface MyFlashcardsPageProps {
  navigateTo: (page: Page) => void;
  user: User | null;
  onLogout: () => void;
  flashcardSets: FlashcardSet[];
}

export function MyFlashcardsPage({ navigateTo, user, onLogout, flashcardSets }: MyFlashcardsPageProps) {
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);

  if (selectedSet) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation 
          currentPage="flashcards" 
          navigateTo={navigateTo} 
          user={user} 
          onLogout={onLogout} 
        />
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedSet(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Flashcards
            </Button>
            
            <h1 className="text-3xl mb-2">{selectedSet.title}</h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Created on {new Date(selectedSet.dateCreated).toLocaleDateString()}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedSet.questions.map((q, index) => (
              <Flashcard
                key={index}
                question={q.question}
                answer={q.answer}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage="flashcards" 
        navigateTo={navigateTo} 
        user={user} 
        onLogout={onLogout} 
      />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">My Flashcard Sets</h1>
          <p className="text-muted-foreground">
            Review and study your saved flashcard collections
          </p>
        </div>

        {flashcardSets.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl mb-4">No Flashcard Sets Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by generating quizzes from your notes on the Home page.
              </p>
              <Button
                onClick={() => navigateTo('home')}
                className="bg-quiz-green hover:bg-quiz-green/90 text-white"
              >
                Generate Your First Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcardSets.map((set) => (
              <Card 
                key={set.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedSet(set)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{set.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(set.dateCreated).toLocaleDateString()}
                    </p>
                    
                    <p className="text-sm text-muted-foreground">
                      {set.questions.length} flashcards
                    </p>

                    <Button 
                      className="w-full bg-quiz-blue hover:bg-quiz-blue/90 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSet(set);
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Study Set
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}