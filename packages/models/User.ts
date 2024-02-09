import { login } from "../services"

interface User {
  id: string
  email: string
  password: string
}

let user: User | null = null
const listeners: (() => void)[] = []

export const UserStore = {
  async login({ email, password }: Omit<User, "id">) {
    const info = await login(email, password)
    if (!info) {
      return;
    }

    user = { id: info.id, email, password }
    emitChange()
  },
  async logout() {
    user = null
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

