import { z } from 'zod';
import { baseSchema } from './base';

export const userSchema = baseSchema.extend({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  deleted: z.boolean(),
});
export type User = z.infer<typeof userSchema>;
