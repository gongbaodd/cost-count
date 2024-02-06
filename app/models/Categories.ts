import { addCategory, listCategories } from "app/services/urql"

interface Type {
  name: string,
  id: string
}

let types: Type[] = []
let listeners: (() => void)[] = []

export const CategoryStore = {
  loadCategories: async () => {
    const data = await listCategories()
    types = data ?? types
    emitChange()
  },
  addCategory: async (t: Omit<Type, "id">) => {
    const newCategory = await addCategory(t.name)
    types = types.concat(newCategory)

    emitChange()

    return newCategory
  },
  subscribe: (listener: () => void) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  },
  getSnapshot: () => {
    return types
  },
}

function emitChange() {
  listeners.forEach((l) => l())
}
