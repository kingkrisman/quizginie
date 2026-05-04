import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Navigation } from './Navigation';
import { Page, User } from '../App';
import { MultipleChoiceQuestion } from '../../utils/quizGenerator';
import { CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';

interface ExamResultsPageProps {
  questions: MultipleChoiceQuestion[];
  answers: Map<string, string>;
  navigateTo: (page: Page) => void;
  user: User | null;
  onLogout: () => void;
}

interface QuestionResult {
  question: MultipleChoiceQuestion;
  userAnswer: string;
  isCorrect: boolean;
}

export function ExamResultsPage({
  questions,
  answers,
  navigateTo,
  user,
  onLogout
}: ExamResultsPageProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Calculate results
  const results: QuestionResult[] = questions.map(q => ({
    question: q,
    userAnswer: answers.get(q.id) || '',
    isCorrect: answers.get(q.id) === q.correctAnswer
  }));

  const correctCount = results.filter(r => r.isCorrect).length;
  const totalQuestions = questions.length;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  // Group results by performance
  const correctResults = results.filter(r => r.isCorrect);
  const incorrectResults = results.filter(r => !r.isCorrect);

  // Generate detailed suggestions based on performance
  const generateSuggestions = (): Array<{ title: string; description: string; priority: 'high' | 'medium' | 'low' }> => {
    const suggestions: Array<{ title: string; description: string; priority: 'high' | 'medium' | 'low' }> = [];

    if (scorePercentage >= 90) {
      suggestions.push({
        title: 'Outstanding Performance!',
        description: 'You\'ve mastered this material. Try harder difficulty levels to challenge yourself further.',
        priority: 'low'
      });
    } else if (scorePercentage >= 75) {
      suggestions.push({
        title: 'Good Understanding',
        description: 'You\'ve grasped most concepts. Focus on the questions you missed to strengthen weak areas.',
        priority: 'medium'
      });
    } else if (scorePercentage >= 50) {
      suggestions.push({
        title: 'Keep Practicing',
        description: 'You\'re on the right track. Review the material more thoroughly and take another practice exam.',
        priority: 'high'
      });
    } else {
      suggestions.push({
        title: 'Foundation Review Needed',
        description: 'It\'s important to review the core concepts thoroughly before retaking this exam.',
        priority: 'high'
      });
    }

    if (incorrectResults.length > 0) {
      const wrongDifficulties = incorrectResults.map(r => r.question.difficulty);
      const easyWrong = wrongDifficulties.filter(d => d === 'easy').length;
      const mediumWrong = wrongDifficulties.filter(d => d === 'medium').length;
      const hardWrong = wrongDifficulties.filter(d => d === 'hard').length;

      if (easyWrong > 0) {
        suggestions.push({
          title: `${easyWrong} Basic Question${easyWrong > 1 ? 's' : ''} Missed`,
          description: `Strengthen your foundation by reviewing the definitions and basic concepts you got wrong. Mastering basics makes harder questions easier.`,
          priority: 'high'
        });
      }
      if (hardWrong > 0) {
        suggestions.push({
          title: `Advanced Topic Analysis`,
          description: `You struggled with complex questions. Practice applying concepts to real-world scenarios and understand how different concepts interconnect.`,
          priority: 'medium'
        });
      }
      if (mediumWrong > 0) {
        suggestions.push({
          title: `Concept Integration`,
          description: `Review how ${mediumWrong} concept${mediumWrong > 1 ? 's' : ''} relate to each other. Many medium-level questions test understanding of relationships between ideas.`,
          priority: 'medium'
        });
      }
    }

    // Study timing suggestion
    const hoursUntilNextReview = 24;
    suggestions.push({
      title: 'Next Review Session',
      description: `Review this material again in ${hoursUntilNextReview} hours to reinforce learning. Spaced repetition helps with long-term retention.`,
      priority: 'low'
    });

    return suggestions.slice(0, 4);
  };

  const getScoreColor = (): string => {
    if (scorePercentage >= 85) return 'var(--color-quiz-green)';
    if (scorePercentage >= 70) return 'var(--color-quiz-blue)';
    if (scorePercentage >= 50) return 'rgb(251, 146, 60)';
    return 'rgb(239, 68, 68)';
  };

  const getPerformanceLabel = (): string => {
    if (scorePercentage >= 90) return 'Outstanding';
    if (scorePercentage >= 80) return 'Excellent';
    if (scorePercentage >= 70) return 'Good';
    if (scorePercentage >= 60) return 'Fair';
    if (scorePercentage >= 50) return 'Needs Improvement';
    return 'Poor';
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
        {/* Score Summary */}
        <Card className="mb-8 overflow-hidden">
          <div
            style={{
              background: `linear-gradient(135deg, ${getScoreColor()}20, ${getScoreColor()}10)`,
              borderLeft: `4px solid ${getScoreColor()}`
            }}
          >
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div
                  className="text-6xl font-bold mb-2"
                  style={{ color: getScoreColor() }}
                >
                  {scorePercentage}%
                </div>
                <div className="text-xl font-semibold text-foreground mb-1">
                  {getPerformanceLabel()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {correctCount} out of {totalQuestions} questions correct
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <div className="text-2xl font-bold text-quiz-green">
                    {correctCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Correct</div>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-500">
                    {totalQuestions - correctCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Incorrect</div>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <div className="text-2xl font-bold text-quiz-blue">
                    {totalQuestions}
                  </div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Suggestions */}
        {generateSuggestions().length > 0 && (
          <Card className="mb-8 border-blue-200 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5 text-quiz-blue" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {generateSuggestions().map((suggestion, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border-l-4 bg-white/50 dark:bg-black/20"
                  style={{
                    borderColor:
                      suggestion.priority === 'high'
                        ? 'rgb(239, 68, 68)'
                        : suggestion.priority === 'medium'
                        ? 'var(--color-quiz-blue)'
                        : 'var(--color-quiz-green)'
                  }}
                >
                  <p className="font-semibold text-sm mb-1 text-foreground">{suggestion.title}</p>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Difficulty Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Performance by Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(['easy', 'medium', 'hard'] as const).map(difficulty => {
                const diffQuestions = results.filter(r => r.question.difficulty === difficulty);
                const diffCorrect = diffQuestions.filter(r => r.isCorrect).length;
                const diffPercentage = diffQuestions.length > 0
                  ? Math.round((diffCorrect / diffQuestions.length) * 100)
                  : 0;

                return (
                  <div key={difficulty} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{difficulty}</span>
                      <span className="text-sm text-muted-foreground">
                        {diffCorrect}/{diffQuestions.length} ({diffPercentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${diffPercentage}%`,
                          backgroundColor:
                            difficulty === 'easy'
                              ? 'var(--color-quiz-green)'
                              : difficulty === 'medium'
                              ? 'var(--color-quiz-blue)'
                              : 'rgb(239, 68, 68)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Answer Review */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Answer Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, idx) => (
              <div
                key={result.question.id}
                className="border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedQuestion(
                      expandedQuestion === result.question.id ? null : result.question.id
                    )
                  }
                  className="w-full p-4 flex items-start justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    {result.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-quiz-green flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                    )}
                    <div className="text-left">
                      <div className="font-medium text-foreground text-sm">
                        Question {idx + 1}: {result.question.question.substring(0, 80)}
                        {result.question.question.length > 80 ? '...' : ''}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <span
                          className="inline-block px-2 py-1 rounded capitalize text-white mr-2"
                          style={{
                            backgroundColor:
                              result.question.difficulty === 'easy'
                                ? 'var(--color-quiz-green)'
                                : result.question.difficulty === 'medium'
                                ? 'var(--color-quiz-blue)'
                                : 'rgb(239, 68, 68)'
                          }}
                        >
                          {result.question.difficulty}
                        </span>
                        {result.isCorrect ? (
                          <span className="text-quiz-green font-semibold">✓ Correct</span>
                        ) : (
                          <span className="text-red-500 font-semibold">✗ Incorrect</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedQuestion === result.question.id && (
                  <div className="border-t border-border p-4 bg-muted/30 space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                        YOUR ANSWER
                      </div>
                      <div
                        className="p-3 rounded-lg"
                        style={{
                          backgroundColor: result.isCorrect
                            ? 'rgba(34, 197, 94, 0.1)'
                            : 'rgba(239, 68, 68, 0.1)',
                          borderLeft: `3px solid ${
                            result.isCorrect ? 'var(--color-quiz-green)' : 'rgb(239, 68, 68)'
                          }`
                        }}
                      >
                        <p className="text-sm text-foreground">{result.userAnswer}</p>
                      </div>
                    </div>

                    {!result.isCorrect && (
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-2">
                          CORRECT ANSWER
                        </div>
                        <div className="p-3 rounded-lg bg-quiz-green/10 border-l-3 border-quiz-green">
                          <p className="text-sm text-foreground">
                            {result.question.correctAnswer}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                        EXPLANATION
                      </div>
                      <p className="text-sm text-foreground bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                        {result.question.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => navigateTo('home')}
            className="bg-quiz-green hover:bg-quiz-green/90 text-white"
          >
            Back to Home
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Could implement retry with same questions or new exam
              navigateTo('home');
            }}
          >
            Take Another Exam
          </Button>
        </div>
      </div>
    </div>
  );
}
