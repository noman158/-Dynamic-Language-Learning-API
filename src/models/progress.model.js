import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  language: {
    type: String,
    required: true
  },
  completedChallenges: [{
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    score: Number,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  skillLevels: {
    vocabulary: {
      type: Number,
      default: 0
    },
    grammar: {
      type: Number,
      default: 0
    },
    pronunciation: {
      type: Number,
      default: 0
    },
    conversation: {
      type: Number,
      default: 0
    }
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  averageAccuracy: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Progress', progressSchema);