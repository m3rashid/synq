import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(3).max(65535).optional(),
});
export type CreateTodo = z.infer<typeof createTodoSchema>;

export const updateTodoSchema = createTodoSchema.partial().extend({ id: z.number() });
export type UpdateTodo = z.infer<typeof updateTodoSchema>;

export interface Todo extends CreateTodo {
  id: number;
}
