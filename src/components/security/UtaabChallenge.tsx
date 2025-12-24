import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export type ChallengeType = 'slider' | 'math' | 'pattern' | 'text';

interface UtaabChallengeProps {
  type: ChallengeType;
  onComplete: (success: boolean) => void;
  onRefresh?: () => void;
  difficulty?: 'low' | 'medium' | 'high';
}

// Slider Challenge Component
function SliderChallenge({ onComplete }: { onComplete: (success: boolean) => void }) {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const targetPosition = 85; // Target percentage

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => {
    setIsDragging(false);
    if (position >= targetPosition - 5 && position <= targetPosition + 5) {
      setIsComplete(true);
      onComplete(true);
    } else if (position > 20) {
      setPosition(0); // Reset if not at target
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percentage);
  }, [isDragging]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percentage);
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleTouchMove]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        Slide to the target position
      </p>
      
      <div 
        ref={sliderRef}
        className="relative h-12 bg-muted rounded-lg overflow-hidden cursor-pointer"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Target zone */}
        <div 
          className="absolute top-0 h-full w-10 bg-primary/30 border-x-2 border-primary"
          style={{ left: `${targetPosition - 5}%` }}
        />
        
        {/* Slider handle */}
        <motion.div
          className={`absolute top-1 bottom-1 w-10 rounded-md flex items-center justify-center cursor-grab active:cursor-grabbing ${
            isComplete ? 'bg-green-500' : 'bg-primary'
          }`}
          style={{ left: `calc(${position}% - 20px)` }}
          animate={{ scale: isDragging ? 1.1 : 1 }}
        >
          {isComplete ? (
            <CheckCircle className="w-5 h-5 text-white" />
          ) : (
            <ArrowRight className="w-5 h-5 text-primary-foreground" />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Math Challenge Component
function MathChallenge({ 
  onComplete, 
  difficulty = 'medium' 
}: { 
  onComplete: (success: boolean) => void;
  difficulty?: 'low' | 'medium' | 'high';
}) {
  const [numbers, setNumbers] = useState<[number, number]>([0, 0]);
  const [operator, setOperator] = useState<'+' | '-' | '×'>('+');
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    generateProblem();
  }, [difficulty]);

  const generateProblem = () => {
    let a: number, b: number, op: '+' | '-' | '×';
    
    switch (difficulty) {
      case 'low':
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        op = '+';
        break;
      case 'high':
        a = Math.floor(Math.random() * 20) + 5;
        b = Math.floor(Math.random() * 10) + 2;
        op = ['×', '-', '+'][Math.floor(Math.random() * 3)] as '+' | '-' | '×';
        break;
      default:
        a = Math.floor(Math.random() * 15) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        op = ['+', '-'][Math.floor(Math.random() * 2)] as '+' | '-';
    }

    // Ensure positive result for subtraction
    if (op === '-' && b > a) {
      [a, b] = [b, a];
    }

    setNumbers([a, b]);
    setOperator(op);
    setAnswer('');
    setIsCorrect(null);
  };

  const calculateAnswer = (): number => {
    switch (operator) {
      case '+': return numbers[0] + numbers[1];
      case '-': return numbers[0] - numbers[1];
      case '×': return numbers[0] * numbers[1];
    }
  };

  const handleSubmit = () => {
    const correct = parseInt(answer) === calculateAnswer();
    setIsCorrect(correct);
    
    if (correct) {
      setTimeout(() => onComplete(true), 500);
    } else {
      setTimeout(generateProblem, 1000);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        Solve the math problem
      </p>
      
      <div className="flex items-center justify-center gap-3 text-2xl font-bold">
        <span className="text-foreground">{numbers[0]}</span>
        <span className="text-primary">{operator}</span>
        <span className="text-foreground">{numbers[1]}</span>
        <span className="text-muted-foreground">=</span>
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className={`w-20 h-12 text-center rounded-lg border-2 bg-background ${
            isCorrect === true ? 'border-green-500' :
            isCorrect === false ? 'border-red-500' :
            'border-input'
          }`}
          autoFocus
        />
      </div>

      <div className="flex justify-center gap-2">
        <Button onClick={generateProblem} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-1" />
          New Problem
        </Button>
        <Button onClick={handleSubmit} size="sm" disabled={!answer}>
          Check
        </Button>
      </div>

      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center justify-center gap-2 text-sm ${
              isCorrect ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isCorrect ? (
              <><CheckCircle className="w-4 h-4" /> Correct!</>
            ) : (
              <><XCircle className="w-4 h-4" /> Try again</>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Pattern Challenge Component
function PatternChallenge({ 
  onComplete, 
  difficulty = 'medium' 
}: { 
  onComplete: (success: boolean) => void;
  difficulty?: 'low' | 'medium' | 'high';
}) {
  const icons = ['🔵', '🔴', '🟢', '🟡', '🟣', '🟠', '⬛', '⬜'];
  const [targetIcon, setTargetIcon] = useState('');
  const [grid, setGrid] = useState<string[]>([]);
  const [targetIndices, setTargetIndices] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const gridSize = difficulty === 'low' ? 9 : difficulty === 'high' ? 16 : 12;
  const targetCount = difficulty === 'low' ? 2 : difficulty === 'high' ? 4 : 3;

  useEffect(() => {
    generatePattern();
  }, [difficulty]);

  const generatePattern = () => {
    const target = icons[Math.floor(Math.random() * icons.length)];
    setTargetIcon(target);

    // Create grid with random icons
    const newGrid: string[] = [];
    const indices: number[] = [];
    
    // Place target icons at random positions
    while (indices.length < targetCount) {
      const idx = Math.floor(Math.random() * gridSize);
      if (!indices.includes(idx)) {
        indices.push(idx);
      }
    }

    for (let i = 0; i < gridSize; i++) {
      if (indices.includes(i)) {
        newGrid.push(target);
      } else {
        let randomIcon = target;
        while (randomIcon === target) {
          randomIcon = icons[Math.floor(Math.random() * icons.length)];
        }
        newGrid.push(randomIcon);
      }
    }

    setGrid(newGrid);
    setTargetIndices(indices);
    setSelected([]);
    setIsComplete(false);
  };

  const handleClick = (index: number) => {
    if (isComplete) return;

    const newSelected = selected.includes(index)
      ? selected.filter(i => i !== index)
      : [...selected, index];
    
    setSelected(newSelected);

    // Check if all targets are selected
    if (newSelected.length === targetCount) {
      const allCorrect = newSelected.every(i => targetIndices.includes(i));
      if (allCorrect) {
        setIsComplete(true);
        setTimeout(() => onComplete(true), 500);
      } else {
        setTimeout(generatePattern, 1000);
      }
    }
  };

  const cols = gridSize === 9 ? 3 : gridSize === 16 ? 4 : 4;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        Find all {targetIcon} icons ({targetCount} total)
      </p>
      
      <div 
        className="grid gap-2 mx-auto"
        style={{ 
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          maxWidth: `${cols * 52}px`
        }}
      >
        {grid.map((icon, index) => (
          <motion.button
            key={index}
            onClick={() => handleClick(index)}
            className={`w-12 h-12 text-2xl rounded-lg border-2 transition-colors ${
              selected.includes(index)
                ? isComplete && targetIndices.includes(index)
                  ? 'border-green-500 bg-green-500/20'
                  : 'border-primary bg-primary/20'
                : 'border-input bg-background hover:bg-muted'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {icon}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-center">
        <Button onClick={generatePattern} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-1" />
          New Pattern
        </Button>
      </div>
    </div>
  );
}

// Main Challenge Component
export function UtaabChallenge({ 
  type, 
  onComplete, 
  onRefresh,
  difficulty = 'medium' 
}: UtaabChallengeProps) {
  const { t } = useTranslation();

  const renderChallenge = () => {
    switch (type) {
      case 'slider':
        return <SliderChallenge onComplete={onComplete} />;
      case 'math':
        return <MathChallenge onComplete={onComplete} difficulty={difficulty} />;
      case 'pattern':
        return <PatternChallenge onComplete={onComplete} difficulty={difficulty} />;
      case 'text':
        // Text challenge is similar to math but with text recognition
        return <MathChallenge onComplete={onComplete} difficulty={difficulty} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 border rounded-lg bg-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">
          {t('utaab.verifyHuman', 'Verify you are human')}
        </h3>
        {onRefresh && (
          <Button onClick={onRefresh} variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {renderChallenge()}
    </motion.div>
  );
}
