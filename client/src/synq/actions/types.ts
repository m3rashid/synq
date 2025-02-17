// import { ApiClientParams } from '@/api';
// import { ModelSchemaDefault } from '@/synq/models/base';

// export type ActionReturnType<ModelSchema extends ModelSchemaDefault> = void | ModelSchema | ModelSchema[];
// export type Action<ModelSchema extends ModelSchemaDefault> = {
//   name: string;
//   backendRequest: (...params: ApiClientParams) => Promise<ActionReturnType<ModelSchema>>;
// };

// export type ActionParams<ModelSchema extends ModelSchemaDefault> = [
//   onSuccess: (data: ActionReturnType<ModelSchema>) => void,
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   onError?: (error: any) => void
// ];
