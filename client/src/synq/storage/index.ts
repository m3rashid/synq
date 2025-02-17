// import { Storage } from '@/synq/storage/types';
// import { Model, ModelSchemaDefault } from '@/synq/models/base';
// import { MemoryStorage } from './memory';

// export function newStorage<ModelSchema extends ModelSchemaDefault>(
//   storageType: Storage,
//   model: Model<ModelSchema>
// ) {
//   if (storageType === 'in-memory') return new MemoryStorage(model);
//   else if (storageType === 'local-storage') throw new Error('Local storage not implemented');
//   else if (storageType === 'session-storage') throw new Error('Session storage not implemented');
//   else if (storageType === 'indexed-db') throw new Error('Indexed DB not implemented');

//   throw new Error('Unknown storage type');
// }
