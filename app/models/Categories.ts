interface Type {
  name: string,
  id: number
}

let types: Type[] = [
    { name: "idle", id: 1 },
]
let listeners: (() => void)[] = []

export const CategoryStore = {
  addCategory: (t: Omit<Type, "id">) => {
    const newCategory = { ...t, id: types.length + 1 }
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
