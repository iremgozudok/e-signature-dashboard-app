import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  password: string
}

const loadUserFromStorage = (): User => {
  const stored = localStorage.getItem('userData')
  if (stored) {
    return JSON.parse(stored)
  }
  return {
    id: 1,
    firstName: 'İrem Nur',
    lastName: 'Gözüdok',
    email: 'iremgozudok99@icloud.com',
    password: '123456'
  }
}

const loadLoginStatusFromStorage = (): boolean => {
  const stored = localStorage.getItem('isLoggedIn')
  return stored === 'true'
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User>(loadUserFromStorage())

  const isLoggedIn = ref(loadLoginStatusFromStorage())

  const saveUserToStorage = () => {
    localStorage.setItem('userData', JSON.stringify(user.value))
  }

  const saveLoginStatusToStorage = () => {
    localStorage.setItem('isLoggedIn', isLoggedIn.value.toString())
  }

  watch(user, saveUserToStorage, { deep: true })

  watch(isLoggedIn, saveLoginStatusToStorage)

  const login = (email: string, password: string): boolean => {
    if (email === user.value.email && password === user.value.password) {
      isLoggedIn.value = true
      return true
    }
    return false
  }

  const logout = () => {
    isLoggedIn.value = false
    localStorage.removeItem('isLoggedIn')
  }

  const updateUser = (updatedUser: Partial<User>) => {
    user.value = { ...user.value, ...updatedUser }
  }

  return {
    user,
    isLoggedIn,
    login,
    logout,
    updateUser
  }
})