import Progress from '../models/progress.model.js';
import { ApiError } from '../utils/apiError.js';

export const getUserProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const progress = await Progress.findOne({ userId })
      .populate('completedChallenges.challengeId');

    if (!progress) {
      throw new ApiError(404, 'Progress not found');
    }

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    next(error);
  }
};