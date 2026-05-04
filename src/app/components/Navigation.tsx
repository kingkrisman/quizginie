import React from 'react';
import { Button } from './ui/button';
import { Home, BookOpen, User, LogOut } from 'lucide-react';
import { Page, User as UserType } from '../App';

interface NavigationProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  user: UserType | null;
  onLogout: () => void;
}

export function Navigation({ currentPage, navigateTo, user, onLogout }: NavigationProps) {
  const navItems = [
    { page: 'home' as Page, label: 'Home', icon: Home },
    { page: 'flashcards' as Page, label: 'My Flashcards', icon: BookOpen },
    { page: 'profile' as Page, label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white border-b border-border px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl">
          Quiz<span className="text-quiz-green">Genie</span>
        </h1>

        {/* Navigation Items */}
        <div className="flex items-center gap-2">
          {navItems.map(({ page, label, icon: Icon }) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              onClick={() => navigateTo(page)}
              className={`flex items-center gap-2 ${
                currentPage === page 
                  ? "bg-quiz-green hover:bg-quiz-green/90 text-white" 
                  : "hover:bg-quiz-green-light hover:text-quiz-green"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
          
          {/* User Info & Logout */}
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border">
            <span className="text-muted-foreground">
              Welcome, {user?.username}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}