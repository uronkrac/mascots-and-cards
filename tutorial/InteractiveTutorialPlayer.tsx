import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingUp } from 'lucide-react';
import AlphaBotMessage from './interactive/AlphaBotMessage';
import StrategyCardExplainer from './interactive/StrategyCardExplainer';
import InteractiveSimulation from './interactive/InteractiveSimulation';
import { InteractiveTutorialContent } from '@/hooks/useInteractiveTutorial';
// import { useUpsertInteractiveProgress } from '@/hooks/useTutorialProgressV2Adapter';
import { useTutorialCompletionOneTime } from '@/hooks/useTutorialOneTimeXP';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Props {
  tutorialId: string;
  content: InteractiveTutorialContent;
}

export default function InteractiveTutorialPlayer({ tutorialId, content }: Props) {
  const [index, setIndex] = useState(0);
  const [showXPGain, setShowXPGain] = useState(false);
  const [lastXPGain, setLastXPGain] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set<string>());
  const [stepInteractionCompleted, setStepInteractionCompleted] = useState(false);

  // Validate content structure and provide fallback
  if (!content || !content.steps || !Array.isArray(content.steps) || content.steps.length === 0) {
    console.error('Invalid tutorial content structure:', content);
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Tutorial Content Error</h2>
        <p className="text-muted-foreground mb-4">
          The tutorial content could not be loaded properly. Please try again or contact support.
        </p>
        <button 
          onClick={() => window.history.back()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const steps = content.steps;
 // const progress = useUpsertInteractiveProgress(tutorialId);
 const progress = { mutate: () => {} }; // placeholder
  const tutorialXP = useTutorialCompletionOneTime();
  const { user } = useAuth();
  const navigate = useNavigate();

  const percent = useMemo(() => Math.round(((index) / Math.max(steps.length - 1, 1)) * 100), [index, steps.length]);

  useEffect(() => {
    // set current step on mount/index change
    progress.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, tutorialId]);

  const completeTutorial = async () => {
    try {
      if (user?.id) {
        const { data, error } = await supabase.rpc('award_tutorial_starter_pack', { _user_id: user.id });
        if (error) {
          console.warn('Starter pack award failed:', error);
        } else if (data) {
          toast.success('Starter crate awarded!');
        }
      }
      
      const result = await tutorialXP.mutateAsync({ 
        tutorialId: tutorialId || 'TUT-101', 
        reason: 'Completed ' + (content.title || 'Level 1 - Calls & Puts Basics Tutorial'),
        xpAmount: 100
      });
      
      if ('alreadyCompleted' in result && result.alreadyCompleted) {
        // User has already completed this tutorial
        toast.success("Already completed tutorial! Heading to dashboard...");
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        // First time completion
        progress.mutate();
        toast.success("You're now officially an Options Crate Rookie! 🏆 Ready to join your first league and earn real rewards? Redirecting...");
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (e) {
      console.warn(e);
      toast.error('Something went wrong. Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1000);
    }
  };

  const renderStep = () => {
    const step = steps[index] as any;
    switch (step.type) {
      case 'alpha_bot_message':
        return <AlphaBotMessage content={step.content} />;
      case 'strategy_card_tutorial':
        return (
          <StrategyCardExplainer
            strategy_name={step.strategy_name}
            content={step.content}
            visual={step.visual}
            win_example={step.win_example}
            lose_example={step.lose_example}
          />
        );
      case 'interactive_simulation':
        return (
          <InteractiveSimulation
            content={step.content}
            simulation_data={step.simulation_data}
            choices={step.choices}
            onCompleted={(score) => {
              setStepInteractionCompleted(true);
              progress.mutate();
            }}
          />
        );
      default:
        return <div />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="space-y-2 relative">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          {content.title}
          {showXPGain && (
            <div className="animate-fade-in flex items-center gap-1 text-sm bg-primary/10 px-2 py-1 rounded-full">
              <Sparkles className="w-3 h-3 text-primary" />
              Progress... Take 1st Risk Step!
            </div>
          )}
        </h1>
        <div className="relative">
          <Progress value={percent} className="transition-all duration-500 ease-out" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-30 animate-pulse"></div>
        </div>
        <div className="text-xs opacity-70 flex items-center justify-between">
          <span>Step {index + 1} of {steps.length}</span>
          <span className="flex items-center gap-1 text-primary">
            <TrendingUp className="w-3 h-3" />
            {percent}% Complete
          </span>
        </div>
      </div>

      {renderStep()}

      <div className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          onClick={() => {
            setIndex((i) => Math.max(0, i - 1));
            setStepInteractionCompleted(false);
          }} 
          disabled={index === 0}
        >
          Back
        </Button>
        {index < steps.length - 1 ? (
          <Button 
            onClick={() => {
              const step = steps[index] as any;
              if (!completedSteps.has(step.id)) {
                const xpGain = 10;
                progress.mutate();
                setCompletedSteps(prev => new Set([...prev, step.id]));
                setLastXPGain(xpGain);
                setShowXPGain(true);
                setTimeout(() => setShowXPGain(false), 2000);
              }
              setIndex((i) => Math.min(steps.length - 1, i + 1));
              setStepInteractionCompleted(false);
            }} 
            className="animate-scale-in"
            disabled={steps[index]?.type === 'interactive_simulation' && !stepInteractionCompleted}
          >
            Next
          </Button>
        ) : (
          <Button onClick={completeTutorial}>Finish Tutorial</Button>
        )}
      </div>
    </div>
  );
}
