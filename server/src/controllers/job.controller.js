import * as jobService from '../services/job.service.js';
export const getJobs=async(req,res)=>res.json({data:await jobService.listJobs()});
export const postJob=async(req,res)=>res.status(201).json({data:await jobService.createJob(req.user.id,req.body)});
export const apply=async(req,res)=>res.status(201).json({data:await jobService.applyToJob(req.user.id,req.params.jobId)});
export const getDashboard=async(req,res)=>res.json({data:await jobService.dashboard(req.user.id)});
