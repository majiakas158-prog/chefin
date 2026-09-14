import express from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { apiRateLimiter } from './middlewares/rateLimiter.middleware.js';
import { authRouter } from './routes/auth.routes.js';
import { apiRouter } from './routes/index.js';
import { env } from './config/env.js';
export const app=express();
app.use(cors(corsOptions));
app.use('/api/auth',authRouter);
app.use(express.json({limit:'100kb'}));
// Better Auth falls back to the API root when an old verification link has no
// callback URL. Send the user to the client instead of returning "Cannot GET /".
app.get('/',(req,res)=>res.redirect(new URL('/signin',env.FRONTEND_URL).toString()));
app.get('/health',(req,res)=>res.json({status:'ok'}));
app.use('/api',apiRateLimiter,apiRouter);
app.use(errorHandler);
