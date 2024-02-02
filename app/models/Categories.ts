import testRecords from "../../test/records.json"

interface Type {
  name: string,
  id: number
}

let types: Type[] = [
    { name: "idle", id: 1 },
    ...[...getTypes()].map((name, index) => ({ name, id: index + 2 })),
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

function getTypes() {
  const typeSet = new Set<string>()

  testRecords.forEach((record) => {
    typeSet.add(record.type)
  })

  return typeSet
}
