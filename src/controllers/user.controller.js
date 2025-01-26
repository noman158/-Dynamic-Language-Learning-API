import User from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { username, targetLanguage, dailyGoal } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: {
          username,
          targetLanguage,
          dailyGoal
        }
      },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};