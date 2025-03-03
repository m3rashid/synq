import { apiClient } from '@/api';
import { Todo } from './schema';

export const createTodoFromServer = apiClient<{ id: number }>('/api/todos', { method: 'POST' });

export const deleteTodoFromServer = apiClient('/api/todos/:id', { method: 'DELETE' });

export const getTodosFromServer = apiClient<Todo[]>('/api/todos', { dissociateWindow: true });

export const getSingleTodoFromServer = apiClient<Todo>('/api/todos/:id', { dissociateWindow: true });
