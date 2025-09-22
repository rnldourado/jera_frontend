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
import { CalendarDays, Target, Plus, Search, Filter, Clock, CheckCircle2 } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { ProtectedPage } from "@/components/protected-page"

export default function SprintsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const sprints = [
    {
      id: 1,
      name: "Sprint 1 - Autenticação",
      project: "Sistema E-commerce",
      description: "Implementação do sistema de autenticação e autorização",
      status: "Em Andamento",
      progress: 80,
      startDate: "2024-01-15",
      endDate: "2024-01-29",
      totalTasks: 12,
      completedTasks: 10,
      team: [
        { name: "João Silva", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Maria Santos", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      velocity: 45,
      burndown: 85,
    },
    {
      id: 2,
      name: "Sprint 2 - Catálogo",
      project: "Sistema E-commerce",
      description: "Desenvolvimento do catálogo de produtos e carrinho de compras",
      status: "Planejamento",
      progress: 15,
      startDate: "2024-01-30",
      endDate: "2024-02-13",
      totalTasks: 15,
      completedTasks: 2,
      team: [
        { name: "Pedro Costa", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Ana Lima", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      velocity: 0,
      burndown: 100,
    },
    {
      id: 3,
      name: "Sprint 1 - UI/UX",
      project: "App Mobile",
      description: "Design e implementação das telas principais do aplicativo",
      status: "Em Andamento",
      progress: 60,
      startDate: "2024-01-20",
      endDate: "2024-02-03",
      totalTasks: 10,
      completedTasks: 6,
      team: [
        { name: "Carlos Oliveira", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Fernanda Costa", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      velocity: 35,
      burndown: 60,
    },
    {
      id: 4,
      name: "Sprint Final - Testes",
      project: "Sistema CRM",
      description: "Testes finais e correções antes do lançamento",
      status: "Concluído",
      progress: 100,
      startDate: "2023-12-15",
      endDate: "2024-01-10",
      totalTasks: 8,
      completedTasks: 8,
      team: [
        { name: "Marcos Pereira", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Carla Rodrigues", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      velocity: 50,
      burndown: 0,
    },
  ]

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

  const getDaysRemaining = (endDate: string) => {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredSprints = sprints.filter(
    (sprint) =>
      sprint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sprint.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sprint.description.toLowerCase().includes(searchTerm.toLowerCase()),
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
                  <h1 className="text-3xl font-bold text-gray-900">Sprints</h1>
                  <p className="text-gray-600 mt-2">Gerencie suas sprints e acompanhe o progresso</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Sprint
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Sprint</DialogTitle>
                      <DialogDescription>Preencha as informações da nova sprint</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="sprint-name">Nome da Sprint</Label>
                        <Input id="sprint-name" placeholder="Digite o nome da sprint" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="project">Projeto</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o projeto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ecommerce">Sistema E-commerce</SelectItem>
                            <SelectItem value="mobile">App Mobile</SelectItem>
                            <SelectItem value="dashboard">Dashboard Analytics</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="sprint-description">Descrição</Label>
                        <Textarea id="sprint-description" placeholder="Descreva os objetivos da sprint" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="start-date">Data de Início</Label>
                          <Input id="start-date" type="date" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="end-date">Data de Fim</Label>
                          <Input id="end-date" type="date" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Criar Sprint</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                {filteredSprints.map((sprint) => (
                  <Card key={sprint.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-lg">{sprint.name}</CardTitle>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{sprint.project}</div>
                          <CardDescription>{sprint.description}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(sprint.status)}>{sprint.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progresso Geral</span>
                            <span>{sprint.progress}%</span>
                          </div>
                          <Progress value={sprint.progress} className="h-2" />
                        </div>

                        {/* Tasks Summary */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Tarefas</span>
                          </div>
                          <span className="text-sm">
                            {sprint.completedTasks} de {sprint.totalTasks} concluídas
                          </span>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">{sprint.velocity}</div>
                            <div className="text-xs text-gray-600">Velocity</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-lg font-bold text-orange-600">{sprint.burndown}%</div>
                            <div className="text-xs text-gray-600">Burndown</div>
                          </div>
                        </div>

                        {/* Team */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Equipe</span>
                          <div className="flex -space-x-2">
                            {sprint.team.map((member, index) => (
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
                          </div>
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
                          {sprint.status !== "Concluído" && (
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
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  )
}
