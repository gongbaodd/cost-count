import { Item } from "./Item";

let item: Pick<Item, "name" | "price" | "type"> | null = null;
let listeners: Function[] = [];

export const CreateItemStore = {
  getSnapshot() {
    return item;
  },
  subscribe(listener: Function) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l === listener);
    };
  },
  setName,
  setType,
  setPrice,
  isValid,
  clear,
};

function emitChange() {
  listeners.forEach((l) => l());
}

function setName(name: Item["name"]) {
  item = {
    ...(item ?? ({} as any)),
    name,
  };
  emitChange();
}

function setType(type: Item["type"]) {
  item = {
    ...(item ?? ({} as any)),
    type,
  };

  emitChange();
}

function setPrice(price: Item["price"]) {
  item = {
    ...(item ?? ({} as any)),
    price,
  };
  emitChange();
}

function isValid() {
  if (item) {
    const keys = ["name", "type", "price"] satisfies (keyof typeof item)[];

    for (const key of keys) {
      if (!item[key]) return false;
    }

    if (!item["type"]["id"]) {
      return false;
    }

    return true;
  }

  return false;
}

function clear() {
  item = null;
  emitChange();
}
