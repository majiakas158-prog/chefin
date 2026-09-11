import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth.js';
export async function requireAuth(req,res,next){const session=await auth.api.getSession({headers:fromNodeHeaders(req.headers)});if(!session)return res.status(401).json({error:{code:'UNAUTHORIZED',message:'Authentication is required.'}});req.user=session.user;next()}
