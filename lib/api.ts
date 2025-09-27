import type { 
  LoginCredentials, 
  LoginResponse, 
  CreateUserRequest, 
  CreateUserResponse,
  User,
  Project,
  CreateProjectRequest,
  Sprint,
  CreateSprintRequest,
  Task,
  CreateTaskRequest,
  Administrator,
  CreateAdministratorRequest
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

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

    // Adicionar token de autenticação se disponível
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      }
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Erro na requisição: ${response.status}`)
    }

    return response.json()
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // API aceita username para login
      const response = await this.request<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })
      
      console.log('Login response:', response)
      
      // Adaptar formato da resposta da API
      if (response.token) {
        localStorage.setItem('authToken', response.token)
        
        // Fazer uma segunda requisição para obter dados dos usuários
        const usersResponse = await this.request<User[]>('/users', {
          headers: {
            'Authorization': `Bearer ${response.token}`
          }
        })
        
        // Encontrar o usuário pelo username
        const user = usersResponse.find(u => u.username === credentials.username)
        
        if (!user) {
          throw new Error('Usuário não encontrado após login')
        }
        
        console.log('User found:', user)
        
        return {
          token: response.token,
          user: user
        }
      }
      
      throw new Error('Token não encontrado na resposta')
    } catch (error) {
      console.error('Erro no login da API:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Erro inesperado no login")
    }
  }

  async logout(): Promise<void> {
    // Remover tokens e dados de autenticação
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("authToken")
    localStorage.removeItem("rememberMe")
  }

  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      const response = await this.request<CreateUserResponse>("/users", {
        method: "POST",
        body: JSON.stringify(data),
      })
      return response
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Erro inesperado ao criar usuário")
    }
  }

  // Métodos para usuários
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users')
  }

  async getUserById(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`)
  }

  async updateUser(id: number, data: Partial<CreateUserRequest>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  // Métodos para projetos
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects')
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getProjectById(id: number): Promise<Project> {
    return this.request<Project>(`/projects/${id}`)
  }

  async updateProject(id: number, data: Partial<CreateProjectRequest>): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProject(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/projects/${id}`, {
      method: 'DELETE',
    })
  }

  // Métodos para sprints
  async getSprints(): Promise<Sprint[]> {
    return this.request<Sprint[]>('/sprints')
  }

  async createSprint(data: CreateSprintRequest): Promise<Sprint> {
    return this.request<Sprint>('/sprints', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getSprintById(id: number): Promise<Sprint> {
    return this.request<Sprint>(`/sprints/${id}`)
  }

  async updateSprint(id: number, data: Partial<CreateSprintRequest>): Promise<Sprint> {
    return this.request<Sprint>(`/sprints/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteSprint(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/sprints/${id}`, {
      method: 'DELETE',
    })
  }

  // Métodos para tarefas
  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>('/tasks')
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getTaskById(id: number): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`)
  }

  async getTasksByProject(projectId: number): Promise<Task[]> {
    return this.request<Task[]>(`/tasks/project/${projectId}`)
  }

  async getTasksBySprint(sprintId: number): Promise<Task[]> {
    return this.request<Task[]>(`/tasks/sprint/${sprintId}`)
  }

  async getTasksByAssignee(assigneeId: number): Promise<Task[]> {
    return this.request<Task[]>(`/tasks/assignee/${assigneeId}`)
  }

  async updateTask(id: number, data: Partial<CreateTaskRequest>): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTask(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  // Métodos para administradores
  async getAdministrators(): Promise<Administrator[]> {
    return this.request<Administrator[]>('/administrators')
  }

  async createAdministrator(data: CreateAdministratorRequest): Promise<Administrator> {
    return this.request<Administrator>('/administrators', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getAdministratorById(id: number): Promise<Administrator> {
    return this.request<Administrator>(`/administrators/${id}`)
  }

  async getAdministratorByUserId(userId: number): Promise<Administrator> {
    return this.request<Administrator>(`/administrators/user/${userId}`)
  }

  async getAdministratorsByLevel(level: 'super' | 'moderator' | 'support'): Promise<Administrator[]> {
    return this.request<Administrator[]>(`/administrators/level/${level}`)
  }

  async getActiveAdministrators(): Promise<Administrator[]> {
    return this.request<Administrator[]>('/administrators/active')
  }

  async getAvailablePermissions(): Promise<{ permissions: string[], total: number }> {
    return this.request<{ permissions: string[], total: number }>('/administrators/permissions')
  }

  async verifyPermission(userId: number, permission: string): Promise<{ userId: number, permission: string, hasPermission: boolean }> {
    return this.request<{ userId: number, permission: string, hasPermission: boolean }>('/administrators/verify-permission', {
      method: 'POST',
      body: JSON.stringify({ userId, permission }),
    })
  }

  async updateAdministrator(id: number, data: Partial<CreateAdministratorRequest>): Promise<Administrator> {
    return this.request<Administrator>(`/administrators/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async activateAdministrator(id: number): Promise<{ message: string, administrator: Administrator }> {
    return this.request<{ message: string, administrator: Administrator }>(`/administrators/${id}/activate`, {
      method: 'PATCH',
    })
  }

  async deactivateAdministrator(id: number): Promise<{ message: string, administrator: Administrator }> {
    return this.request<{ message: string, administrator: Administrator }>(`/administrators/${id}/deactivate`, {
      method: 'PATCH',
    })
  }

  async deleteAdministrator(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/administrators/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
