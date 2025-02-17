// import { Action } from '@/synq/actions/types';

// export type ModelSchemaDefault = object;

// export type DataItem<ModelSchema> = ModelSchema & {
//   __isPending: boolean;
// };

// export type Model<ModelSchema extends ModelSchemaDefault> = {
//   id: string;
//   data: Array<DataItem<ModelSchema>>;
//   uniqueIdentifierKey: keyof ModelSchema;
//   actions: {
//     get: Action<ModelSchema>;
//     getAll: Action<ModelSchema>;

//     create: Action<ModelSchema>;
//     createBulk?: Action<ModelSchema>;

//     update: Action<ModelSchema>;
//     updateBulk?: Action<ModelSchema>;

//     delete: Action<ModelSchema>;
//     deleteBulk?: Action<ModelSchema>;
//   };
// };
