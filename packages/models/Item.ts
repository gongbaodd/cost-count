import { addItem, delItem, listItems, mutItem } from "../services"

interface Item {
  id: string
  name: string
  price: number
  type: string
  date: number
}

let items: Item[] = []
let listeners: (() => void)[] = []

export const ItemStore = {
  loadItems: async () => {
    const data = await listItems()
    items = data;
    emitChange()
  },
  addItem: async (item: Omit<Item, "id">) => {
    const newItem = await addItem(item.name, item.price, item.type)
    items = items.concat(newItem)
    emitChange()
    return newItem
  },
  findItem: (id: string) => {
    return items.find((item) => item.id === id)
  },
  modifyItem: async (id: string, item: Omit<Item, "id">) => {
    const index = items.findIndex((item) => item.id === id)
    if (index !== -1) {
      items = [
        ...items.slice(0, index),
        { ...item, id },
        ...items.slice(index + 1),
      ].sort((a, b) => a.date - b.date)

      await mutItem(id, { type: item.type, date: item.date })
      emitChange()
    }
  },
  deleteItem: async (id: string) => {
    const index = items.findIndex((item) => item.id === id)
    if (index !== -1) {
      items = [...items.slice(0, index), ...items.slice(index + 1)]

      await delItem(id)
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

// async function loadItems() {
//   const data = await storage.load(KEY) as Item[] | null
//   items = data ?? items
//   emitChange()
// }
