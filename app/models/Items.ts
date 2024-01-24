interface Item {
    id: string;
    name: string;
    price: number;
    type: string;
}

const items: Item[] = []
let listeners: (()=>void)[] = []

export const ItemStore = {
    addItem: (item: Item) => {
        items.push(item)
        emitChange()
        console.log(items)
    },
    deleteItem: (id: string) => {
        const index = items.findIndex((item) => item.id === id)
        if (index !== -1) {
            items.splice(index, 1)
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
    }
}

function emitChange() {
    listeners.forEach((l) => l())
}