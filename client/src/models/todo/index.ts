import Dexie, { EntityTable } from 'dexie';
import { ActionQueue, BaseModel } from '../base';
import { Todo } from './schema';
import { createTodoFromServer, deleteTodoFromServer, getSingleTodoFromServer, getTodosFromServer } from './db';
import { useSyncExternalStore } from 'react';

type TodoDbType = Dexie & { todos: EntityTable<Todo, 'id'> };

class TodoModel implements BaseModel<Todo> {
  private db: TodoDbType;
  private actionQueue: ActionQueue<Todo>[] = [];
  private syncIntervalTime: number;
  private syncIntervalId: number | undefined; // TODO
  private listeners: Array<() => void> = [];

  todos: Todo[] = [];
  tableName: string;

  constructor(props?: { tableName?: string; syncInterval?: number }) {
    this.tableName = props?.tableName ?? 'todos';
    this.syncIntervalTime = props?.syncInterval ?? 2000;

    this.db = new Dexie(this.tableName) as TodoDbType;
    this.db.version(1).stores({ todos: '++id, title' });
    this.enableAutoSync();
    void this.init();
  }

  subscribe(listener: () => void) {
    this.listeners = [...this.listeners, listener];

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  disableAutoSync() {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
    }
  }

  enableAutoSync() {
    if (!this.syncIntervalId) {
      this.syncIntervalId = setInterval(() => {
        this.syncTodos();
      }, this.syncIntervalTime) as unknown as number;
    }
  }

  async get(id: number): Promise<Todo | undefined> {
    let todo = await this.db.todos.get(id);
    if (!todo) {
      todo = await getSingleTodoFromServer({ params: { id } });
    }
    return todo;
  }

  getAll(): Todo[] {
    return this.todos;
  }

  create(data: Partial<Omit<Todo, 'id'>>) {
    this.actionQueue.push({ action: 'create', data });
  }

  createMany(data: Partial<Omit<Todo, 'id'>>[]) {
    this.actionQueue.push({ action: 'createMany', data });
  }

  update(id: number, data: Partial<Todo>) {
    this.actionQueue.push({ action: 'update', data: { id, data } });
  }

  delete(id: number) {
    this.actionQueue.push({ action: 'delete', data: { id } });
    this.syncTodos();
  }

  forceSync() {
    this.pushRefetchAllActionToQueue();
    this.syncTodos();
  }

  private async init() {
    const initialTodos = await this.db.todos.toArray();
    this.todos = initialTodos;
    this.emitChangesToAllListeners();
  }

  private pushRefreshActionToQueue(id: number) {
    const lastItem = this.actionQueue[this.actionQueue.length - 1];

    if (lastItem.action === 'refetchAll') return;
    if (!(lastItem.action === 'refetch' && lastItem.data.id === id)) {
      this.actionQueue.push({ action: 'refetch', data: { id } });
    }
  }

  private pushRefetchAllActionToQueue() {
    const lastItem = this.actionQueue[this.actionQueue.length - 1];
    if (this.actionQueue.length > 0 && lastItem.action === 'refetchAll') return;

    this.actionQueue.push({ action: 'refetchAll' });
  }

  private async createTodo(data: Partial<Omit<Todo, 'id'>>) {
    try {
      const res = await createTodoFromServer({ body: data });
      if (res?.id) {
        const todo = { id: res.id, title: data.title ?? '', description: data.description };
        this.todos = [...this.todos, todo];
        this.emitChangesToAllListeners();
      }
    } catch (err: unknown) {
      console.error('Error in creating todo', err);
    }
  }

  private deleteTodo(todoId: number) {
    const todoPos = this.todos.findIndex((t) => t.id === todoId);
    if (todoPos === -1) return;

    const todo = this.todos[todoPos];
    this.todos = this.todos.filter((t) => t.id !== todoId);
    this.emitChangesToAllListeners();

    void deleteTodoFromServer({ params: { id: todoId } })
      .then(() => void this.db.todos.delete(todoId))
      .catch((err: unknown) => {
        console.error('Error in deleting from server', err);
        this.todos = [...this.todos.slice(0, todoPos), todo, ...this.todos.slice(todoPos)];
        this.emitChangesToAllListeners();
      });
  }

  private async getAllTodos() {
    const todos = await getTodosFromServer();

    if (todos) {
      this.todos = todos;
      await this.db.todos.clear();
      await this.db.todos.bulkPut(todos);
      this.emitChangesToAllListeners();
    }
    this.actionQueue.shift();
  }

  private syncTodos() {
    if (this.actionQueue.length === 0) return;
    if (!navigator.onLine) return;
    console.log(this.actionQueue.map((aq) => aq.action));

    for (const item of this.actionQueue) {
      switch (item.action) {
        case 'create':
          void this.createTodo(item.data);
          break;
        case 'createMany':
          break; // TODO
        case 'delete':
          this.deleteTodo(item.data.id);
          break;
        case 'deleteMany':
          break; // TODO
        case 'update':
          break; // TODO
        case 'updateMany':
          break; // TODO
        case 'refetchAll':
          void this.getAllTodos();
          break;
        case 'refetch':
          break; // TODO
        default:
          break;
      }
      this.actionQueue.shift();
    }
  }

  private emitChangesToAllListeners() {
    for (const listener of this.listeners) {
      listener();
    }
  }
}

export const todoModel = new TodoModel({ syncInterval: 5000 });

export function useTodoModel() {
  return {
    todos: useSyncExternalStore(
      (listener) => todoModel.subscribe(listener),
      () => todoModel.getAll()
    ),
  };
}
