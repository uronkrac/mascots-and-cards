import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock, Star, Coins, Target, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import MascotBubble from './MascotBubble';

interface LeagueTutorialProps {
  leagueType: 'beginner' | 'intermediate' | 'advanced';
  onComplete: () => void;
  onSkip: () => void;
}

interface TutorialStep {
  id: string;
  title: string;
  content: React.ReactNode;
  mascotPose: 'teach' | 'thinking' | 'wizard' | 'celebrate';
  mascotMessage: string;
}

export const LeagueTutorial: React.FC<LeagueTutorialProps> = ({ 
  leagueType, 
  onComplete, 
  onSkip 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    checkIfFirstTime();
  }, [leagueType]);

  const checkIfFirstTime = async () => {
    if (!user?.id) return;

    const { data: participation } = await supabase
      .from('league_participants')
      .select('league_id')
      .eq('user_id', user.id);

    const hasParticipated = participation && participation.length > 0;
    setIsFirstTime(!hasParticipated);
  };

  const getBeginnerTutorialSteps = (): TutorialStep[] => [
    {
      id: 'welcome',
      title: 'Welcome to Your First League!',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-600">
            <Star className="h-5 w-5" />
            <span className="font-semibold">Beginner League - Free to Play</span>
          </div>
          <p className="text-muted-foreground">
            This is your first step into competitive options trading! In beginner leagues, 
            you'll use basic strategy cards with automatic configuration.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">What You'll Learn:</h4>
            <ul className="text-green-700 space-y-1 text-sm">
              <li>• How to select and allocate strategy cards</li>
              <li>• Understanding P&L and performance tracking</li>
              <li>• Competing on leaderboards</li>
              <li>• Earning XP and rewards</li>
            </ul>
          </div>
        </div>
      ),
      mascotPose: 'teach',
      mascotMessage: "Hi there! I'm Oxi, your trading coach. Let me show you how beginner leagues work!"
    },
    {
      id: 'strategy-cards',
      title: 'Strategy Cards Explained',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-2">Basic Strategy Cards</h4>
              <p className="text-blue-700 text-sm">
                These are pre-built options strategies like Iron Condor, Long Call, etc. 
                Each card represents a real trading strategy.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-green-800 mb-2">Automatic Configuration</h4>
              <p className="text-green-700 text-sm">
                In beginner leagues, deltas and parameters are automatically set for you. 
                No complex configuration needed!
              </p>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Your Budget: $10,000</h4>
            <p className="text-yellow-700 text-sm">
              You'll allocate this virtual capital across 1-3 strategy cards. 
              Choose wisely - your allocation affects your performance!
            </p>
          </div>
        </div>
      ),
      mascotPose: 'thinking',
      mascotMessage: "Strategy cards are like building blocks for your portfolio. Think of them as different tools in your trading toolbox!"
    },
    {
      id: 'allocation',
      title: 'Portfolio Allocation',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1-3</div>
              <div className="text-sm text-muted-foreground">Strategy Cards</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">$10,000</div>
              <div className="text-sm text-muted-foreground">Total Budget</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-muted-foreground">Must Be Allocated</div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Allocation Tips:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Diversify across different strategies</li>
              <li>• Consider risk levels of each card</li>
              <li>• You can adjust allocations before submission</li>
              <li>• Total must equal exactly $10,000</li>
            </ul>
          </div>
        </div>
      ),
      mascotPose: 'teach',
      mascotMessage: "Allocation is key! Think of it like diversifying your investments. Don't put all your eggs in one basket!"
    },
    {
      id: 'performance',
      title: 'Performance & Rewards',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Daily P&L Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Your portfolio performance is calculated daily using simulated market data. 
                Watch your P&L change in real-time!
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Leaderboard Competition</h4>
              <p className="text-sm text-muted-foreground">
                Compete against other traders. Climb the rankings and earn bragging rights!
              </p>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Rewards You Can Earn:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-green-700">XP Points</div>
                <div className="text-green-600">For participation and performance</div>
              </div>
              <div>
                <div className="font-medium text-green-700">Coins</div>
                <div className="text-green-600">For packs and fusion</div>
              </div>
              <div>
                <div className="font-medium text-green-700">Badges</div>
                <div className="text-green-600">For achievements</div>
              </div>
              <div>
                <div className="font-medium text-green-700">Level Up</div>
                <div className="text-green-600">Unlock new features</div>
              </div>
            </div>
          </div>
        </div>
      ),
      mascotPose: 'celebrate',
      mascotMessage: "The best part? You can earn rewards just by participating! Every league is a chance to grow and improve."
    }
  ];

  const getSecretTutorialSteps = (): TutorialStep[] => [
    {
      id: 'welcome-secret',
      title: 'Welcome to Secret Leagues!',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-purple-600">
            <Lock className="h-5 w-5" />
            <span className="font-semibold">Secret League - Advanced Competition</span>
          </div>
          <p className="text-muted-foreground">
            You've unlocked Secret Leagues! These are advanced competitions that require 
            Level 5+ and use only fused strategy cards.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">Secret League Features:</h4>
            <ul className="text-purple-700 space-y-1 text-sm">
              <li>• Entry fee required (100-300 coins)</li>
              <li>• Fused strategy cards only</li>
              <li>• Larger prize pools</li>
              <li>• Advanced competition</li>
            </ul>
          </div>
        </div>
      ),
      mascotPose: 'wizard',
      mascotMessage: "Congratulations! You've reached Level 5 and unlocked Secret Leagues. This is where the real competition begins!"
    },
    {
      id: 'fusion-explained',
      title: 'Fusion System Explained',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-2">What is Fusion?</h4>
              <p className="text-blue-700 text-sm">
                Fusion lets you combine basic strategy cards with modifiers to create 
                custom, powerful trading strategies.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-green-800 mb-2">Fusion Components</h4>
              <p className="text-green-700 text-sm">
                Base Strategy + Equity + Delta Range + Optional Modifiers = 
                Custom Fused Strategy
              </p>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Fusion Cost: 50 Coins</h4>
            <p className="text-yellow-700 text-sm">
              Each fusion costs 50 coins. Choose your components wisely - 
              you can't undo a fusion!
            </p>
          </div>
        </div>
      ),
      mascotPose: 'teach',
      mascotMessage: "Fusion is like creating your own custom trading strategy. You combine different elements to build something unique!"
    },
    {
      id: 'entry-fees',
      title: 'Entry Fees & Prize Pools',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 bg-red-50">
              <h4 className="font-semibold text-red-800 mb-2">Entry Fee</h4>
              <p className="text-red-700 text-sm">
                Secret leagues require an entry fee (100-300 coins). 
                This goes into the prize pool for winners.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-green-800 mb-2">Prize Pool</h4>
              <p className="text-green-700 text-sm">
                Larger prize pools with coins, gems, and XP rewards. 
                Top 3 players win prizes!
              </p>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">Prize Distribution:</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">🥇</div>
                <div className="font-medium">1st Place</div>
                <div className="text-purple-600">50% of pool</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">🥈</div>
                <div className="font-medium">2nd Place</div>
                <div className="text-purple-600">30% of pool</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">🥉</div>
                <div className="font-medium">3rd Place</div>
                <div className="text-purple-600">20% of pool</div>
              </div>
            </div>
          </div>
        </div>
      ),
      mascotPose: 'thinking',
      mascotMessage: "Entry fees create bigger prize pools, making the competition more exciting! The better you perform, the more you can win."
    }
  ];

  const getPrestigeTutorialSteps = (): TutorialStep[] => [
    {
      id: 'welcome-prestige',
      title: 'Welcome to Prestige Leagues!',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-yellow-600">
            <Trophy className="h-5 w-5" />
            <span className="font-semibold">Prestige League - Elite Competition</span>
          </div>
          <p className="text-muted-foreground">
            You've reached the pinnacle! Prestige Leagues are for Level 10+ elite traders 
            with advanced features and exclusive rewards.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Prestige Features:</h4>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• Higher entry fees (500+ coins)</li>
              <li>• Advanced analytics and tools</li>
              <li>• Exclusive rewards and badges</li>
              <li>• Elite competition</li>
            </ul>
          </div>
        </div>
      ),
      mascotPose: 'wizard',
      mascotMessage: "You've reached the elite level! Prestige Leagues are where the best of the best compete for glory and exclusive rewards."
    }
  ];

  const getIntermediateTutorialSteps = (): TutorialStep[] => [
    {
      id: 'welcome-intermediate',
      title: 'Welcome to Intermediate Leagues!',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-600">
            <Target className="h-5 w-5" />
            <span className="font-semibold">Intermediate League - Level 5+</span>
          </div>
          <p className="text-muted-foreground">
            You've unlocked Intermediate Leagues! These are for Level 5+ players who want 
            more advanced strategies and competition.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Intermediate Features:</h4>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Access to intermediate strategy cards</li>
              <li>• More complex trading strategies</li>
              <li>• Enhanced competition</li>
              <li>• Better rewards and XP</li>
            </ul>
          </div>
        </div>
      ),
      mascotPose: 'teach',
      mascotMessage: "Great job reaching Level 5! Intermediate leagues give you access to more advanced strategies and better competition."
    },
    {
      id: 'strategy-cards-intermediate',
      title: 'Intermediate Strategy Cards',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-2">Intermediate Strategies</h4>
              <p className="text-blue-700 text-sm">
                You now have access to more complex strategies like Iron Condors, 
                Calendar Spreads, and other advanced options strategies.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-green-800 mb-2">Enhanced Competition</h4>
              <p className="text-green-700 text-sm">
                Compete against other Level 5+ players who understand 
                more sophisticated trading concepts.
              </p>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Your Advantage:</h4>
            <p className="text-yellow-700 text-sm">
              You can use both basic and intermediate strategy cards, giving you 
              more options for building your portfolio.
            </p>
          </div>
        </div>
      ),
      mascotPose: 'thinking',
      mascotMessage: "Intermediate strategies give you more tools to work with. Think of it as upgrading from basic tools to professional equipment!"
    },
    {
      id: 'rewards-intermediate',
      title: 'Enhanced Rewards',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-green-800 mb-2">Better XP Rewards</h4>
              <p className="text-green-700 text-sm">
                Intermediate leagues award more XP for participation and performance, 
                helping you level up faster.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-purple-50">
              <h4 className="font-semibold text-purple-800 mb-2">Enhanced Prizes</h4>
              <p className="text-purple-700 text-sm">
                Win more coins and gems for top performance. 
                The competition is tougher, but so are the rewards!
              </p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Progression Path:</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">⭐</div>
                <div className="font-medium">Level 5+</div>
                <div className="text-blue-600">Intermediate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">🎯</div>
                <div className="font-medium">Level 10+</div>
                <div className="text-blue-600">Advanced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">🏆</div>
                <div className="font-medium">Elite</div>
                <div className="text-blue-600">Expert</div>
              </div>
            </div>
          </div>
        </div>
      ),
      mascotPose: 'celebrate',
      mascotMessage: "Intermediate leagues are your stepping stone to becoming an elite trader. Keep learning and competing!"
    }
  ];

  const getTutorialSteps = (): TutorialStep[] => {
    switch (leagueType) {
      case 'beginner':
        return getBeginnerTutorialSteps();
      case 'intermediate':
        return getIntermediateTutorialSteps();
      case 'advanced':
        return getPrestigeTutorialSteps(); // Use existing prestige tutorial for advanced
      default:
        return getBeginnerTutorialSteps();
    }
  };

  const steps = getTutorialSteps();
  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {currentStep + 1}
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentStepData.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSkip}>
              Skip Tutorial
            </Button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  {currentStepData.content}
                </CardContent>
              </Card>
            </div>

            {/* Mascot */}
            <div className="flex flex-col items-center justify-center">
              <MascotBubble 
                text={currentStepData.mascotMessage}
                pose={currentStepData.mascotPose}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSkip}>
                Skip Tutorial
              </Button>
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? 'Complete Tutorial' : 'Next'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 