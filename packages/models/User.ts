import { login, storage } from "../services"

interface User {
  id: string
  email: string
  token: string
}

interface UserInput {
  email: string
  password: string
}

let user: User | null = null
const listeners: (() => void)[] = []

export const UserStore = {
  async login({ email, password }: UserInput) {
    const info = await login(email, password)
    if (!info) {
      return;
    }
    user = info
    await storage.setItem<User>(`user`, user)
    emitChange()
  },
  async logout() {
    user = null
    emitChange()
  },
  async load() {
    const data = await storage.getItem<User>(`user`)
    user = data ?? user
    emitChange()
  },
  subscribe(listener: () => void) {
    listeners.push(listener)

    return () => {
      listeners.filter((l) => l !== listener)
    }
  },
  getSnapshot() {
    return user
  },
}

function emitChange() {
  listeners.forEach((l) => l())
}

