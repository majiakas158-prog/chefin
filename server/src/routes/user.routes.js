import { Router } from 'express';
import { getMe,updateMe } from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateProfileSchema } from '../validators/user.validator.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const userRouter=Router();
userRouter.use(requireAuth);userRouter.get('/me',asyncHandler(getMe));userRouter.patch('/me',validate(updateProfileSchema),asyncHandler(updateMe));
