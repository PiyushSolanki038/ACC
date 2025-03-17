import express from 'express';
import { register, login, requestPasswordReset, resetPassword } from '../controllers/authController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/register', protect, authorize('owner'), register);
router.post('/login', login);
router.post('/reset-password-request', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router; 