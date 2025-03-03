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
      console.log({ syncId: this.syncIntervalId, type: 'disable' });
      clearInterval(this.syncIntervalId);
    }
  }

  enableAutoSync() {
    if (!this.syncIntervalId) {
      console.log({ syncId: this.syncIntervalId, type: 'enable' });
      this.syncIntervalId = setInterval(() => {
        this.syncModel();
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
  }

  async forceSync() {
    await this.syncTodos();
  }

  private async init() {
    const initialTodos = await this.db.todos.toArray();
    this.todos = initialTodos;
    this.emitChangesToAllListeners();
  }

  private syncModel() {
    if (this.actionQueue.length === 0) return;
    void this.syncTodos();
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

    if (lastItem.action === 'refetchAll') return;
    this.actionQueue.push({ action: 'refetchAll' });
  }

  private async syncTodos() {
    console.log('Syncing todos');
    if (this.actionQueue.length === 0) return;

    for (const item of this.actionQueue) {
      try {
        if (item.action === 'create') {
          const data = await createTodoFromServer({ body: item.data });
          if (data?.id) this.pushRefreshActionToQueue(data.id);
          this.actionQueue.shift();
        } else if (item.action === 'createMany') {
          //
        } else if (item.action === 'delete') {
          await deleteTodoFromServer({ params: { id: item.data.id } });
          this.actionQueue.shift();
        } else if (item.action === 'deleteMany') {
          //
        } else if (item.action === 'update') {
          //
        } else if (item.action === 'updateMany') {
          //
        } else if (item.action === 'refetchAll') {
          const todos = await getTodosFromServer();
          if (todos && todos.length > 0) {
            this.todos = todos;
            await this.db.todos.bulkPut(todos);
          }
          this.actionQueue.shift();
        } else {
          const todo = await getSingleTodoFromServer({ params: { id: item.data.id } });
          if (todo) {
            this.todos = this.todos.map((t) => (t.id === todo.id ? todo : t));
            await this.db.todos.put(todo);
          }
          this.actionQueue.shift();
        }
      } catch (err: unknown) {
        item.error = err as Error;
      } finally {
        this.emitChangesToAllListeners(); // TODO: find a better way to do this
      }
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
      (l) => todoModel.subscribe(l),
      () => todoModel.getAll()
    ),
  };
}
