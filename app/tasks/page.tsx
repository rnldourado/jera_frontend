"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CheckSquare, Plus, Search, Filter, MoreHorizontal, Calendar, Flag } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { ProtectedPage } from "@/components/protected-page"

export default function TasksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const tasks = [
    {
      id: 1,
      title: "Implementar autenticação JWT",
      description: "Criar sistema de autenticação usando JWT tokens com refresh token",
      status: "Em Progresso",
      priority: "Alta",
      project: "Sistema E-commerce",
      sprint: "Sprint 1 - Autenticação",
      assignee: {
        name: "João Silva",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      dueDate: "2024-01-25",
      createdDate: "2024-01-15",
      estimatedHours: 8,
      loggedHours: 5,
    },
    {
      id: 2,
      title: "Design da tela de login",
      description: "Criar mockups e implementar a interface da tela de login responsiva",
      status: "Concluída",
      priority: "Média",
      project: "App Mobile",
      sprint: "Sprint 1 - UI/UX",
      assignee: {
        name: "Maria Santos",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      dueDate: "2024-01-20",
      createdDate: "2024-01-10",
      estimatedHours: 6,
      loggedHours: 6,
    },
    {
      id: 3,
      title: "Configurar banco de dados",
      description: "Configurar PostgreSQL e criar migrations iniciais",
      status: "Pendente",
      priority: "Alta",
      project: "Dashboard Analytics",
      sprint: "Sprint 1 - Infraestrutura",
      assignee: {
        name: "Pedro Costa",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      dueDate: "2024-01-30",
      createdDate: "2024-01-18",
      estimatedHours: 4,
      loggedHours: 0,
    },
    {
      id: 4,
      title: "Implementar carrinho de compras",
      description: "Desenvolver funcionalidade completa do carrinho com persistência",
      status: "Em Progresso",
      priority: "Média",
      project: "Sistema E-commerce",
      sprint: "Sprint 2 - Catálogo",
      assignee: {
        name: "Ana Lima",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      dueDate: "2024-02-05",
      createdDate: "2024-01-20",
      estimatedHours: 12,
      loggedHours: 3,
    },
    {
      id: 5,
      title: "Testes unitários da API",
      description: "Criar testes unitários para todos os endpoints da API",
      status: "Pendente",
      priority: "Baixa",
      project: "Sistema E-commerce",
      sprint: "Sprint 1 - Autenticação",
      assignee: {
        name: "Carlos Oliveira",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      dueDate: "2024-01-28",
      createdDate: "2024-01-16",
      estimatedHours: 10,
      loggedHours: 0,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800"
      case "Média":
        return "bg-yellow-100 text-yellow-800"
      case "Baixa":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "bg-green-100 text-green-800"
      case "Em Progresso":
        return "bg-blue-100 text-blue-800"
      case "Pendente":
        return "bg-gray-100 text-gray-800"
      case "Bloqueada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || task.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "Concluída").length,
    inProgress: tasks.filter((t) => t.status === "Em Progresso").length,
    pending: tasks.filter((t) => t.status === "Pendente").length,
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
                  <h1 className="text-3xl font-bold text-gray-900">Atividades</h1>
                  <p className="text-gray-600 mt-2">Gerencie todas as atividades dos seus projetos</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Atividade
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Atividade</DialogTitle>
                      <DialogDescription>Preencha as informações da nova atividade</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="task-title">Título</Label>
                        <Input id="task-title" placeholder="Digite o título da atividade" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="task-description">Descrição</Label>
                        <Textarea id="task-description" placeholder="Descreva a atividade" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="task-project">Projeto</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ecommerce">Sistema E-commerce</SelectItem>
                              <SelectItem value="mobile">App Mobile</SelectItem>
                              <SelectItem value="dashboard">Dashboard Analytics</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="task-priority">Prioridade</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="alta">Alta</SelectItem>
                              <SelectItem value="media">Média</SelectItem>
                              <SelectItem value="baixa">Baixa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="task-assignee">Responsável</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="joao">João Silva</SelectItem>
                              <SelectItem value="maria">Maria Santos</SelectItem>
                              <SelectItem value="pedro">Pedro Costa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="task-due">Prazo</Label>
                          <Input id="task-due" type="date" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Criar Atividade</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total</p>
                        <p className="text-2xl font-bold">{taskStats.total}</p>
                      </div>
                      <CheckSquare className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Concluídas</p>
                        <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
                      </div>
                      <CheckSquare className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Em Progresso</p>
                        <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
                      </div>
                      <CheckSquare className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pendentes</p>
                        <p className="text-2xl font-bold text-gray-600">{taskStats.pending}</p>
                      </div>
                      <CheckSquare className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar atividades..."
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
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em Progresso">Em Progresso</SelectItem>
                    <SelectItem value="Concluída">Concluída</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Mais Filtros
                </Button>
              </div>

              {/* Tasks List */}
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{task.title}</h3>
                            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                            <Badge className={getPriorityColor(task.priority)}>
                              <Flag className="h-3 w-3 mr-1" />
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{task.description}</p>

                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Projeto:</span>
                              <span>{task.project}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Sprint:</span>
                              <span>{task.sprint}</span>
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Duplicar</DropdownMenuItem>
                            <DropdownMenuItem>Excluir</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {task.assignee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">{task.assignee.name}</span>
                          </div>

                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {getDaysUntilDue(task.dueDate) > 0
                                ? `${getDaysUntilDue(task.dueDate)} dias restantes`
                                : getDaysUntilDue(task.dueDate) === 0
                                  ? "Vence hoje"
                                  : "Atrasada"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            {task.loggedHours}h / {task.estimatedHours}h
                          </span>
                          <span>{new Date(task.dueDate).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  )
}
