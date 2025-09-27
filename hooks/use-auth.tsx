"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/lib/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  const refreshUser = () => {
    console.log('=== REFRESH USER ===')
    const savedUser = localStorage.getItem('currentUser')
    const token = localStorage.getItem('authToken')
    
    console.log('savedUser:', savedUser)
    console.log('token:', token)
    
    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser)
        console.log('Parsed user:', parsedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Erro ao fazer parse do usuário:', error)
        setUser(null)
      }
    } else {
      console.log('Usuário ou token não encontrado')
      setUser(null)
    }
  }

  useEffect(() => {
    refreshUser()
    setIsLoading(false)
  }, [])

  const login = (userData: User, token: string) => {
    console.log('=== LOGIN FUNCTION ===')
    console.log('userData:', userData)
    console.log('token:', token)
    
    // Salvar no localStorage primeiro
    localStorage.setItem('authToken', token)
    localStorage.setItem('currentUser', JSON.stringify(userData))
    localStorage.setItem('isAuthenticated', 'true')
    
    console.log('Dados salvos no localStorage')
    
    // Atualizar o estado
    setUser(userData)
    console.log('Estado do usuário atualizado')
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('isAuthenticated')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
