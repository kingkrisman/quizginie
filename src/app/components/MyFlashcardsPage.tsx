import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Navigation } from './Navigation';
import { Flashcard } from './Flashcard';
import { Page, User, FlashcardSet } from '../App';
import { Calendar, Play, ArrowLeft, Trash2, Edit2 } from 'lucide-react';

interface MyFlashcardsPageProps {
  navigateTo: (page: Page) => void;
  user: User | null;
  onLogout: () => void;
  flashcardSets: FlashcardSet[];
  onDeleteSet: (id: number) => void;
  onUpdateSet: (id: number, title: string, questions: Array<{ question: string; answer: string }>) => void;
}

export function MyFlashcardsPage({ navigateTo, user, onLogout, flashcardSets, onDeleteSet, onUpdateSet }: MyFlashcardsPageProps) {
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  if (editingSet) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation
          currentPage="flashcards"
          navigateTo={navigateTo}
          user={user}
          onLogout={onLogout}
        />

        <div className="max-w-2xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => {
              setEditingSet(null);
              setEditTitle('');
            }}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Edit Flashcard Set</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block mb-2">Set Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-input-background"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (editTitle.trim()) {
                      onUpdateSet(editingSet.id, editTitle, editingSet.questions);
                      setEditingSet(null);
                      setEditTitle('');
                      setSelectedSet(null);
                    } else {
                      toast.error('Title cannot be empty');
                    }
                  }}
                  className="bg-quiz-green hover:bg-quiz-green/90 text-white"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingSet(null);
                    setEditTitle('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl mb-2">{selectedSet.title}</h1>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created on {new Date(selectedSet.dateCreated).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingSet(selectedSet);
                    setEditTitle(selectedSet.title);
                  }}
                  className="gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(selectedSet.id)}
                  className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>

            {deleteConfirm === selectedSet.id && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="mb-3">Are you sure you want to delete this set?</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      onDeleteSet(selectedSet.id);
                      setDeleteConfirm(null);
                      setSelectedSet(null);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteConfirm(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
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
                className="hover:shadow-lg transition-shadow"
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
                      onClick={() => setSelectedSet(set)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Study Set
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        onDeleteSet(set.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
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
