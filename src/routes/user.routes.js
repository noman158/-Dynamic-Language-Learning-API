import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { updateProfile, getProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.use(authenticate);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;