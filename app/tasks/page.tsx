"use client"

import { useState, useCallback, useMemo } from "react"
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  Flag,
  User as UserIcon,
  Calendar,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { ProtectedPage } from "@/components/protected-page"
import { useTasks, useUserProjects, useUserSprints, useUserTasks } from "@/hooks/use-api"
import { useUsers } from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api"
import { Task, Project, Sprint, User, CreateTaskRequest } from "@/lib/types"

type TaskStatus = 'to do' | 'in progress' | 'done'
type TaskPriority = 'low' | 'medium' | 'high'

interface TaskFormData {
  name: string
  description: string
  projectId: string
  sprintId: string
  assigneeId: string
  priority: TaskPriority
  status: TaskStatus
}

export default function TasksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [createFormData, setCreateFormData] = useState<TaskFormData>({
    name: "",
    description: "",
    projectId: "",
    sprintId: "none",
    assigneeId: "none",
    priority: "medium",
    status: "to do"
  })

  const [editFormData, setEditFormData] = useState<TaskFormData>({
    name: "",
    description: "",
    projectId: "",
    sprintId: "none",
    assigneeId: "none",
    priority: "medium",
    status: "to do"
  })

  const { user } = useAuth()
  const { data: tasks, loading, error, refetch } = useUserTasks(user?.id || null)
  const { data: projects } = useUserProjects(user?.id || null)
  const { data: sprints } = useUserSprints(user?.id || null)
  const { data: users } = useUsers()

  // Create mapping objects for easy lookups
  const projectsMap = useMemo(() => {
    return (projects || []).reduce((acc, project) => {
      acc[project.id] = project
      return acc
    }, {} as Record<number, Project>)
  }, [projects])

  const sprintsMap = useMemo(() => {
    return (sprints || []).reduce((acc, sprint) => {
      acc[sprint.id] = sprint
      return acc
    }, {} as Record<number, Sprint>)
  }, [sprints])

  const usersMap = useMemo(() => {
    return (users || []).reduce((acc, user) => {
      acc[user.id] = user
      return acc
    }, {} as Record<number, User>)
  }, [users])

  const resetForm = useCallback(() => {
    setCreateFormData({
      name: "",
      description: "",
      projectId: "",
      sprintId: "none",
      assigneeId: "none",
      priority: "medium",
      status: "to do"
    })
    setEditFormData({
      name: "",
      description: "",
      projectId: "",
      sprintId: "none",
      assigneeId: "none",
      priority: "medium",
      status: "to do"
    })
    setSelectedTask(null)
    setIsEditModalOpen(false)
  }, [])

  const handleCreateTask = useCallback(async () => {
    if (!createFormData.name.trim() || !createFormData.projectId) {
      alert("Por favor, preencha pelo menos o nome da tarefa e selecione um projeto.")
      return
    }

    setIsCreating(true)
    try {
      const taskData: CreateTaskRequest = {
        name: createFormData.name,
        description: createFormData.description,
        projectId: parseInt(createFormData.projectId),
        sprintId: createFormData.sprintId === "none" ? 0 : parseInt(createFormData.sprintId),
        // Se não especificar assignee, atribuir ao usuário logado
        assigneeId: createFormData.assigneeId === "none" ? (user?.id || 0) : parseInt(createFormData.assigneeId),
        priority: createFormData.priority,
        status: createFormData.status
      }

      await apiClient.createTask(taskData)
      
      setIsCreateModalOpen(false)
      resetForm()
      refetch()
      alert("Tarefa criada com sucesso!")
    } catch (error: any) {
      console.error('Erro ao criar tarefa:', error)
      const errorMessage = error.response?.data?.message || error.message || "Erro desconhecido"
      alert(`Erro ao criar tarefa: ${errorMessage}`)
    } finally {
      setIsCreating(false)
    }
  }, [createFormData, user, refetch, resetForm])

  const handleEditTask = useCallback(async () => {
    if (!selectedTask || !editFormData.name.trim() || !editFormData.projectId) {
      alert("Por favor, preencha pelo menos o nome da tarefa e selecione um projeto.")
      return
    }

    setIsEditing(true)
    try {
      const taskData = {
        name: editFormData.name,
        description: editFormData.description,
        projectId: parseInt(editFormData.projectId),
        sprintId: editFormData.sprintId === "none" ? 0 : parseInt(editFormData.sprintId),
        assigneeId: editFormData.assigneeId === "none" ? 0 : parseInt(editFormData.assigneeId),
        priority: editFormData.priority,
        status: editFormData.status
      }

      await apiClient.updateTask(selectedTask.id, taskData)
      
      setIsEditModalOpen(false)
      resetForm()
      refetch()
      alert("Tarefa atualizada com sucesso!")
    } catch (error: any) {
      console.error('Erro ao atualizar tarefa:', error)
      const errorMessage = error.response?.data?.message || error.message || "Erro desconhecido"
      alert(`Erro ao atualizar tarefa: ${errorMessage}`)
    } finally {
      setIsEditing(false)
    }
  }, [selectedTask, editFormData, refetch, resetForm])

  const handleDeleteTask = useCallback(async (taskId: number) => {
    setIsDeleting(true)
    try {
      await apiClient.deleteTask(taskId)
      setTaskToDelete(null)
      refetch()
      alert("Tarefa excluída com sucesso!")
    } catch (error: any) {
      console.error('Erro ao excluir tarefa:', error)
      const errorMessage = error.response?.data?.message || error.message || "Erro desconhecido"
      alert(`Erro ao excluir tarefa: ${errorMessage}`)
    } finally {
      setIsDeleting(false)
    }
  }, [refetch])

  const handleOpenEditModal = useCallback((task: Task) => {
    setSelectedTask(task)
    setEditFormData({
      name: task.name,
      description: task.description,
      projectId: task.projectId.toString(),
      sprintId: task.sprintId ? task.sprintId.toString() : "none",
      assigneeId: task.assigneeId ? task.assigneeId.toString() : "none",
      priority: task.priority,
      status: task.status
    })
    setIsEditModalOpen(true)
  }, [])

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: 'to do' | 'in progress' | 'done') => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "to do":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: 'to do' | 'in progress' | 'done') => {
    switch (status) {
      case "done":
        return "Concluída"
      case "in progress":
        return "Em Progresso"
      case "to do":
        return "Pendente"
      default:
        return status
    }
  }

  const getPriorityLabel = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return priority
    }
  }

  const getDaysUntilDue = (createdAt: string) => {
    const today = new Date()
    const created = new Date(createdAt)
    const diffTime = today.getTime() - created.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredTasks = useMemo(() => {
    return tasks?.filter((task) => {
      const project = projectsMap[task.projectId]
      const sprint = sprintsMap[task.sprintId]
      
      const matchesSearch =
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sprint?.name || '').toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || task.status === statusFilter

      return matchesSearch && matchesStatus
    }) || []
  }, [tasks, projectsMap, sprintsMap, searchTerm, statusFilter])

  const taskStats = useMemo(() => {
    return {
      total: tasks?.length || 0,
      completed: tasks?.filter((t) => t.status === "done").length || 0,
      inProgress: tasks?.filter((t) => t.status === "in progress").length || 0,
      pending: tasks?.filter((t) => t.status === "to do").length || 0,
    }
  }, [tasks])

  if (loading) {
    return (
      <ProtectedPage>
        <div className="flex h-screen bg-gray-50">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Carregando tarefas...</p>
            </div>
          </div>
        </div>
      </ProtectedPage>
    )
  }

  if (error) {
    return (
      <ProtectedPage>
        <div className="flex h-screen bg-gray-50">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Erro ao carregar tarefas: {error}</p>
              <Button onClick={refetch}>Tentar novamente</Button>
            </div>
          </div>
        </div>
      </ProtectedPage>
    )
  }

  return (
    <ProtectedPage>
      <div className="flex h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Minhas Tarefas</h1>
                    {user && (
                      <p className="text-sm text-blue-600 mt-1">
                        Exibindo tarefas atribuídas a {user.name || user.email}
                      </p>
                    )}
                  </div>
                  <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Tarefa
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Criar Nova Tarefa</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nome da Tarefa</Label>
                          <Input
                            id="name"
                            value={createFormData.name}
                            onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                            placeholder="Digite o nome da tarefa"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            value={createFormData.description}
                            onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                            placeholder="Digite a descrição da tarefa"
                            className="h-20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectId">Projeto</Label>
                          <Select
                            value={createFormData.projectId}
                            onValueChange={(value) => setCreateFormData({ ...createFormData, projectId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um projeto" />
                            </SelectTrigger>
                            <SelectContent>
                              {projects?.map((project) => (
                                <SelectItem key={project.id} value={project.id.toString()}>
                                  {project.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="sprintId">Sprint (Opcional)</Label>
                          <Select
                            value={createFormData.sprintId || "none"}
                            onValueChange={(value) => setCreateFormData({ ...createFormData, sprintId: value === "none" ? "" : value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma sprint" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Nenhuma sprint</SelectItem>
                              {sprints?.map((sprint) => (
                                <SelectItem key={sprint.id} value={sprint.id.toString()}>
                                  {sprint.name} - {projectsMap[sprint.projectId]?.name || 'Projeto desconhecido'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="assigneeId">Responsável (Opcional)</Label>
                          <Select
                            value={createFormData.assigneeId || "none"}
                            onValueChange={(value) => setCreateFormData({ ...createFormData, assigneeId: value === "none" ? "" : value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um usuário" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Sem responsável</SelectItem>
                              {users?.map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>
                                  {user.name || user.email}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="priority">Prioridade</Label>
                          <Select
                            value={createFormData.priority}
                            onValueChange={(value: 'low' | 'medium' | 'high') => 
                              setCreateFormData({ ...createFormData, priority: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma prioridade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Baixa</SelectItem>
                              <SelectItem value="medium">Média</SelectItem>
                              <SelectItem value="high">Alta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-6">
                        <Button
                          variant="outline"
                          onClick={() => setIsCreateModalOpen(false)}
                          disabled={isCreating}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleCreateTask} disabled={isCreating}>
                          {isCreating ? "Criando..." : "Criar"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total</p>
                          <p className="text-2xl font-bold">{taskStats.total}</p>
                        </div>
                        <CheckSquare className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Concluídas</p>
                          <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Em Progresso</p>
                          <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
                        </div>
                        <Clock className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                          <p className="text-2xl font-bold text-yellow-600">{taskStats.pending}</p>
                        </div>
                        <AlertCircle className="h-8 w-8 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar tarefas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="to do">Pendente</SelectItem>
                      <SelectItem value="in progress">Em Progresso</SelectItem>
                      <SelectItem value="done">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Mais Filtros
                  </Button>
                </div>

                {/* Tasks List */}
                <div className="space-y-4">
                  {filteredTasks.map((task) => {
                    const project = projectsMap[task.projectId]
                    const sprint = sprintsMap[task.sprintId]
                    const assignedUser = usersMap[task.assigneeId]
                    const daysOld = getDaysUntilDue(task.createdAt)
                    
                    return (
                      <Card key={task.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{task.name}</h3>
                                <Badge className={getStatusColor(task.status)}>
                                  {getStatusLabel(task.status)}
                                </Badge>
                                <Badge className={getPriorityColor(task.priority)}>
                                  <Flag className="h-3 w-3 mr-1" />
                                  {getPriorityLabel(task.priority)}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-3">{task.description}</p>

                              <div className="flex items-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Projeto:</span>
                                  <span>{project?.name || 'Sem projeto'}</span>
                                </div>
                                {sprint && (
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium">Sprint:</span>
                                    <span>{sprint.name}</span>
                                  </div>
                                )}
                                {assignedUser && (
                                  <div className="flex items-center gap-1">
                                    <UserIcon className="h-4 w-4" />
                                    <span>{assignedUser.name || assignedUser.email}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>Há {daysOld} dias</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenEditModal(task)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>

                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setTaskToDelete(task)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}

                  {filteredTasks.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {searchTerm || statusFilter !== "all"
                            ? "Nenhuma tarefa encontrada com os filtros aplicados"
                            : "Você ainda não tem tarefas atribuídas"}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {searchTerm || statusFilter !== "all"
                            ? "Tente ajustar os filtros de busca."
                            : "Crie sua primeira tarefa para começar a organizar seu trabalho."}
                        </p>
                        {!searchTerm && statusFilter === "all" && projects && projects.length > 0 && (
                          <Button onClick={() => setIsCreateModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Criar Primeira Tarefa
                          </Button>
                        )}
                        {!searchTerm && statusFilter === "all" && (!projects || projects.length === 0) && (
                          <p className="text-sm text-gray-500 mt-2">
                            Você precisa criar projetos primeiro antes de criar tarefas
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Delete Task Confirmation Dialog */}
                <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Tarefa</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir a tarefa "{taskToDelete?.name}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setTaskToDelete(null)}>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          if (taskToDelete) {
                            handleDeleteTask(taskToDelete.id)
                          }
                        }}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting ? "Excluindo..." : "Excluir"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Edit Task Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Editar Tarefa</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="edit-name">Nome da Tarefa</Label>
                        <Input
                          id="edit-name"
                          value={editFormData.name}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          placeholder="Digite o nome da tarefa"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-description">Descrição</Label>
                        <Textarea
                          id="edit-description"
                          value={editFormData.description}
                          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                          placeholder="Digite a descrição da tarefa"
                          className="h-20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-status">Status</Label>
                        <Select
                          value={editFormData.status}
                          onValueChange={(value: 'to do' | 'in progress' | 'done') => 
                            setEditFormData({ ...editFormData, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="to do">Pendente</SelectItem>
                            <SelectItem value="in progress">Em Progresso</SelectItem>
                            <SelectItem value="done">Concluída</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-priority">Prioridade</Label>
                        <Select
                          value={editFormData.priority}
                          onValueChange={(value: 'low' | 'medium' | 'high') => 
                            setEditFormData({ ...editFormData, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma prioridade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="medium">Média</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-assigneeId">Responsável</Label>
                        <Select
                          value={editFormData.assigneeId || "none"}
                          onValueChange={(value) => setEditFormData({ ...editFormData, assigneeId: value === "none" ? "" : value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um usuário" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Sem responsável</SelectItem>
                            {users?.map((user) => (
                              <SelectItem key={user.id} value={user.id.toString()}>
                                {user.name || user.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setIsEditModalOpen(false)
                          resetForm()
                        }}
                        disabled={isEditing}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleEditTask} disabled={isEditing}>
                        {isEditing ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  )
}
