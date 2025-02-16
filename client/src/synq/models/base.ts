import { z } from 'zod';

export const id = z.number();
export type ID = z.infer<typeof id>;

export const baseSchema = z.object({
  id,
});
export type BaseSchema = z.infer<typeof baseSchema>;
