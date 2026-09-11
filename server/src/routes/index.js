import { Router } from 'express';
import { jobRouter } from './job.routes.js';
import { userRouter } from './user.routes.js';
export const apiRouter=Router();
apiRouter.use('/users',userRouter);apiRouter.use('/jobs',jobRouter);
