import { apiClient } from '@/api';
import { Todo } from './schema';

export const createTodoFromServer = apiClient<{ id: number }>('/api/todos', {
  method: 'POST',
  requireAuth: false,
});

export const deleteTodoFromServer = apiClient('/api/todos/delete/:id', {
  method: 'POST',
  requireAuth: false,
});

export const getTodosFromServer = apiClient<Todo[]>('/api/todos', {
  dissociateWindow: true,
  requireAuth: false,
});

export const getSingleTodoFromServer = apiClient<Todo>('/api/todos/:id', {
  dissociateWindow: true,
  requireAuth: false,
});
