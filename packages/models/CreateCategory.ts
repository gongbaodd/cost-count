import { Type } from "./Categories";

let category: Pick<Type, "name"> | null = null
let listeners: Function[] = []

export const CreateCategoryStore = {
    getSnapshot() {
        return category
    },
    subscribe(listener: Function) {
        listeners.push(listener)

        return () => {
            listeners = listeners.filter(l => l === listener)
        }
    },
    setName,
    clear,
    isValid,
}

function emitChange() {
    listeners.forEach(l => l())
}

function setName(name: Type["name"]) {
    if (!category) category = {} as any

    category!.name = name
    emitChange()
}

function clear() {
    category = null
    emitChange()
}

function isValid() {
    if (!category) return false
    const keys = ["name"] satisfies (keyof typeof category)[]

    for (const key of keys) {
        if (!category[key]) return false
    }

    return true
}