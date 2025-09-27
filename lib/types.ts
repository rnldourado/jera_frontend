// Auth types
export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

// User types
export interface User {
  id: number
  name: string
  username: string
  email: string
}

export interface CreateUserRequest {
  name: string
  username: string
  email: string
  password: string
}

export interface CreateUserResponse {
  success: boolean
  user?: {
    id: number
    name: string
    username: string
    email: string
  }
  message?: string
}

// Project types
export interface Project {
  id: number
  name: string
  description: string
  status: 'to do' | 'in progress' | 'done'
  startDate: string
  deadline: string
  creatorId: number
}

export interface CreateProjectRequest {
  name: string
  description: string
  status: 'to do' | 'in progress' | 'done'
  startDate: string
  deadline: string
  creatorId: number
}

// Sprint types
export interface Sprint {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  status: 'planning' | 'in_progress' | 'ended'
  projectId: number
}

export interface CreateSprintRequest {
  name: string
  description: string
  startDate: string
  endDate: string
  status: 'planning' | 'in_progress' | 'ended'
  projectId: number
}

// Task types
export interface Task {
  id: number
  name: string
  description: string
  status: 'to do' | 'in progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  completedAt: string | null
  assigneeId: number
  sprintId: number
  projectId: number
}

export interface CreateTaskRequest {
  name: string
  description: string
  status: 'to do' | 'in progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assigneeId: number
  sprintId: number
  projectId: number
}

// Administrator types
export interface Administrator {
  id: number
  userId: number
  level: 'super' | 'moderator' | 'support'
  permissions: string[]
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAdministratorRequest {
  userId: number
  level: 'super' | 'moderator' | 'support'
  permissions: string[]
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Error types
export interface ApiError {
  message: string
  code?: string
  status?: number
}
