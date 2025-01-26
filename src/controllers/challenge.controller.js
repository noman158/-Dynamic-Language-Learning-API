import Challenge from '../models/challenge.model.js';
import Progress from '../models/progress.model.js';
import { ApiError } from '../utils/apiError.js';
import { calculateDifficulty } from '../utils/difficultyCalculator.js';

export const getNextChallenge = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userProgress = await Progress.findOne({ userId });

    // Calculate appropriate difficulty level
    const difficulty = calculateDifficulty(userProgress);

    // Get a random challenge based on user's level
    const challenge = await Challenge.aggregate([
      { $match: { 
        difficulty,
        language: userProgress.language
      }},
      { $sample: { size: 1 }}
    ]);

    if (!challenge.length) {
      throw new ApiError(404, 'No challenges available');
    }

    res.json({
      success: true,
      challenge: challenge[0]
    });
  } catch (error) {
    next(error);
  }
};

export const submitChallenge = async (req, res, next) => {
  try {
    const { challengeId, answer } = req.body;
    const userId = req.user.id;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      throw new ApiError(404, 'Challenge not found');
    }

    // Calculate score based on answer correctness
    const isCorrect = challenge.content.correctAnswer === answer;
    const score = isCorrect ? challenge.points : 0;

    // Update user progress
    await Progress.findOneAndUpdate(
      { userId },
      {
        $push: {
          completedChallenges: {
            challengeId,
            score,
            completedAt: new Date()
          }
        },
        $inc: {
          totalPoints: score,
          [`skillLevels.${challenge.type}`]: isCorrect ? 1 : 0
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      isCorrect,
      score,
      explanation: challenge.content.explanation
    });
  } catch (error) {
    next(error);
  }
};