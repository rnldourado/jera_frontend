"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Target, Plus, Search, Filter, Clock, CheckCircle2, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { ProtectedPage } from "@/components/protected-page"
import { useSprints, useProjects, useApi, useUserSprints, useUserProjects } from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api"
import type { Sprint, CreateSprintRequest, Task, Project } from "@/lib/types"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SprintsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null)
  const [sprintToDelete, setSprintToDelete] = useState<Sprint | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [createFormData, setCreateFormData] = useState<CreateSprintRequest>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'planning',
    projectId: 0
  })
  const [editFormData, setEditFormData] = useState<CreateSprintRequest>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'planning',
    projectId: 0
  })

  const { user } = useAuth() || { user: null }
  const { data: sprints, loading, error, refetch } = useUserSprints(user?.id || null)
  const { data: projects } = useUserProjects(user?.id || null)

  // Hook para buscar tarefas de cada sprint
  const [sprintTasks, setSprintTasks] = useState<Record<number, Task[]>>({})
  // Use useMemo for projectsMap instead of useState
  const projectsMap = useMemo(() => {
    return (projects || []).reduce((acc, project) => {
      acc[project.id] = project
      return acc
    }, {} as Record<number, Project>)
  }, [projects])

  const loadSprintTasks = useCallback(async (sprintsToLoad: Sprint[]) => {
    const tasksMap: Record<number, Task[]> = {}
    
    for (const sprint of sprintsToLoad) {
      try {
        const tasks = await apiClient.getTasksBySprint(sprint.id)
        tasksMap[sprint.id] = tasks
      } catch (error) {
        console.error(`Erro ao carregar tarefas do sprint ${sprint.id}:`, error)
        tasksMap[sprint.id] = []
      }
    }
    
    setSprintTasks(tasksMap)
  }, [])

  // Removed the useEffect for projectsMap as we now use useMemo

  useEffect(() => {
    if (sprints && sprints.length > 0) {
      loadSprintTasks(sprints)
    }
  }, [sprints, loadSprintTasks])

  const handleCreateSprint = useCallback(async () => {
    // Validações básicas
    if (!createFormData.name.trim()) {
      alert('Nome da sprint é obrigatório')
      return
    }
    
    if (!createFormData.description.trim()) {
      alert('Descrição da sprint é obrigatória')
      return
    }
    
    if (!createFormData.startDate) {
      alert('Data de início é obrigatória')
      return
    }
    
    if (!createFormData.endDate) {
      alert('Data de fim é obrigatória')
      return
    }

    if (!createFormData.projectId) {
      alert('Projeto é obrigatório')
      return
    }

    setIsCreating(true)
    
    try {
      // Create a copy of the data to avoid any state references causing issues
      const formDataToSend = { ...createFormData };
      console.log('Enviando dados da sprint:', formDataToSend)
      const newSprint = await apiClient.createSprint(formDataToSend)
      console.log('Sprint criada com sucesso:', newSprint)
      
      // Close dialog first
      setIsCreateDialogOpen(false)
      
      // Then reset form after closing
      setTimeout(() => {
        setCreateFormData({
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          status: 'planning',
          projectId: 0
        })
        refetch()
        alert('Sprint criada com sucesso!')
      }, 100)
    } catch (error) {
      console.error('Erro ao criar sprint:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      alert(`Erro ao criar sprint: ${errorMessage}`)
    } finally {
      setIsCreating(false)
    }
  }, [createFormData, refetch])

  const handleEditSprint = useCallback(async () => {
    if (!selectedSprint) return

    setIsCreating(true)
    try {
      // Create a copy of the data to avoid any state references causing issues
      const formDataToSend = { ...editFormData };
      await apiClient.updateSprint(selectedSprint.id, formDataToSend)
      
      // First close dialog
      setIsEditDialogOpen(false)
      
      // Then reset state after closing
      setTimeout(() => {
        setSelectedSprint(null)
        setEditFormData({
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          status: 'planning',
          projectId: 0
        })
        refetch()
        alert('Sprint atualizada com sucesso!')
      }, 100)
    } catch (error) {
      console.error('Erro ao editar sprint:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      alert(`Erro ao editar sprint: ${errorMessage}`)
    } finally {
      setIsCreating(false)
    }
  }, [selectedSprint, editFormData, refetch])

  const handleDeleteSprint = useCallback(async (sprintId: number) => {
    try {
      await apiClient.deleteSprint(sprintId)
      setSprintToDelete(null) // Clear state after operation
      refetch()
      alert('Sprint excluída com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar sprint:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      alert(`Erro ao deletar sprint: ${errorMessage}`)
    }
  }, [refetch])

  const openEditDialog = useCallback((sprint: Sprint) => {
    // First set form data
    setEditFormData({
      name: sprint.name,
      description: sprint.description,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      status: sprint.status,
      projectId: sprint.projectId
    })
    
    // Then set selected sprint
    setSelectedSprint(sprint)
    
    // Finally open dialog
    setIsEditDialogOpen(true)
  }, [])

  const getStatusColor = (status: 'planning' | 'in_progress' | 'ended') => {
    switch (status) {
      case "ended":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "planning":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: 'planning' | 'in_progress' | 'ended') => {
    switch (status) {
      case "ended":
        return "Concluída"
      case "in_progress":
        return "Em Andamento"
      case "planning":
        return "Planejamento"
      default:
        return status
    }
  }

  const calculateProgress = (tasks: Task[]) => {
    if (!tasks || tasks.length === 0) return 0
    const completedTasks = tasks.filter(task => task.status === 'done').length
    return Math.round((completedTasks / tasks.length) * 100)
  }

  const getDaysRemaining = (endDate: string) => {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredSprints = useMemo(() => {
    return sprints?.filter(
      (sprint) =>
        sprint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sprint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (projectsMap[sprint.projectId]?.name || '').toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []
  }, [sprints, searchTerm, projectsMap])

  if (loading) {
    return (
      <ProtectedPage>
        <div className="flex h-screen bg-gray-50">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Carregando sprints...</p>
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
              <p className="text-red-600 mb-4">Erro ao carregar sprints: {error}</p>
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
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Minhas Sprints</h1>
                  <p className="text-gray-600 mt-2">Gerencie suas sprints e acompanhe o progresso</p>
                  {user && (
                    <p className="text-sm text-blue-600 mt-1">
                      Exibindo sprints dos seus projetos
                    </p>
                  )}
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Sprint
              </Button>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar sprints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>

              {/* Sprints Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSprints.map((sprint) => {
                  const tasks = sprintTasks[sprint.id] || []
                  const progress = calculateProgress(tasks)
                  const completedTasks = tasks.filter(task => task.status === 'done').length
                  const project = projectsMap[sprint.projectId]
                  
                  return (
                    <Card key={sprint.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="h-5 w-5 text-blue-600" />
                              <CardTitle className="text-lg">{sprint.name}</CardTitle>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {project ? project.name : `Projeto ${sprint.projectId}`}
                            </div>
                            <CardDescription>{sprint.description}</CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(sprint.status)}>
                              {getStatusLabel(sprint.status)}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => console.log('Ver sprint', sprint.id)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  openEditDialog(sprint);
                                }}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSprintToDelete(sprint);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Progress */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progresso Geral</span>
                              <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>

                          {/* Tasks Summary */}
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium">Tarefas</span>
                            </div>
                            <span className="text-sm">
                              {completedTasks} de {tasks.length} concluídas
                            </span>
                          </div>

                          {/* Timeline */}
                          <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              <span>
                                {new Date(sprint.startDate).toLocaleDateString("pt-BR")} -{" "}
                                {new Date(sprint.endDate).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                            {sprint.status !== "ended" && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {getDaysRemaining(sprint.endDate) > 0
                                    ? `${getDaysRemaining(sprint.endDate)} dias restantes`
                                    : "Prazo vencido"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {filteredSprints.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {searchTerm ? "Nenhuma sprint encontrada com esse termo" : "Você ainda não criou nenhuma sprint"}
                  </p>
                  <p className="text-gray-400 mt-2">
                    {searchTerm ? "Tente ajustar sua busca" : "Crie sua primeira sprint para organizar suas tarefas"}
                  </p>
                  {!searchTerm && projects && projects.length > 0 && (
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeira Sprint
                    </Button>
                  )}
                  {!searchTerm && (!projects || projects.length === 0) && (
                    <p className="text-sm text-gray-500 mt-4">
                      Você precisa criar um projeto primeiro antes de criar sprints
                    </p>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>

      </div>

      {/* Create Sprint Modal */}
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open);
        if (!open) {
          // Reset the form data when dialog closes
          setCreateFormData({
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            status: 'planning',
            projectId: 0
          });
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Nova Sprint</DialogTitle>
            <DialogDescription>Preencha as informações da nova sprint</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sprint-name">Nome da Sprint</Label>
              <Input 
                id="sprint-name" 
                placeholder="Digite o nome da sprint" 
                value={createFormData.name}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project">Projeto</Label>
              <Select 
                value={createFormData.projectId ? createFormData.projectId.toString() : ""} 
                onValueChange={(value) => setCreateFormData(prev => ({ ...prev, projectId: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o projeto" />
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
            <div className="grid gap-2">
              <Label htmlFor="sprint-description">Descrição</Label>
              <Textarea 
                id="sprint-description" 
                placeholder="Descreva os objetivos da sprint" 
                value={createFormData.description}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-date">Data de Início</Label>
                <Input 
                  id="start-date" 
                  type="date" 
                  value={createFormData.startDate}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-date">Data de Fim</Label>
                <Input 
                  id="end-date" 
                  type="date" 
                  value={createFormData.endDate}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={createFormData.status} 
                onValueChange={(value: 'planning' | 'in_progress' | 'ended') => 
                  setCreateFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planejamento</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="ended">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleCreateSprint}
              disabled={isCreating}
            >
              {isCreating ? 'Criando...' : 'Criar Sprint'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!sprintToDelete} onOpenChange={(open) => !open && setSprintToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a sprint "{sprintToDelete?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSprintToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (sprintToDelete) {
                  handleDeleteSprint(sprintToDelete.id)
                  setSprintToDelete(null)
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Sprint Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          // Reset the form data when dialog closes
          setSelectedSprint(null);
          setEditFormData({
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            status: 'planning',
            projectId: 0
          });
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Sprint</DialogTitle>
            <DialogDescription>Atualize as informações da sprint</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-sprint-name">Nome da Sprint</Label>
              <Input 
                id="edit-sprint-name" 
                placeholder="Digite o nome da sprint" 
                value={editFormData.name}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-project">Projeto</Label>
              <Select 
                value={editFormData.projectId ? editFormData.projectId.toString() : ""} 
                onValueChange={(value) => setEditFormData(prev => ({ ...prev, projectId: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o projeto" />
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
            <div className="grid gap-2">
              <Label htmlFor="edit-sprint-description">Descrição</Label>
              <Textarea 
                id="edit-sprint-description" 
                placeholder="Descreva os objetivos da sprint" 
                value={editFormData.description}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-start-date">Data de Início</Label>
                <Input 
                  id="edit-start-date" 
                  type="date" 
                  value={editFormData.startDate}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-end-date">Data de Fim</Label>
                <Input 
                  id="edit-end-date" 
                  type="date" 
                  value={editFormData.endDate}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select 
                value={editFormData.status} 
                onValueChange={(value: 'planning' | 'in_progress' | 'ended') => 
                  setEditFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planejamento</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="ended">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleEditSprint}
              disabled={isCreating}
            >
              {isCreating ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedPage>
  )
}
