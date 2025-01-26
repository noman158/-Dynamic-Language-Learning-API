export const calculateDifficulty = (userProgress) => {
  if (!userProgress) return 'beginner';

  const totalChallenges = userProgress.completedChallenges.length;
  const recentChallenges = userProgress.completedChallenges.slice(-10);
  
  if (totalChallenges < 10) return 'beginner';

  const recentSuccessRate = recentChallenges.reduce((acc, challenge) => {
    return acc + (challenge.score > 0 ? 1 : 0);
  }, 0) / recentChallenges.length;

  if (recentSuccessRate >= 0.8) return 'advanced';
  if (recentSuccessRate >= 0.6) return 'intermediate';
  return 'beginner';
};