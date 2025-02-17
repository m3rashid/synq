// import { Action } from '@/synq/actions/types';
// import { DataItem, Model, ModelSchemaDefault } from '@/synq/models/base';

// export const storageOptions = ['local-storage', 'session-storage', 'indexed-db', 'in-memory'] as const;
// export type Storage = (typeof storageOptions)[number];

// type UniqueIdentifier = string | number;
// type UpdateParams<ModelSchema> = { data: Partial<ModelSchema>; uniqueIdentifier: UniqueIdentifier };

// export type DataLayer<ModelSchema extends ModelSchemaDefault> = {
//   storage: Storage;
//   model: Model<ModelSchema>;

//   get: (uniqueIdentifier: UniqueIdentifier) => DataItem<ModelSchema>;
//   getAll: () => Array<DataItem<ModelSchema>>;

//   create: (data: Partial<ModelSchema>) => void;
//   createBulk: (data: Array<Partial<ModelSchema>>) => void;

//   update: (update: UpdateParams<ModelSchema>) => void;
//   updateBulk: (updates: Array<UpdateParams<ModelSchema>>) => void;

//   delete: (uniqueIdentifier: UniqueIdentifier) => void;
//   deleteBulk: (uniqueIdentifiers: Array<UniqueIdentifier>) => void;

//   forceSynk: (actions: Array<Action<ModelSchema>>) => void;
// };
