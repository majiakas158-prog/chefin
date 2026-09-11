import { env } from './env.js';
export const corsOptions={origin:env.FRONTEND_URL,credentials:true,methods:['GET','POST','PATCH','DELETE'],allowedHeaders:['Content-Type']};
