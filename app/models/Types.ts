interface Type {
    name: string;
    id: string;
}

const types: Type[] = []
let listeners: (()=>void)[] = []

export const TypeStore = {
    addType: (t: Type) => {
        types.push(t)
        emitChange()
    },
    subscribe: (listener: () => void) => {
        listeners.push(listener)
        return () => {
            listeners = listeners.filter((l) => l !== listener)
        }
    },
    getSnapshot: () => {
        return types
    }
}

function emitChange() {
    listeners.forEach((l) => l())
}