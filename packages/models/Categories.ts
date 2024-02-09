import { addCategory as add, listCategories, storage } from "../services";
import { getUser } from "./User";

export interface Type {
  name: string;
  id: string;
}

let types: Type[] = [];
let listeners: (() => void)[] = [];

export const CategoryStore = {
  remote: {
    loadCategories,
    addCategory,
  },
  storage: {
    loadCategories: loadCategoriesInStore,
    addCategory: addCategoryInStore,
  },
  findCategory,
  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  getSnapshot: () => {
    return types;
  },
};

function emitChange() {
  listeners.forEach((l) => l());
}


async function loadCategoriesInStore() {
  const data = await storage.getItem<Type[]>(`categories`);
  types = data ?? types;

  emitChange();
}

async function addCategoryInStore(t: Omit<Type, "id">) {
  const newCategory = {...t, id: "local" + crypto.randomUUID()};
  types = types.concat(newCategory);

  await storage.setItem(`categories`, types);

  emitChange();

  return newCategory;
}

async function loadCategories() {
  const data = await listCategories();
  types = data ?? types;

  emitChange();
}

async function addCategory(t: Omit<Type, "id">) {
  const newCategory = await add(t.name);
  types = types.concat(newCategory);

  emitChange();

  return newCategory;
}

function findCategory(id: string) {
  return types.find((t) => t.id === id);
}

