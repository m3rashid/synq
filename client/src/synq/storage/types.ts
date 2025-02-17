import { z } from 'zod';
import { Model, ModelSchemaDefault } from '@/synq/models/base';

export type UniqueIdentifier = string | number;
export type UpdateParams<ModelSchema> = { data: Partial<ModelSchema>; uniqueIdentifier: UniqueIdentifier };

export type DataLayerConstructorParams<ModelSchema extends ModelSchemaDefault> = {
  dbName: string;
  tableName: string;
  model: Model<ModelSchema>;
  zodSchema: z.ZodObject<ModelSchema>;
};
