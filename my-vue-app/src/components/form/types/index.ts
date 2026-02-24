export type MenuAction = 'save' | 'clear'

export type MenuButton = {
  name: string
  label: Label
  action: MenuAction
}

export type Menu = {
  buttons: MenuButton[]
}

export type Label = {
  name: string
  position: 'side' | 'top' | 'inside'
}

export type Field<T> = {
  name: string
  label: Label
  value: T
}

export type FieldValue = string | Date | boolean | number

export type Section = {
  fields: Field<FieldValue>[]
}

export type Form = {
  menu: Menu
  sections: Section[]
  tabs: Section[]
}
