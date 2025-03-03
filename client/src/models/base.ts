export type ActionQueue<T> = {
  error?: unknown;
} & (
  | { action: 'create'; data: Partial<Omit<T, 'id'>> }
  | { action: 'createMany'; data: Partial<Omit<T, 'id'>>[] }
  | { action: 'update'; data: { id: number; data: Partial<T> } }
  | { action: 'updateMany'; data: Array<{ filter: Partial<T>; data: Partial<T> }> }
  | { action: 'delete'; data: { id: number } }
  | { action: 'deleteMany'; data: Partial<T> }
  | { action: 'refetch'; data: { id: number } }
  | { action: 'refetchAll' }
); // TODO: scope of talking to other models

export interface BaseModel<T extends object> {
  tableName: string;

  subscribe: (listener: () => void) => void;

  enableAutoSync: () => void;
  disableAutoSync: () => void;

  get: (id: number) => Promise<T | undefined>;
  getAll?: () => T[];

  create: (data: Partial<Omit<T, 'id'>>) => void;
  createMany?: (data: Partial<Omit<T, 'id'>>[]) => void;

  update: (id: number, data: Partial<T>) => void;
  updateMany?: (data: Array<{ filter: Partial<T>; data: Partial<T> }>) => void;

  delete: (id: number) => void;
  deleteMany?: (filters: Partial<T>) => void;

  forceSync: () => Promise<void>;
}
