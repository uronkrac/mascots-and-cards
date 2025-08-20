import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

// Hook to get available tutorials for a user
export const useAvailableTutorials = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['available-tutorials', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .rpc('get_available_tutorials', { user_uuid: user.id });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

// Hook to get user's tutorial progress
export const useUserTutorialProgress = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-tutorial-progress', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_tutorial_progress')
        .select(`
          *,
          tutorials (
            tutorial_id,
            title,
            tutorial_type,
            difficulty,
            strategy_id
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

// Hook to complete a tutorial
export const useCompleteTutorial = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tutorialId,
      score,
      timeSpentSeconds,
      hintsUsed
    }: {
      tutorialId: string;
      score: number;
      timeSpentSeconds: number;
      hintsUsed: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .rpc('complete_tutorial', {
          user_uuid: user.id,
          tutorial_uuid: tutorialId,
          tutorial_score: score,
          time_spent_seconds: timeSpentSeconds,
          hints_used: hintsUsed
        });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data && typeof data === 'object' && 'tutorial_completed' in data) {
        if ((data as any).tutorial_completed) {
          toast.success((data as any).message);
        } else {
          toast.info((data as any).message);
        }
      }
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['available-tutorials', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user-tutorial-progress', user?.id] });
    },
    onError: (error) => {
      console.error('Tutorial completion error:', error);
      toast.error('Failed to complete tutorial');
    },
  });
};

// Hook to get practice leagues for a user
export const usePracticeLeagues = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['practice-leagues', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .rpc('get_practice_leagues_for_user', { user_uuid: user.id });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

// Hook to get tutorials by strategy
export const useTutorialsByStrategy = (strategyId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tutorials-by-strategy', strategyId, user?.id],
    queryFn: async () => {
      if (!strategyId) throw new Error('Strategy ID required');

      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('strategy_id', strategyId)
        .eq('is_active', true)
        .order('difficulty', { ascending: true })
        .order('tutorial_type', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!strategyId && !!user,
  });
};

// Hook to get tutorial statistics
export const useTutorialStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tutorial-stats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_tutorial_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Calculate statistics
      const totalTutorials = data.length;
      const completedTutorials = data.filter(t => t.completed_at).length;
      const totalAttempts = data.reduce((sum, t) => sum + t.attempts, 0);
      const averageScore = data.length > 0 
        ? data.reduce((sum, t) => sum + (t.best_score || 0), 0) / data.length 
        : 0;
      const totalTimeSpent = data.reduce((sum, t) => sum + t.time_spent_seconds, 0);

      return {
        totalTutorials,
        completedTutorials,
        completionRate: totalTutorials > 0 ? (completedTutorials / totalTutorials) * 100 : 0,
        totalAttempts,
        averageScore: Math.round(averageScore),
        totalTimeSpentMinutes: Math.round(totalTimeSpent / 60)
      };
    },
    enabled: !!user,
  });
};

// Utility functions
export const getTutorialTypeDisplayName = (type: string) => {
  switch (type) {
    case 'micro':
      return 'Micro Tutorial';
    case 'scenario':
      return 'Scenario Practice';
    case 'practice':
      return 'Advanced Practice';
    default:
      return type;
  }
};

export const getDifficultyColor = (difficulty: string) => {
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

export const getTutorialTypeIcon = (type: string) => {
  switch (type) {
    case 'micro':
      return '📚';
    case 'scenario':
      return '🎯';
    case 'practice':
      return '⚡';
    default:
      return '📖';
  }
}; 