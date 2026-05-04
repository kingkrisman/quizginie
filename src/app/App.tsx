import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { HomePage } from './components/HomePage';
import { MyFlashcardsPage } from './components/MyFlashcardsPage';
import { ProfilePage } from './components/ProfilePage';

export type Page = 'landing' | 'login' | 'register' | 'home' | 'flashcards' | 'profile';

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface FlashcardSet {
  id: number;
  title: string;
  dateCreated: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [savedFlashcards, setSavedFlashcards] = useState<FlashcardSet[]>([
    {
      id: 1,
      title: "Biology Chapter 3",
      dateCreated: "2025-08-25",
      questions: [
        { question: "What is photosynthesis?", answer: "The process by which plants convert light energy into chemical energy" },
        { question: "What organelle performs photosynthesis?", answer: "Chloroplasts" }
      ]
    },
    {
      id: 2,
      title: "Math Derivatives",
      dateCreated: "2025-08-24",
      questions: [
        { question: "What is the derivative of x²?", answer: "2x" },
        { question: "What is the power rule?", answer: "d/dx[x^n] = nx^(n-1)" }
      ]
    }
  ]);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const login = (username: string) => {
    setUser({ id: 1, username, email: `${username}@example.com` });
    setCurrentPage('home');
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  const saveFlashcardSet = (title: string, questions: Array<{ question: string; answer: string }>) => {
    const newSet: FlashcardSet = {
      id: Date.now(),
      title,
      dateCreated: new Date().toISOString().split('T')[0],
      questions
    };
    setSavedFlashcards(prev => [newSet, ...prev]);
    toast.success(`"${title}" saved successfully!`);
  };

  const deleteFlashcardSet = (id: number) => {
    const set = savedFlashcards.find(s => s.id === id);
    setSavedFlashcards(prev => prev.filter(s => s.id !== id));
    if (set) {
      toast.success(`"${set.title}" deleted`);
    }
  };

  const updateFlashcardSet = (id: number, title: string, questions: Array<{ question: string; answer: string }>) => {
    setSavedFlashcards(prev =>
      prev.map(s => s.id === id ? { ...s, title, questions } : s)
    );
    toast.success('Flashcard set updated!');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage navigateTo={navigateTo} />;
      case 'login':
        return <LoginPage navigateTo={navigateTo} onLogin={login} />;
      case 'register':
        return <RegisterPage navigateTo={navigateTo} onRegister={login} />;
      case 'home':
        return <HomePage 
          navigateTo={navigateTo} 
          user={user} 
          onLogout={logout}
          onSaveFlashcards={saveFlashcardSet}
          savedFlashcards={savedFlashcards}
        />;
      case 'flashcards':
        return <MyFlashcardsPage
          navigateTo={navigateTo}
          user={user}
          onLogout={logout}
          flashcardSets={savedFlashcards}
          onDeleteSet={deleteFlashcardSet}
          onUpdateSet={updateFlashcardSet}
        />;
      case 'profile':
        return <ProfilePage
          navigateTo={navigateTo}
          user={user}
          onLogout={logout}
          onUpdateUser={setUser}
          totalSets={savedFlashcards.length}
          totalQuestions={savedFlashcards.reduce((sum, set) => sum + set.questions.length, 0)}
        />;
      default:
        return <LandingPage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderPage()}
      <Toaster position="top-right" richColors />
    </div>
  );
}
