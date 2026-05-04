import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Page } from '../App';

interface LoginPageProps {
  navigateTo: (page: Page) => void;
  onLogin: (username: string) => void;
}

export function LoginPage({ navigateTo, onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">
            Quiz<span className="text-quiz-green">Genie</span>
          </CardTitle>
          <p className="text-muted-foreground">Welcome back!</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-quiz-green hover:bg-quiz-green/90 text-white"
            >
              Login
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <button
                onClick={() => navigateTo('register')}
                className="text-quiz-blue hover:underline"
              >
                Register here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}