import { addItem, delItem, listItems, mutItem } from "../services";

interface Item {
  id: string;
  name: string;
  price: number;
  type: string;// name of category
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

async function loadItems() {
  const data = await listItems();
  items = data;
  emitChange();
}

async function _addItem(item: Omit<Item, "id">) {
  const newItem = await addItem(item.name, item.price, item.type);
  items = items.concat(newItem);
  emitChange();
  return newItem;
}

async function modifyItem(id: string, item: Omit<Item, "id">) {
  const index = items.findIndex((item) => item.id === id);
  if (index !== -1) {
    items = [
      ...items.slice(0, index),
      { ...item, id },
      ...items.slice(index + 1),
    ].sort((a, b) => a.date - b.date);

    await mutItem(id, { type: item.type, date: item.date });
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
