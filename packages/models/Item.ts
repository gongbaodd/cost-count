import { addItem, delItem, listItems, mutItem, storage } from "../services";
import { CategoryStore } from "./Categories";

export interface Item {
  id: string;
  name: string;
  price: number;
  type: {
    id: string
    name: string
  }
  date: number;
}

let items: Item[] = [];
let listeners: (() => void)[] = [];

export const ItemStore = {
  remote: {
    loadItems,
    addItem: _addItem,
    modifyItem,
    deleteItem,
  },
  storage: {
    loadItems: loadItemsInStorage,
    addItem: addItemInStorage,
    modifyItem: modifyItemInStorage,
    deleteItem: deleteItemInStorage,
  },
  findItem: (id: string) => {
    return items.find((item) => item.id === id);
  },
  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  getSnapshot: () => {
    return items;
  },
};

function emitChange() {
  listeners.forEach((l) => l());
}

async function loadItemsInStorage() {
  const data = await storage.getItem<Item[]>(`items`);
  items = data ?? items;

  emitChange();
}

async function addItemInStorage(item: Omit<Item, "id" | "type"> & { type: Item["type"]["id"] }) {
  const type = CategoryStore.findCategory(item.type);

  if (!type) {
    console.error("Invalid category");
    return;
  }

  const newItem = { ...item, id: "local-" + crypto.randomUUID(), type};
  items = items.concat(newItem);
  await storage.setItem(`items`, items);

  emitChange();

  return newItem
}

async function modifyItemInStorage(id: string, item: Omit<Item, "id"| "type"> & { type: Item["type"]["id"] }) {
  const index = items.findIndex((item) => item.id === id);
  if (index !== -1) {
    const type = CategoryStore.findCategory(item.type);

    if (!type) {
      console.error("Invalid category");
      return;
    }

    const newItem = { ...item, type, id };
    items = [
      ...items.slice(0, index),
      newItem,
      ...items.slice(index + 1),
    ].sort((a, b) => a.date - b.date);

    await storage.setItem(`items`, items);
    emitChange();
  }
}

async function deleteItemInStorage(id: string) {
  const index = items.findIndex((item) => item.id === id);
  if (index !== -1) {
    items = [...items.slice(0, index), ...items.slice(index + 1)];
    await storage.setItem(`items`, items);
    emitChange();
  }
}

async function loadItems() {
  const data = await listItems();
  items = data;
  emitChange();
}

async function _addItem(item: Omit<Item, "id" | "type"> & { type: Item["type"]["id"] }) {
  const newItem = await addItem(item.name, item.price, item.type);

  if (!newItem) { return null; }

  items = items.concat(newItem);
  emitChange();
  return newItem;
}

async function modifyItem(id: string, item: Omit<Item, "id"| "type"> & { type: Item["type"]["id"] }) {
  const index = items.findIndex((item) => item.id === id);
  if (index !== -1) {
    const newItem = await mutItem(id, { type: item.type, date: item.date });

    if (!newItem) { return ; }

    items = [
      ...items.slice(0, index),
      newItem,
      ...items.slice(index + 1),
    ].sort((a, b) => a.date - b.date);

    emitChange();
  }
}

async function deleteItem(id: string) {
  const index = items.findIndex((item) => item.id === id);
  if (index !== -1) {
    items = [...items.slice(0, index), ...items.slice(index + 1)];

    await delItem(id);
    emitChange();
  }
}
