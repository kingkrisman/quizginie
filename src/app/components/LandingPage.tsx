import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  FileText, 
  Sparkles, 
  Brain, 
  Clock, 
  Target, 
  BookOpen, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Trophy,
  Star
} from 'lucide-react';
import { Page } from '../App';

interface LandingPageProps {
  navigateTo: (page: Page) => void;
}

export function LandingPage({ navigateTo }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl">
            Quiz<span className="text-quiz-green">Genie</span>
          </h1>
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigateTo('login')}
              className="hover:bg-quiz-green-light hover:text-quiz-green"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigateTo('register')}
              className="bg-quiz-green hover:bg-quiz-green/90 text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-quiz-green-light/30 via-white to-quiz-blue-light/30">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 border-quiz-green text-quiz-green">
            ✨ AI-Powered Study Tool
          </Badge>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 text-foreground">
            Transform Your <span className="text-quiz-green">Notes</span><br />
            Into <span className="text-quiz-blue">Smart Quizzes</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed">
            Stop spending hours creating study materials. QuizGenie uses advanced AI to instantly convert your lecture notes, textbooks, and study guides into personalized flashcards and practice quizzes.
          </p>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Perfect for students, professionals, and lifelong learners who want to study smarter, not harder.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={() => navigateTo('register')}
              className="bg-quiz-green hover:bg-quiz-green/90 text-white px-8 py-4 text-lg"
              size="lg"
            >
              Start Learning for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigateTo('login')}
              className="px-8 py-4 text-lg border-quiz-blue text-quiz-blue hover:bg-quiz-blue-light"
              size="lg"
            >
              Sign In
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl text-quiz-green mb-2">2-5 min</div>
              <p className="text-muted-foreground">Quiz generation time</p>
            </div>
            <div className="text-center">
              <div className="text-3xl text-quiz-blue mb-2">5-10x</div>
              <p className="text-muted-foreground">Faster than manual creation</p>
            </div>
            <div className="text-center">
              <div className="text-3xl text-quiz-green mb-2">100%</div>
              <p className="text-muted-foreground">Free to get started</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-6">How QuizGenie Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform any study material into engaging, interactive learning experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-quiz-green-light rounded-full flex items-center justify-center mb-6 mx-auto">
                <FileText className="w-10 h-10 text-quiz-green" />
              </div>
              <div className="bg-quiz-green text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mb-4 mx-auto">1</div>
              <h3 className="text-2xl mb-4">Paste Your Notes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Copy and paste any text - lecture notes, textbook chapters, research papers, or study guides. QuizGenie accepts content from any subject and academic level.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-quiz-blue-light rounded-full flex items-center justify-center mb-6 mx-auto">
                <Sparkles className="w-10 h-10 text-quiz-blue" />
              </div>
              <div className="bg-quiz-blue text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mb-4 mx-auto">2</div>
              <h3 className="text-2xl mb-4">AI Creates Questions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our advanced AI analyzes your content and generates thoughtful, relevant questions that test key concepts, definitions, and relationships between ideas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-quiz-green-light rounded-full flex items-center justify-center mb-6 mx-auto">
                <Brain className="w-10 h-10 text-quiz-green" />
              </div>
              <div className="bg-quiz-green text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mb-4 mx-auto">3</div>
              <h3 className="text-2xl mb-4">Study & Master</h3>
              <p className="text-muted-foreground leading-relaxed">
                Practice with interactive flashcards, save your favorite sets, and track your progress as you master the material through spaced repetition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-6">Why Students Love QuizGenie</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to study more effectively and retain information longer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <Zap className="w-12 h-12 text-quiz-blue mx-auto mb-4" />
                <h3 className="text-xl mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Generate comprehensive quizzes in under 5 minutes. No more spending hours creating study materials manually.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 text-quiz-green mx-auto mb-4" />
                <h3 className="text-xl mb-3">Smart Questions</h3>
                <p className="text-muted-foreground">
                  AI identifies the most important concepts and creates questions that actually help you learn and remember.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-quiz-blue mx-auto mb-4" />
                <h3 className="text-xl mb-3">Any Subject</h3>
                <p className="text-muted-foreground">
                  Works with any topic - from biology and chemistry to history, literature, and business studies.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-quiz-green mx-auto mb-4" />
                <h3 className="text-xl mb-3">Save Time</h3>
                <p className="text-muted-foreground">
                  Spend more time learning, less time preparing. Focus on understanding concepts instead of creating materials.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <Trophy className="w-12 h-12 text-quiz-blue mx-auto mb-4" />
                <h3 className="text-xl mb-3">Better Retention</h3>
                <p className="text-muted-foreground">
                  Interactive flashcards and active recall techniques help you remember information longer and perform better on exams.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-quiz-green mx-auto mb-4" />
                <h3 className="text-xl mb-3">Organize & Share</h3>
                <p className="text-muted-foreground">
                  Save your quiz sets, organize by subject, and easily review before important tests and assignments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-6">Perfect For Every Learner</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-quiz-green/20 bg-quiz-green-light/20">
              <CardContent className="p-8">
                <h3 className="text-2xl mb-4 text-quiz-green">High School Students</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-quiz-green mt-0.5 flex-shrink-0" />
                    <span>AP exam preparation across all subjects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-quiz-green mt-0.5 flex-shrink-0" />
                    <span>Quick review before tests and quizzes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-quiz-green mt-0.5 flex-shrink-0" />
                    <span>Turn textbook chapters into study guides</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-quiz-blue/20 bg-quiz-blue-light/20">
              <CardContent className="p-8">
                <h3 className="text-2xl mb-4 text-quiz-blue">College Students</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-quiz-blue mt-0.5 flex-shrink-0" />
                    <span>Convert lecture notes into practice exams</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-quiz-blue mt-0.5 flex-shrink-0" />
                    <span>Master complex concepts in STEM courses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-quiz-blue mt-0.5 flex-shrink-0" />
                    <span>Prepare for midterms and finals efficiently</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-quiz-green/20 bg-quiz-green-light/20">
              <CardContent className="p-8">
                <h3 className="text-2xl mb-4 text-quiz-green">Adult Learners</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-quiz-green mt-0.5 flex-shrink-0" />
                    <span>Professional certification exam prep</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-quiz-green mt-0.5 flex-shrink-0" />
                    <span>Skill development and training materials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-quiz-green mt-0.5 flex-shrink-0" />
                    <span>Language learning and vocabulary building</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-16">What Students Are Saying</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex gap-1 justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "QuizGenie saved me hours of study prep time. I can turn my biology notes into practice questions in minutes!"
                </p>
                <div>
                  <div className="font-medium">Sarah Chen</div>
                  <div className="text-sm text-muted-foreground">Pre-Med Student, UCLA</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex gap-1 justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "The AI creates exactly the type of questions I need to study. It's like having a personal tutor!"
                </p>
                <div>
                  <div className="font-medium">Marcus Johnson</div>
                  <div className="text-sm text-muted-foreground">Engineering Student, MIT</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex gap-1 justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "My grades improved significantly after using QuizGenie. The flashcards help me retain information so much better."
                </p>
                <div>
                  <div className="font-medium">Emma Rodriguez</div>
                  <div className="text-sm text-muted-foreground">Psychology Major, Stanford</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-quiz-green to-quiz-blue text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-6">Ready to Study Smarter?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who are already using QuizGenie to ace their exams and learn more effectively.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigateTo('register')}
              className="bg-white text-quiz-green hover:bg-gray-100 px-8 py-4 text-lg"
              size="lg"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigateTo('login')}
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
              size="lg"
            >
              Sign In
            </Button>
          </div>
          
          <p className="text-sm mt-6 opacity-75">
            No credit card required • Start generating quizzes immediately • 100% free to begin
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl mb-4">
            Quiz<span className="text-quiz-green">Genie</span>
          </h3>
          <p className="text-gray-400 mb-8">
            Transforming the way students learn, one quiz at a time.
          </p>
          <div className="text-sm text-gray-400">
            © 2025 QuizGenie. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}