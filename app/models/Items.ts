import * as storage from "../utils/storage"

interface Item {
  id: number
  name: string
  price: number
  type: string
  date: number
}

const KEY = "RECORD_ITEMS"
loadItems()

let items: Item[] = []

// testRecords.map((record, index) => ({
//   ...record,
//   price: Number(record.price),
//   id: index + 1,
// }))
let listeners: (() => void)[] = []

export const ItemStore = {
  addItem: async (item: Omit<Item, "id">) => {
    const newItem = { ...item, id: items.length + 1 }
    items = items.concat(newItem)

    await storage.save(KEY, items)

    emitChange()
    return newItem
  },
  findItem: (id: number) => {
    return items.find((item) => item.id === id)
  },
  modifyItem: async (id: number, item: Omit<Item, "id">) => {
    const index = items.findIndex((item) => item.id === id)
    if (index !== -1) {
      items = [
        ...items.slice(0, index),
        { ...item, id },
        ...items.slice(index + 1),
      ].sort((a, b) => a.date - b.date)

      await storage.save(KEY, items)
      emitChange()
    }
  },
  deleteItem: async (id: number) => {
    const index = items.findIndex((item) => item.id === id)
    if (index !== -1) {
      items = [...items.slice(0, index), ...items.slice(index + 1)]

      await storage.save(KEY, items)
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

async function loadItems() {
  const data = await storage.load(KEY) as Item[] | null
  items = data ?? items
  emitChange()
}
