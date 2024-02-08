import { Type } from "./Categories";

let listeners: Function[] = [];
let selected: Type | { name: "idle" } = { name: "idle" };

export const SelectedCategoryStore = {
  select,
  subscribe(listener: Function) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  getSnapshot() {
    return selected;
  },
};

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function select(item: Type) {
  selected = item;
  emitChange();
}
