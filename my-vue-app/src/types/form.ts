import type { Field, FieldValue, Label } from './fields'

export type MenuButtonAction = 'save' | 'clear' | 'open'
export type MenuButton = {
  name: string
  label: Label
  action: MenuButtonAction
}

export type Menu = {
  buttons: MenuButton[]
}

export interface Button {
  name: string
  onClick: () => void
}

export interface Section {
  name: string
  formId: string
  sections: Section[]
  buttons: Button[]
  fields: Field<FieldValue>[]
}

/** A named panel/tab in a Form, containing one or more sections. */
export interface FormWindow {
  name: string
  sections: Section[]
}

export interface Form {
  windows: FormWindow[]
  isConnected: boolean
  isLoading: boolean
  error: string | null
  lastUpdate: number | null
}
