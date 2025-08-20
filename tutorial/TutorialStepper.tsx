
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Step0Welcome from "./steps/Step0Welcome";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import { useTutorialCompletionOneTime } from "@/hooks/useTutorialOneTimeXP";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

const steps = [
  <Step0Welcome />,
  <Step1 />,
  <Step2 />,
  <Step3 />,
  <Step4 />,
  <Step5 />,
  <Step6 />,
];

export default function TutorialStepper() {
  const [step, setStep] = useState(0);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const tutorialXP = useTutorialCompletionOneTime();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-4 lg:p-6 min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {steps[step]}
        </div>
      </div>
      <div className="flex justify-between mt-4 max-w-4xl mx-auto w-full">
        <div className="flex gap-2">
          <button
            className="px-6 py-3 bg-gray-300 rounded-lg text-lg font-medium disabled:opacity-50 hover:bg-gray-400 transition-colors"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Back
          </button>
          <button
            className="px-6 py-3 bg-orange-500 text-white rounded-lg text-lg font-medium hover:bg-orange-600 transition-colors"
            onClick={async () => {
              if (!tutorialCompleted) {
                setTutorialCompleted(true);
                try {
                  // Award starter pack
                  if (user?.id) {
                    const { data, error } = await supabase.rpc('award_tutorial_starter_pack', {
                      _user_id: user.id
                    });
                    
                    if (error) {
                      console.warn('Failed to award starter pack:', error);
                    } else if (data) {
                      toast.success('Welcome! You received your starter crate with strategy cards and equity cards!');
                    }
                  }
                  
                  // Award tutorial XP
                  await tutorialXP.mutateAsync({ 
                    tutorialId: 'TUT-101', 
                    reason: 'Completed Level 1 - Calls & Puts Basics Tutorial',
                    xpAmount: 100
                  });
                  
                  toast.info('Tutorial skipped! You still received your starter rewards.');
                  
                  // Redirect to dashboard after a brief delay
                  setTimeout(() => {
                    navigate('/dashboard');
                  }, 2000);
                } catch (error) {
                  console.warn('Failed to complete tutorial rewards:', error);
                }
              }
            }}
          >
            Skip Tutorial
          </button>
        </div>
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors"
          onClick={async () => {
            const nextStep = Math.min(steps.length - 1, step + 1);
            setStep(nextStep);
            
            // Award starter pack and XP when tutorial is completed
            if (nextStep === steps.length - 1 && !tutorialCompleted) {
              setTutorialCompleted(true);
              try {
                // Award starter pack
                if (user?.id) {
                  const { data, error } = await supabase.rpc('award_tutorial_starter_pack', {
                    _user_id: user.id
                  });
                  
                  if (error) {
                    console.warn('Failed to award starter pack:', error);
                  } else if (data) {
                    toast.success('Welcome! You received your starter crate with strategy cards and equity cards!');
                  }
                }
                
                // Award tutorial XP
                await tutorialXP.mutateAsync({ 
                  tutorialId: 'TUT-101', 
                  reason: 'Completed Level 1 - Calls & Puts Basics Tutorial',
                  xpAmount: 100
                });
                
                // Redirect to dashboard after a brief delay
                setTimeout(() => {
                  navigate('/dashboard');
                }, 2000);
              } catch (error) {
                console.warn('Failed to complete tutorial rewards:', error);
              }
            }
          }}
          disabled={step === steps.length - 1}
        >
                     {step === steps.length - 2 ? 'Finish Tutorial' : 'Next'}
        </button>
      </div>
    </div>
  );
}
