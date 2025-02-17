import { z } from 'zod';
import { DatabaseAction } from '@/synq/actions/types';

export type ModelSchemaDefault = z.ZodRawShape;

export type DataItem<ModelSchema> = ModelSchema & {
  /**
   * @description unique identifier for each data item (other than database id)
   * @default uuidv7()
   */
  __id__: string;

  /**
   * @description Whether it is synced with the server
   * @default false
   */
  __synced__: boolean;

  /**
   * @description Timestamp of the data item
   * @default Date.now()
   */
  __timestamp__: Date;
};

export type Model<ModelSchema extends ModelSchemaDefault> = {
  tableName: string;
  data: Array<DataItem<ModelSchema>>;
  uniqueIdentifierKey: string;
  indexes?: Array<{ name: string; keyPath: string | string[]; options?: IDBIndexParameters }>;
  syncActions: {
    get: DatabaseAction<ModelSchema>;
    getAll: DatabaseAction<ModelSchema>;

    create: DatabaseAction<ModelSchema>;
    createBulk?: DatabaseAction<ModelSchema>;

    update: DatabaseAction<ModelSchema>;
    updateBulk?: DatabaseAction<ModelSchema>;

    delete: DatabaseAction<ModelSchema>;
    deleteBulk?: DatabaseAction<ModelSchema>;
  };
};
