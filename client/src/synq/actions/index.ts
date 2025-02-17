// import { ModelSchemaDefault } from '@/synq/models/base';
// import { Action, ActionParams, ActionReturnType } from '@/synq/actions/types';
// import { apiClient, ApiClientParams } from '@/api';

// async function backendRequest<
//   ModelSchema extends ModelSchemaDefault,
//   FnReturnType extends ActionReturnType<ModelSchema>
// >(apiParams: ApiClientParams, ...[onSuccess, onError]: ActionParams<ModelSchema>) {
//   try {
//     const res = await apiClient(...apiParams);
//     if (onSuccess) onSuccess(res.data as FnReturnType);
//     return res.data as FnReturnType;
//   } catch (err) {
//     console.error(err);
//     if (err instanceof Error) onError?.(err);
//   }
// }

// export function getAction<ModelSchema extends ModelSchemaDefault>(
//   ...[onSuccess, onError]: ActionParams<ModelSchema>
// ): Action<ModelSchema> {
//   return {
//     name: 'get',
//     backendRequest: (...params) => backendRequest<ModelSchema, ModelSchema>(params, onSuccess, onError),
//   };
// }

// export function getAllAction<ModelSchema extends ModelSchemaDefault>(
//   ...[onSuccess, onError]: ActionParams<ModelSchema>
// ): Action<ModelSchema> {
//   return {
//     name: 'getAll',
//     backendRequest: (...params) => backendRequest<ModelSchema, ModelSchema[]>(params, onSuccess, onError),
//   };
// }

// export function createAction<ModelSchema extends ModelSchemaDefault>(
//   ...[onSuccess, onError]: ActionParams<ModelSchema>
// ): Action<ModelSchema> {
//   return {
//     name: 'create',
//     backendRequest: (...params) => backendRequest<ModelSchema, void>(params, onSuccess, onError),
//   };
// }

// export function createBulkAction<ModelSchema extends ModelSchemaDefault>(
//   ...[onSuccess, onError]: ActionParams<ModelSchema>
// ): Action<ModelSchema> {
//   return {
//     name: 'createBulk',
//     backendRequest: (...params) => backendRequest<ModelSchema, void>(params, onSuccess, onError),
//   };
// }

// export function updateAction<ModelSchema extends ModelSchemaDefault>(
//   ...[onSuccess, onError]: ActionParams<ModelSchema>
// ): Action<ModelSchema> {
//   return {
//     name: 'update',
//     backendRequest: (...params) => backendRequest<ModelSchema, ModelSchema>(params, onSuccess, onError),
//   };
// }

// export function updateBulkAction<ModelSchema extends ModelSchemaDefault>(
//   ...[onSuccess, onError]: ActionParams<ModelSchema>
// ): Action<ModelSchema> {
//   return {
//     name: 'updateBulk',
//     backendRequest: (...params) => backendRequest<ModelSchema, ModelSchema[]>(params, onSuccess, onError),
//   };
// }

// export function deleteAction<ModelSchema extends ModelSchemaDefault>(
//   ...[onSuccess, onError]: ActionParams<ModelSchema>
// ): Action<ModelSchema> {
//   return {
//     name: 'delete',
//     backendRequest: (...params) => backendRequest<ModelSchema, void>(params, onSuccess, onError),
//   };
// }

// export function deleteBulkAction<ModelSchema extends ModelSchemaDefault>(
//   ...[onSuccess, onError]: ActionParams<ModelSchema>
// ): Action<ModelSchema> {
//   return {
//     name: 'deleteBulk',
//     backendRequest: (...params) => backendRequest<ModelSchema, void>(params, onSuccess, onError),
//   };
// }
