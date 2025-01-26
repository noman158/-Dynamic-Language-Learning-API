import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['vocabulary', 'grammar', 'pronunciation', 'conversation']
  },
  language: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  content: {
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String
  },
  points: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Challenge', challengeSchema);