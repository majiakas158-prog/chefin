import { Router } from 'express';
import { apply,getDashboard,getJobs,postJob } from '../controllers/job.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createJobSchema } from '../validators/job.validator.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const jobRouter=Router();
jobRouter.use(requireAuth);jobRouter.get('/',asyncHandler(getJobs));jobRouter.get('/dashboard',asyncHandler(getDashboard));jobRouter.post('/',validate(createJobSchema),asyncHandler(postJob));jobRouter.post('/:jobId/applications',asyncHandler(apply));
