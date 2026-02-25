import type { InjectionKey } from 'vue'

export type CommitFieldFn = (
  sectionId: string,
  fieldIndex: number,
  oldValue: unknown,
  newValue: unknown,
) => Promise<void>

export const COMMIT_FIELD_KEY: InjectionKey<CommitFieldFn> = Symbol('commitField')
