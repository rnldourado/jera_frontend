"use client"

import { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'

export function TestUser() {
  const { login } = useAuth()

  useEffect(() => {
    // Simular um usuário logado para teste
    const testUser = {
      id: 1,
      name: "João da Silva",
      username: "joao.silva",
      email: "joao.silva@example.com"
    }
    
    const testToken = "test-token-123"
    
    // Fazer login automaticamente para teste
    setTimeout(() => {
      login(testUser, testToken)
      console.log('Usuário de teste logado:', testUser)
    }, 1000)
  }, [login])

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded text-xs z-50">
      Teste de usuário ativo
    </div>
  )
}
