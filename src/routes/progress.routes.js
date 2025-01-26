import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getUserProgress } from '../controllers/progress.controller.js';

const router = express.Router();

router.use(authenticate);
router.get('/', getUserProgress);

export default router;