import { addCategory as add, listCategories } from "../services"

interface Type {
  name: string,
  id: string
}

let types: Type[] = []
let listeners: (() => void)[] = []

async function loadCategories() {
  const data = await listCategories()
  types = data ?? types
  emitChange()
}

async function addCategory (t: Omit<Type, "id">) {
  const newCategory = await add(t.name)
  types = types.concat(newCategory)

  emitChange()

  return newCategory
}

function findCategory(id: string) {
  return types.find((t) => t.id === id)
}

export const CategoryStore = {
  loadCategories,
  addCategory,
  findCategory,
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
