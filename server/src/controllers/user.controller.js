import * as profileService from '../services/profile.service.js';
export const getMe=async(req,res)=>res.json({data:await profileService.getProfile(req.user.id)});
export const updateMe=async(req,res)=>res.json({data:await profileService.updateProfile(req.user.id,req.body)});
