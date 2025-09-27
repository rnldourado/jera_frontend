"use client"

import { useState, useEffect } from "react"
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
import { CalendarDays, Users, Plus, Search, Filter, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { ProtectedPage } from "@/components/protected-page"
import { useProjects, useApi, useUserProjects } from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api"
import type { Project, CreateProjectRequest, Task } from "@/lib/types"
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

export default function ProjectsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [createFormData, setCreateFormData] = useState<CreateProjectRequest>({
    name: '',
    description: '',
    status: 'to do',
    startDate: '',
    deadline: '',
    creatorId: 1
  })

  const { user } = useAuth() || { user: null } // Fallback caso useAuth falhe
  const { data: projects, loading, error, refetch } = useUserProjects(user?.id || null)

  // Hook para buscar tarefas de cada projeto
  const [projectTasks, setProjectTasks] = useState<Record<number, Task[]>>({})

  useEffect(() => {
    if (projects && projects.length > 0) {
      // Buscar tarefas para cada projeto
      const loadProjectTasks = async () => {
        const tasksMap: Record<number, Task[]> = {}
        
        for (const project of projects) {
          try {
            const tasks = await apiClient.getTasksByProject(project.id)
            tasksMap[project.id] = tasks
          } catch (error) {
            console.error(`Erro ao carregar tarefas do projeto ${project.id}:`, error)
            tasksMap[project.id] = []
          }
        }
        
        setProjectTasks(tasksMap)
      }

      loadProjectTasks()
    }
  }, [projects])

  useEffect(() => {
    // Definir o creatorId, usando ID 1 como fallback se não houver usuário logado
    setCreateFormData(prev => ({ 
      ...prev, 
      creatorId: user?.id || 1 
    }))
  }, [user])

  const handleCreateProject = async () => {
    // Validações básicas
    if (!createFormData.name.trim()) {
      alert('Nome do projeto é obrigatório')
      return
    }
    
    if (!createFormData.description.trim()) {
      alert('Descrição do projeto é obrigatória')
      return
    }
    
    if (!createFormData.startDate) {
      alert('Data de início é obrigatória')
      return
    }
    
    if (!createFormData.deadline) {
      alert('Prazo final é obrigatório')
      return
    }

    // Se não há usuário logado, usar um ID padrão temporário
    const projectData = {
      ...createFormData,
      creatorId: user?.id || 1 // Usar ID 1 como fallback
    }

    setIsCreating(true)
    try {
      console.log('Enviando dados do projeto:', projectData)
      const newProject = await apiClient.createProject(projectData)
      console.log('Projeto criado com sucesso:', newProject)
      
      setIsCreateDialogOpen(false)
      setCreateFormData({
        name: '',
        description: '',
        status: 'to do',
        startDate: '',
        deadline: '',
        creatorId: user?.id || 1
      })
      refetch()
      alert('Projeto criado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      alert(`Erro ao criar projeto: ${errorMessage}`)
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditProject = async () => {
    if (!selectedProject) return

    try {
      await apiClient.updateProject(selectedProject.id, createFormData)
      setIsEditDialogOpen(false)
      setSelectedProject(null)
      refetch()
    } catch (error) {
      console.error('Erro ao editar projeto:', error)
      alert('Erro ao editar projeto. Tente novamente.')
    }
  }

  const handleDeleteProject = async (projectId: number) => {
    try {
      await apiClient.deleteProject(projectId)
      refetch()
    } catch (error) {
      console.error('Erro ao deletar projeto:', error)
      alert('Erro ao deletar projeto. Tente novamente.')
    }
  }

  const openEditDialog = (project: Project) => {
    setSelectedProject(project)
    setCreateFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      deadline: project.deadline,
      creatorId: project.creatorId
    })
    setIsEditDialogOpen(true)
  }

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
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: 'to do' | 'in progress' | 'done') => {
    switch (status) {
      case "done":
        return "Concluído"
      case "in progress":
        return "Em Andamento"
      case "to do":
        return "A Fazer"
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

  const calculateProgress = (tasks: Task[]) => {
    if (!tasks || tasks.length === 0) return 0
    const completedTasks = tasks.filter(task => task.status === 'done').length
    return Math.round((completedTasks / tasks.length) * 100)
  }

  const filteredProjects = projects?.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()),
  ) || []

  if (loading) {
    return (
      <ProtectedPage>
        <div className="flex h-screen bg-gray-50">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Carregando projetos...</p>
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
              <p className="text-red-600 mb-4">Erro ao carregar projetos: {error}</p>
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
                  <h1 className="text-3xl font-bold text-gray-900">Meus Projetos</h1>
                  <p className="text-gray-600 mt-2">Gerencie todos os seus projetos criados</p>
                  {user && (
                    <p className="text-sm text-blue-600 mt-1">
                      Exibindo projetos criados por {user.name || user.email}
                    </p>
                  )}
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Projeto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Criar Novo Projeto</DialogTitle>
                      <DialogDescription>Preencha as informações do novo projeto</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nome do Projeto</Label>
                        <Input 
                          id="name" 
                          placeholder="Digite o nome do projeto" 
                          value={createFormData.name}
                          onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Descreva o projeto" 
                          value={createFormData.description}
                          onChange={(e) => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="status">Status</Label>
                          <Select 
                            value={createFormData.status} 
                            onValueChange={(value: 'to do' | 'in progress' | 'done') => 
                              setCreateFormData(prev => ({ ...prev, status: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="to do">A Fazer</SelectItem>
                              <SelectItem value="in progress">Em Andamento</SelectItem>
                              <SelectItem value="done">Concluído</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="startDate">Data de Início</Label>
                          <Input 
                            id="startDate" 
                            type="date" 
                            value={createFormData.startDate}
                            onChange={(e) => setCreateFormData(prev => ({ ...prev, startDate: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="deadline">Prazo Final</Label>
                        <Input 
                          id="deadline" 
                          type="date" 
                          value={createFormData.deadline}
                          onChange={(e) => setCreateFormData(prev => ({ ...prev, deadline: e.target.value }))}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        onClick={handleCreateProject}
                        disabled={isCreating}
                      >
                        {isCreating ? 'Criando...' : 'Criar Projeto'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar projetos..."
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

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const tasks = projectTasks[project.id] || []
                  const progress = calculateProgress(tasks)
                  const completedTasks = tasks.filter(task => task.status === 'done').length
                  
                  return (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <CardDescription className="mt-2 line-clamp-2">{project.description}</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => console.log('Ver projeto', project.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(project)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o projeto "{project.name}"? 
                                      Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteProject(project.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Status */}
                          <div className="flex items-center justify-between">
                            <Badge className={getStatusColor(project.status)}>
                              {getStatusLabel(project.status)}
                            </Badge>
                          </div>

                          {/* Progress */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progresso</span>
                              <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="text-xs text-gray-500">
                              {completedTasks} de {tasks.length} tarefas concluídas
                            </div>
                          </div>

                          {/* Dates */}
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              <span>Início: {new Date(project.startDate).toLocaleDateString("pt-BR")}</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Prazo: {new Date(project.deadline).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {filteredProjects.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {searchTerm ? "Nenhum projeto encontrado com esse termo" : "Você ainda não criou nenhum projeto"}
                  </p>
                  <p className="text-gray-400 mt-2">
                    {searchTerm ? "Tente ajustar sua busca" : "Crie seu primeiro projeto para começar a organizar seu trabalho"}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Projeto
                    </Button>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Projeto</DialogTitle>
              <DialogDescription>Atualize as informações do projeto</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nome do Projeto</Label>
                <Input 
                  id="edit-name" 
                  placeholder="Digite o nome do projeto" 
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea 
                  id="edit-description" 
                  placeholder="Descreva o projeto" 
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={createFormData.status} 
                    onValueChange={(value: 'to do' | 'in progress' | 'done') => 
                      setCreateFormData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to do">A Fazer</SelectItem>
                      <SelectItem value="in progress">Em Andamento</SelectItem>
                      <SelectItem value="done">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-startDate">Data de Início</Label>
                  <Input 
                    id="edit-startDate" 
                    type="date" 
                    value={createFormData.startDate}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-deadline">Prazo Final</Label>
                <Input 
                  id="edit-deadline" 
                  type="date" 
                  value={createFormData.deadline}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditProject}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedPage>
  )
}
