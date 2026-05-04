import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Page } from '../App';

interface RegisterPageProps {
  navigateTo: (page: Page) => void;
  onRegister: (username: string) => void;
}

export function RegisterPage({ navigateTo, onRegister }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username.trim() && formData.password === formData.confirmPassword) {
      onRegister(formData.username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">
            Quiz<span className="text-quiz-green">Genie</span>
          </CardTitle>
          <p className="text-muted-foreground">Create your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                required
                className="bg-input-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                className="bg-input-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
                className="bg-input-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                required
                className="bg-input-background"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-quiz-green hover:bg-quiz-green/90 text-white"
            >
              Register
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={() => navigateTo('login')}
                className="text-quiz-blue hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}