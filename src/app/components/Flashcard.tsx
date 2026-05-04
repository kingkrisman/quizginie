import React, { useState } from 'react';
import { Card } from './ui/card';

interface FlashcardProps {
  question: string;
  answer: string;
  className?: string;
}

export function Flashcard({ question, answer, className = '' }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={`relative h-64 w-full cursor-pointer ${className}`}>
      <div 
        className="relative w-full h-full transition-transform duration-500 preserve-3d"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Side - Question */}
        <Card className="absolute inset-0 w-full h-full backface-hidden bg-quiz-green-light border-quiz-green/20">
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              <p className="text-lg text-quiz-green mb-4">Question:</p>
              <p className="text-foreground">{question}</p>
              <p className="text-sm text-muted-foreground mt-4">Click to reveal answer</p>
            </div>
          </div>
        </Card>

        {/* Back Side - Answer */}
        <Card 
          className="absolute inset-0 w-full h-full backface-hidden bg-quiz-blue-light border-quiz-blue/20"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              <p className="text-lg text-quiz-blue mb-4">Answer:</p>
              <p className="text-foreground">{answer}</p>
              <p className="text-sm text-muted-foreground mt-4">Click to see question</p>
            </div>
          </div>
        </Card>
      </div>

      <style jsx>{`
        .backface-hidden {
          backface-visibility: hidden;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}