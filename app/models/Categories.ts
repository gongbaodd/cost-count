import * as Storage from "../utils/storage"

interface Type {
  name: string,
  id: number
}

const KEY = "RECORD_TYPES"

let types: Type[] = [
    { name: "idle", id: 1 },
]
let listeners: (() => void)[] = []

loadCategories()

export const CategoryStore = {
  addCategory: async (t: Omit<Type, "id">) => {
    const newCategory = { ...t, id: types.length + 1 }
    types = types.concat(newCategory)

    await Storage.save(KEY, types)

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

async function loadCategories() {
  const data = await Storage.load(KEY) as Type[] | null
  types = data ?? types
  emitChange()
}