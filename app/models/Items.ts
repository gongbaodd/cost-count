import testRecords from "../../test/records.json"

interface Item {
  id: number
  name: string
  price: number
  type: string
  date: number
}

let items: Item[] = testRecords.map((record, index) => ({
  ...record,
  price: Number(record.price),
  id: index + 1,
}))
let listeners: (() => void)[] = []

export const ItemStore = {
  addItem: (item: Omit<Item, "id">) => {
    items = items.concat({...item, id: items.length + 1})
    emitChange()
  },
  deleteItem: (id: number) => {
    const index = items.findIndex((item) => item.id === id)
    if (index !== -1) {
      items = [...items.slice(0, index), ...items.slice(index + 1)]
      emitChange()
    }
  },
  subscribe: (listener: () => void) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  },
  getSnapshot: () => {
    return items
  },
}

function emitChange() {
  listeners.forEach((l) => l())
}
