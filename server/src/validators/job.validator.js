import { z } from 'zod';
export const createJobSchema=z.object({title:z.string().min(2).max(100),cuisine:z.string().max(60).optional(),location:z.string().min(2).max(100),salary:z.coerce.number().int().positive()});
