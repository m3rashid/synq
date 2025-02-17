import { ModelSchemaDefault } from '@/synq/models/base';

export type ActionReturnType<ModelSchema extends ModelSchemaDefault> = void | ModelSchema | ModelSchema[];

export type DatabaseAction<ModelSchema extends ModelSchemaDefault> = (
  payload: Partial<ModelSchema>,
  onSuccess: (data: ActionReturnType<ModelSchema>) => void,
  onError?: (error: unknown) => void
) => ActionReturnType<ModelSchema>;

export type GlobalAction = {
  __id__: string;
};
