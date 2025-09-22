"use client"

import { useState } from "react"
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
import { CalendarDays, Users, Plus, Search, Filter, MoreHorizontal } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { ProtectedPage } from "@/components/protected-page"

export default function ProjectsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const projects = [
    {
      id: 1,
      name: "Sistema E-commerce",
      description: "Desenvolvimento de plataforma completa de e-commerce com painel administrativo",
      status: "Em Andamento",
      progress: 75,
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      priority: "Alta",
      team: [
        { name: "João Silva", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Maria Santos", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Pedro Costa", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      tasksTotal: 45,
      tasksCompleted: 34,
    },
    {
      id: 2,
      name: "App Mobile",
      description: "Aplicativo mobile para iOS e Android com funcionalidades de delivery",
      status: "Em Andamento",
      progress: 45,
      startDate: "2024-01-20",
      endDate: "2024-03-01",
      priority: "Média",
      team: [
        { name: "Ana Lima", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Carlos Oliveira", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      tasksTotal: 32,
      tasksCompleted: 14,
    },
    {
      id: 3,
      name: "Dashboard Analytics",
      description: "Dashboard para análise de dados e relatórios em tempo real",
      status: "Planejamento",
      progress: 20,
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      priority: "Baixa",
      team: [
        { name: "Roberto Silva", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Fernanda Costa", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Lucas Santos", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Juliana Lima", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      tasksTotal: 28,
      tasksCompleted: 6,
    },
    {
      id: 4,
      name: "Sistema CRM",
      description: "Customer Relationship Management para gestão de clientes e vendas",
      status: "Concluído",
      progress: 100,
      startDate: "2023-11-01",
      endDate: "2024-01-10",
      priority: "Alta",
      team: [
        { name: "Marcos Pereira", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Carla Rodrigues", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      tasksTotal: 52,
      tasksCompleted: 52,
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
      case "Concluído":
        return "bg-green-100 text-green-800"
      case "Em Andamento":
        return "bg-blue-100 text-blue-800"
      case "Planejamento":
        return "bg-purple-100 text-purple-800"
      case "Pausado":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <ProtectedPage>
      <div className="flex h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
                  <p className="text-gray-600 mt-2">Gerencie todos os seus projetos</p>
                </div>
                <Dialog>
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
                        <Input id="name" placeholder="Digite o nome do projeto" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea id="description" placeholder="Descreva o projeto" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="priority">Prioridade</Label>
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
                        <div className="grid gap-2">
                          <Label htmlFor="deadline">Prazo</Label>
                          <Input id="deadline" type="date" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Criar Projeto</Button>
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
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <CardDescription className="mt-2 line-clamp-2">{project.description}</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Status and Priority */}
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                          <Badge className={getPriorityColor(project.priority)}>{project.priority}</Badge>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progresso</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                          <div className="text-xs text-gray-500">
                            {project.tasksCompleted} de {project.tasksTotal} tarefas concluídas
                          </div>
                        </div>

                        {/* Team */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Equipe</span>
                          </div>
                          <div className="flex -space-x-2">
                            {project.team.slice(0, 3).map((member, index) => (
                              <Avatar key={index} className="h-6 w-6 border-2 border-white">
                                <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {project.team.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-gray-600">+{project.team.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            <span>Início: {new Date(project.startDate).toLocaleDateString("pt-BR")}</span>
                          </div>
                          <div>Fim: {new Date(project.endDate).toLocaleDateString("pt-BR")}</div>
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
