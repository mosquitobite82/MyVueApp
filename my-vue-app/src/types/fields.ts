export type Label = {
  name: string
  position: 'side' | 'top' | 'inside'
}

export interface Checkbox {
  type: 'checkbox'
  label: Label
  value?: boolean
}

export interface DateTimeInput {
  type: 'datetime'
  label: Label
  value?: string
}

export interface NumberInput {
  type: 'number'
  label: Label
  value?: number
}

export interface SelectItem<T> {
  label: string
  value: T
}

export interface SelectInput<T> {
  type: 'select'
  label: Label
  items: SelectItem<T>[]
  value?: SelectItem<T>
}

export interface RadioInput<T> {
  type: 'radio'
  label: Label
  items: SelectItem<T>[]
  value?: SelectItem<T>
}

export interface TextareaInput {
  type: 'textarea'
  label: Label
  value?: string
}

export interface TextInput {
  type: 'text'
  label: Label
  value?: string
}

export type Field<T> =
  | Checkbox
  | DateTimeInput
  | NumberInput
  | SelectInput<T>
  | RadioInput<T>
  | TextareaInput
  | TextInput

export type FieldValue = string | boolean | number
