import { z } from 'zod';
import { DataItem, ModelSchemaDefault } from '@/synq/models/base.ts';
import { UniqueIdentifier } from '@/synq/storage/types.ts';

export async function promisifyIndexedDbGet<ModelSchema extends ModelSchemaDefault>(
  dbName: string,
  tableName: string,
  uniqueIdentifier: UniqueIdentifier,
  zodValidator: z.ZodObject<DataItem<ModelSchema>>
) {
  return new Promise((resolve, reject) => {
    const idbOpenReq = window.indexedDB.open(dbName);
    const getQuery = idbOpenReq.result.transaction(dbName, 'readonly').objectStore(tableName).get(uniqueIdentifier);

    getQuery.onsuccess = () => {
      const res = zodValidator.safeParse(getQuery.result);
      if (res.success) resolve(res.data as DataItem<ModelSchema>);
      else reject('Error getting query result');
    };

    getQuery.onerror = () => reject('Error getting query result');
  });
}

export async function promisifyIndexedDbGetAll<ModelSchema extends ModelSchemaDefault>(
  dbName: string,
  tableName: string,
  zodValidator: z.ZodObject<DataItem<ModelSchema>>
) {
  return new Promise((resolve, reject) => {
    const idbOpenReq = window.indexedDB.open(dbName);
    const getAllQuery = idbOpenReq.result.transaction(dbName, 'readonly').objectStore(tableName).getAll();

    getAllQuery.onsuccess = () => {
      const validResults: DataItem<ModelSchema>[] = [];
      for (const items of getAllQuery.result) {
        const res = zodValidator.safeParse(items);
        if (res.success) {
          const data = res.data;
          validResults.push(data as DataItem<ModelSchema>);
        }
      }
      resolve(validResults);
    };

    getAllQuery.onerror = () => reject('Error getting query result');
  });
}
