import express from 'express';
import { getNextChallenge, submitChallenge } from '../controllers/challenge.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { handleSpeechToText } from '../controllers/speech.controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);
router.get('/next', getNextChallenge);
router.post('/submit', submitChallenge);
router.post('/speech', upload.single('audio'), handleSpeechToText);

export default router;