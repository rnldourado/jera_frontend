const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  token?: string
  user?: {
    id: string
    email: string
    name: string
  }
  message?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`)
    }

    return response.json()
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Simulação de login para desenvolvimento
      // Remova esta simulação quando conectar com API real
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (credentials.email === "admin@jera.com" && credentials.password === "123456") {
        return {
          success: true,
          token: "fake-jwt-token",
          user: {
            id: "1",
            email: credentials.email,
            name: "Admin"
          }
        }
      } else {
        throw new Error("Email ou senha incorretos")
      }

      // Para conectar com API real, descomente e ajuste:
      // return this.request<LoginResponse>('/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify(credentials),
      // })
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Erro inesperado no login")
    }
  }

  async logout(): Promise<void> {
    // Implementar logout se necessário
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("rememberMe")
  }

  // Adicione outros métodos da API conforme necessário
  // async getUser(): Promise<User> { ... }
  // async updateProfile(data: ProfileData): Promise<User> { ... }
}

export const apiClient = new ApiClient(API_BASE_URL)
