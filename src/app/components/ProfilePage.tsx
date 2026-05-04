import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Navigation } from './Navigation';
import { Page, User } from '../App';
import { User as UserIcon, Save, Check } from 'lucide-react';

interface ProfilePageProps {
  navigateTo: (page: Page) => void;
  user: User | null;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  totalSets: number;
  totalQuestions: number;
}

export function ProfilePage({ navigateTo, user, onLogout, onUpdateUser, totalSets, totalQuestions }: ProfilePageProps) {
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; email?: string }>({});

  const handleSave = () => {
    const newErrors: typeof errors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (user) {
      onUpdateUser({
        ...user,
        username: username.trim(),
        email: email.trim()
      });
      setIsSaved(true);
      toast.success('Profile updated!');
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage="profile" 
        navigateTo={navigateTo} 
        user={user} 
        onLogout={onLogout} 
      />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-quiz-green" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors(prev => ({ ...prev, username: undefined }));
                }}
                className={`bg-input-background ${errors.username ? 'border-red-500' : ''}`}
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                }}
                className={`bg-input-background ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <Button 
              onClick={handleSave}
              className={`${
                isSaved 
                  ? 'bg-quiz-green hover:bg-quiz-green/90' 
                  : 'bg-quiz-blue hover:bg-quiz-blue/90'
              } text-white transition-all duration-200`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-quiz-green-light rounded-lg">
                <p className="text-2xl text-quiz-green mb-1">{totalSets}</p>
                <p className="text-muted-foreground">Flashcard Sets</p>
              </div>
              <div className="text-center p-4 bg-quiz-blue-light rounded-lg">
                <p className="text-2xl text-quiz-blue mb-1">{totalQuestions}</p>
                <p className="text-muted-foreground">Total Flashcards</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
