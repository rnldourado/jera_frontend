"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const router = useRouter()
  const { login, refreshUser } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError("")
  }

  const validateForm = () => {
    if (!formData.username) {
      setError("Username é obrigatório")
      return false
    }
    if (!formData.password) {
      setError("Senha é obrigatória")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    console.log('=== TENTATIVA DE LOGIN ===')
    console.log('FormData:', formData)

    try {
      console.log('Chamando API login...')
      const response = await apiClient.login({
        username: formData.username,
        password: formData.password,
      })

      console.log('Response da API:', response)

      // Usar o hook useAuth para salvar usuário e token
      console.log('Salvando dados no contexto...')
      login(response.user, response.token)
      
      // Verificar se os dados foram salvos
      console.log('Verificando localStorage após login...')
      console.log('authToken:', localStorage.getItem('authToken'))
      console.log('currentUser:', localStorage.getItem('currentUser'))
      console.log('isAuthenticated:', localStorage.getItem('isAuthenticated'))
      
      // Forçar refresh dos dados
      setTimeout(() => {
        refreshUser()
      }, 100)
      
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true")
      }

      console.log('Redirecionando para dashboard...')
      // Aguardar um pouco antes do redirect para garantir que o estado seja atualizado
      setTimeout(() => {
        console.log('Executando redirecionamento...')
        router.push("/dashboard")
      }, 300)
    } catch (err) {
      console.error('Erro no login:', err)
      setError(err instanceof Error ? err.message : "Erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-3">Jera</h1>
          <p className="text-gray-600 text-base">Faça login para acessar sua conta</p>
        </div>

        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">Entrar</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="h-12 border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-12 border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
                  disabled={isLoading}
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                  className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <Label htmlFor="remember" className="text-sm text-gray-700">
                  Lembrar de mim
                </Label>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Não tem conta?{" "}
                <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                  Cadastre-se aqui!
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
