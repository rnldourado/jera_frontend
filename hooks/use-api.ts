"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"

export function useApi<T>(apiCall: () => Promise<T>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiCall()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, dependencies)

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}

// Specific hooks for common operations
export function useProjects() {
  return useApi(() => apiClient.getProjects())
}

export function useSprints() {
  return useApi(() => apiClient.getSprints())
}

export function useTasks() {
  return useApi(() => apiClient.getTasks())
}

export function useUsers() {
  return useApi(() => apiClient.getUsers())
}

export function useTasksByProject(projectId: number) {
  return useApi(() => apiClient.getTasksByProject(projectId), [projectId])
}

export function useTasksBySprint(sprintId: number) {
  return useApi(() => apiClient.getTasksBySprint(sprintId), [sprintId])
}

export function useTasksByAssignee(assigneeId: number) {
  return useApi(() => apiClient.getTasksByAssignee(assigneeId), [assigneeId])
}

// New hooks for user-specific data
export function useUserProjects(userId: number | null) {
  const { data: allProjects, loading, error, refetch } = useProjects()
  
  const userProjects = allProjects?.filter(project => 
    userId ? project.creatorId === userId : false
  ) || null

  return { data: userProjects, loading, error, refetch }
}

export function useUserSprints(userId: number | null) {
  const { data: allSprints, loading, error, refetch } = useSprints()
  const { data: allProjects } = useProjects()
  
  const userSprints = allSprints?.filter(sprint => {
    if (!userId || !allProjects) return false
    const project = allProjects.find(p => p.id === sprint.projectId)
    return project ? project.creatorId === userId : false
  }) || null

  return { data: userSprints, loading, error, refetch }
}

export function useUserTasks(userId: number | null) {
  const { data: allTasks, loading, error, refetch } = useTasks()
  
  // Filtrar tarefas onde o usuário é o assignee
  const userTasks = allTasks?.filter(task => 
    userId ? task.assigneeId === userId : false
  ) || null

  return { data: userTasks, loading, error, refetch }
}
