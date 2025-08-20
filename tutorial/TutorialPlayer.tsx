import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  BookOpen, 
  Target, 
  Clock,
  CheckCircle,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface TutorialStep {
  title: string;
  content: string;
  type?: 'text' | 'quiz' | 'interactive';
  options?: string[];
  correctAnswer?: number;
  hint?: string;
}

interface TutorialContent {
  steps: TutorialStep[];
  scenarios?: any[];
  practice_setup?: any;
}

interface TutorialPlayerProps {
  tutorial: {
    tutorial_id: string;
    title: string;
    description: string;
    tutorial_type: 'micro' | 'scenario' | 'practice';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimated_time_minutes: number;
    content: TutorialContent;
  };
  onComplete: (score: number, timeSpent: number, hintsUsed: number) => void;
  onClose: () => void;
}

export const TutorialPlayer: React.FC<TutorialPlayerProps> = ({
  tutorial,
  onComplete,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(Date.now());
  const [showHint, setShowHint] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Parse content if it's a string, otherwise use as is
  let content;
  try {
    content = typeof tutorial.content === 'string' ? JSON.parse(tutorial.content) : tutorial.content;
  } catch (error) {
    console.error('Error parsing tutorial content:', error);
    content = { steps: [] };
  }
  const steps = content?.steps || [];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowHint(false);
    } else {
      // Tutorial completed
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const finalScore = Math.max(70, score); // Minimum 70% for completion
      setIsCompleted(true);
      onComplete(finalScore, timeSpent, hintsUsed);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowHint(false);
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const step = steps[currentStep];
    if (step.type === 'quiz' && step.correctAnswer !== undefined) {
      const isCorrect = answerIndex === step.correctAnswer;
      if (isCorrect) {
        setScore(score + (100 / steps.length));
      }
      setQuizAnswers([...quizAnswers, answerIndex]);
    }
  };

  const handleShowHint = () => {
    setShowHint(true);
    setHintsUsed(hintsUsed + 1);
  };

  const getTutorialTypeIcon = (type: string) => {
    switch (type) {
      case 'micro':
        return <BookOpen className="h-5 w-5" />;
      case 'scenario':
        return <Target className="h-5 w-5" />;
      case 'practice':
        return <Play className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTutorialTypeIcon(tutorial.tutorial_type)}
              <div>
                <CardTitle className="text-xl">{tutorial.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{tutorial.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(tutorial.difficulty)}>
                {tutorial.difficulty}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {tutorial.estimated_time_minutes} min
              </Badge>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress: {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {isCompleted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Tutorial Completed!</h2>
              <p className="text-muted-foreground mb-4">
                Great job! You've successfully completed this tutorial.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{Math.round(score)}%</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{Math.floor((Date.now() - startTime) / 1000)}s</div>
                  <div className="text-sm text-muted-foreground">Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{hintsUsed}</div>
                  <div className="text-sm text-muted-foreground">Hints Used</div>
                </div>
              </div>
              <Button onClick={onClose} className="w-full">
                Continue
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Step Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{currentStepData?.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Step {currentStep + 1} of {steps.length}
                  </p>
                </div>
                {currentStepData?.hint && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShowHint}
                    className="flex items-center gap-2"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Hint
                  </Button>
                )}
              </div>

              <Separator />

              {/* Step Content */}
              <div className="prose max-w-none">
                {currentStepData?.type === 'quiz' ? (
                  <div className="space-y-4">
                    <p className="text-lg">{currentStepData.content}</p>
                    <div className="space-y-2">
                      {currentStepData.options?.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start text-left h-auto p-4"
                          onClick={() => handleQuizAnswer(index)}
                          disabled={quizAnswers.includes(index)}
                        >
                          <span className="font-mono mr-3">{String.fromCharCode(65 + index)}.</span>
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-lg leading-relaxed">{currentStepData?.content}</p>
                    
                    {currentStepData?.type === 'interactive' && (
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          This is an interactive step. Follow the instructions above to practice the concept.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Hint Display */}
                {showHint && currentStepData?.hint && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Hint:</strong> {currentStepData.hint}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}
        </CardContent>

        {!isCompleted && (
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Score: {Math.round(score)}%</span>
                <span>Hints: {hintsUsed}</span>
              </div>

              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Complete Tutorial
                    <CheckCircle className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}; 