import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DifficultyLevel } from '../../utils/quizGenerator';

interface ExamSettingsDialogProps {
  maxQuestions: number;
  onStart: (numQuestions: number, difficulty: DifficultyLevel) => void;
  onCancel: () => void;
}

export function ExamSettingsDialog({ maxQuestions, onStart, onCancel }: ExamSettingsDialogProps) {
  const [numQuestions, setNumQuestions] = useState(Math.min(5, maxQuestions));
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');

  const handleStart = () => {
    onStart(numQuestions, difficulty);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Start Exam</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Questions
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max={maxQuestions}
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-lg font-semibold text-quiz-blue w-12 text-right">
                {numQuestions}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available: {maxQuestions} questions
            </p>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Difficulty Level
            </label>
            <div className="space-y-2">
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map(level => (
                <label
                  key={level}
                  className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  style={{
                    backgroundColor: difficulty === level ? 'var(--color-quiz-blue)' : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={level}
                    checked={difficulty === level}
                    onChange={() => setDifficulty(level)}
                    className="mr-3"
                  />
                  <span
                    style={{
                      color: difficulty === level ? 'white' : 'var(--color-foreground)',
                      textTransform: 'capitalize',
                      fontWeight: difficulty === level ? '600' : '400'
                    }}
                  >
                    {level}
                  </span>
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: '0.875rem',
                      color: difficulty === level ? 'rgba(255,255,255,0.7)' : 'var(--color-muted-foreground)'
                    }}
                  >
                    {level === 'easy' && 'Definitions & basics'}
                    {level === 'medium' && 'Concept understanding'}
                    {level === 'hard' && 'Analysis & application'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleStart}
              className="flex-1 bg-quiz-green hover:bg-quiz-green/90 text-white"
            >
              Start Exam
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
