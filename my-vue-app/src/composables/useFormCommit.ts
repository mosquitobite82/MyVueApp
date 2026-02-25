import type { ComputedRef, InjectionKey } from 'vue'

export type CommitFieldFn = (
  sectionId: string,
  fieldIndex: number,
  oldValue: unknown,
  newValue: unknown,
) => Promise<void>

export type RequestFocusFn = (
  sectionId: string,
  fieldIndex: number,
  currentValue: unknown,
) => Promise<void>

export const COMMIT_FIELD_KEY: InjectionKey<CommitFieldFn> = Symbol('commitField')

/** Provides reactive access to the field ID (`sectionId:fieldIndex`) the backend wants focused. */
export const ACTIVE_FIELD_KEY: InjectionKey<ComputedRef<string | null>> = Symbol('activeField')

/** Lets descendant components request a focus change via the backend. */
export const REQUEST_FOCUS_KEY: InjectionKey<RequestFocusFn> = Symbol('requestFocus')
