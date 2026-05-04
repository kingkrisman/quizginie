import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Navigation } from './Navigation';
import { Page, User } from '../App';
import { MultipleChoiceQuestion } from '../../utils/quizGenerator';
import { ChevronRight, ChevronLeft, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface ExamPageProps {
  questions: MultipleChoiceQuestion[];
  navigateTo: (page: Page) => void;
  user: User | null;
  onLogout: () => void;
  onShowResults: (answers: Map<string, string>, questions: MultipleChoiceQuestion[]) => void;
}

export function ExamPage({
  questions,
  navigateTo,
  user,
  onLogout,
  onShowResults
}: ExamPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [usedHints, setUsedHints] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = answers.has(currentQuestion.id);
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allAnswered = answers.size === questions.length;

  const handleSelectAnswer = (option: string) => {
    setAnswers(prev => new Map(prev).set(currentQuestion.id, option));
    setShowHint(false);
  };

  const generateHint = (): string => {
    const difficulty = currentQuestion.difficulty;

    if (difficulty === 'easy') {
      return `Think about the definition: The term "${currentQuestion.correctAnswer}" refers to...`;
    } else if (difficulty === 'medium') {
      return `Look for the option that best explains the concept or relationship. Think about how the different parts of the material connect.`;
    } else {
      return `This question requires understanding how concepts work together. Consider the relationship and application between different topics.`;
    }
  };

  const handleRequestHint = () => {
    if (!usedHints.has(currentQuestion.id)) {
      setUsedHints(prev => new Set(prev).add(currentQuestion.id));
      setShowHint(true);
    }
  };

  const hasHintAvailable = !usedHints.has(currentQuestion.id);

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (allAnswered) {
      onShowResults(answers, questions);
    }
  };

  const getProgressPercentage = () => {
    return Math.round((answers.size / questions.length) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentPage="home"
        navigateTo={navigateTo}
        user={user}
        onLogout={onLogout}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">
              Exam in Progress
            </h2>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-quiz-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg mb-2">
                  {currentQuestion.question}
                </CardTitle>
                <div className="flex gap-2">
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor:
                        currentQuestion.difficulty === 'easy'
                          ? 'var(--color-quiz-green)'
                          : currentQuestion.difficulty === 'medium'
                          ? 'var(--color-quiz-blue)'
                          : 'rgb(239, 68, 68)',
                      color: 'white'
                    }}
                  >
                    {currentQuestion.difficulty.charAt(0).toUpperCase() +
                      currentQuestion.difficulty.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers.get(currentQuestion.id) === option;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(option)}
                    className="w-full text-left p-4 border-2 rounded-lg transition-all"
                    style={{
                      borderColor: isSelected
                        ? 'var(--color-quiz-blue)'
                        : 'var(--color-border)',
                      backgroundColor: isSelected
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1"
                        style={{
                          borderColor: isSelected
                            ? 'var(--color-quiz-blue)'
                            : 'var(--color-border)',
                          backgroundColor: isSelected
                            ? 'var(--color-quiz-blue)'
                            : 'transparent'
                        }}
                      >
                        {isSelected && (
                          <div
                            className="w-2 h-2 bg-white rounded-full m-auto mt-1"
                          />
                        )}
                      </div>
                      <span className="text-foreground font-medium">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Hint Section */}
            <div className="pt-3 border-t border-border">
              {showHint && (
                <div className="p-4 mb-3 bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-400 rounded">
                  <div className="flex gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-900 dark:text-yellow-200">{generateHint()}</p>
                  </div>
                </div>
              )}
              <Button
                onClick={handleRequestHint}
                disabled={!hasHintAvailable}
                variant="outline"
                className="w-full border-yellow-400 text-yellow-700 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-950/30"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {hasHintAvailable ? 'Get a Hint' : 'Hint Used'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation and Progress */}
        <div className="space-y-4">
          {/* Question Navigator */}
          <Card className="p-4">
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className="w-10 h-10 rounded-lg font-medium text-sm transition-all"
                  style={{
                    backgroundColor:
                      idx === currentQuestionIndex
                        ? 'var(--color-quiz-blue)'
                        : answers.has(q.id)
                        ? 'var(--color-quiz-green)'
                        : 'var(--color-muted)',
                    color:
                      idx === currentQuestionIndex || answers.has(q.id)
                        ? 'white'
                        : 'var(--color-muted-foreground)',
                    border:
                      idx === currentQuestionIndex
                        ? '2px solid var(--color-quiz-blue)'
                        : 'none'
                  }}
                  title={answers.has(q.id) ? 'Answered' : 'Unanswered'}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Progress: {answers.size} of {questions.length} answered ({getProgressPercentage()}%)
            </p>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {!isLastQuestion ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-quiz-blue hover:bg-quiz-blue/90 text-white"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => setShowConfirmSubmit(true)}
                disabled={!allAnswered}
                className="flex-1 bg-quiz-green hover:bg-quiz-green/90 text-white"
              >
                Submit Exam
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Submit Exam?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                You have answered all {questions.length} questions. Are you ready to submit?
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-quiz-green hover:bg-quiz-green/90 text-white"
                >
                  Submit
                </Button>
                <Button
                  onClick={() => setShowConfirmSubmit(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
