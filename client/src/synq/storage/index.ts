import { z } from 'zod';
import { DataLayerConstructorParams, UniqueIdentifier, UpdateParams } from '@/synq/storage/types.ts';
import { DataItem, Model, ModelSchemaDefault } from '@/synq/models/base.ts';
import { promisifyIndexedDbGet, promisifyIndexedDbGetAll } from '@/synq/storage/helpers.ts';

export class IndexedDbDataLayer<ModelSchema extends ModelSchemaDefault> {
  dbName: string;
  tableName: string;
  model: Model<ModelSchema>;
  zodSchema: z.ZodObject<DataItem<ModelSchema>>;

  constructor(options: DataLayerConstructorParams<ModelSchema>) {
    this.dbName = options.dbName;
    this.tableName = options.tableName;

    this.model = options.model;
    this.zodSchema = options.zodSchema.extend({
      __id__: z.string(),
      __synced__: z.boolean(),
      __timestamp__: z.date(),
    }) as any; // TODO: fix this

    const idbOpenReq = window.indexedDB.open(this.dbName); // handle version number
    idbOpenReq.onerror = (event) => {
      console.error(event, { db: this.dbName, table: this.tableName, message: 'IndexedDb Open Db error' });
    };

    idbOpenReq.onupgradeneeded = () => {
      const db = idbOpenReq.result;
      const store = db.createObjectStore(this.dbName, { keyPath: this.model.uniqueIdentifierKey });
      for (const index of this.model.indexes || []) {
        store.createIndex(index.name, index.keyPath, index.options);
      }
    };

    idbOpenReq.onsuccess = () => {
      const db = idbOpenReq.result;
      const transaction = db.transaction(this.dbName, 'readonly');
      const store = transaction.objectStore(this.tableName);
      // const indices = (this.model.indexes || []).map((index) => ({
      //   [index.name]: store.index(index.name),
      // }))

      const allItemsQuery = store.getAll();
      allItemsQuery.onsuccess = () => {
        const validResults: DataItem<ModelSchema>[] = [];
        for (const items of allItemsQuery.result) {
          const res = this.zodSchema.safeParse(items);
          if (res.success) {
            const data = res.data;
            console.log(data);
            validResults.push(data as DataItem<ModelSchema>);
          }
        }
        this.model.data = validResults;
      };
    };
  }

  async get(uniqueIdentifier: UniqueIdentifier) {
    console.log('Current model data: (get() request)', this.model.data);

    try {
      const data = await promisifyIndexedDbGet(this.dbName, this.tableName, uniqueIdentifier, this.zodSchema);
      console.log('Result:', data);
      return data as DataItem<ModelSchema>;
    } catch (err: unknown) {
      console.error(err);
      // TODO: add an action to get the data from the server
    }
  }

  async getAll() {
    console.log('Current model data: (getAll() request)', this.model.data);

    try {
      const data = await promisifyIndexedDbGetAll(this.dbName, this.tableName, this.zodSchema);
      console.log('Result:', data);
      return data as DataItem<ModelSchema>[];
    } catch (err: unknown) {
      console.error(err);
      // TODO: add an action to get the data from the server
    }

    return [];
  }

  async create(data: Partial<ModelSchema>) {
    throw new Error('Not implemented.');
  }

  async createBulk(data: Array<Partial<ModelSchema>>) {
    throw new Error('Not implemented.');
  }

  async update(update: UpdateParams<ModelSchema>) {
    throw new Error('Not implemented.');
  }

  async updateBulk(data: Array<UpdateParams<ModelSchema>>) {
    throw new Error('Not implemented.');
  }

  async delete(uniqueIdentifier: UniqueIdentifier) {
    throw new Error('Not implemented.');
  }

  async deleteBulk(uniqueIdentifier: Array<UniqueIdentifier>) {
    throw new Error('Not implemented.');
  }
}
