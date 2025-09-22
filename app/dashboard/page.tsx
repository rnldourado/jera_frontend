"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, CheckCircle2, Clock, Users, FolderOpen, Target, TrendingUp } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { ProtectedPage } from "@/components/protected-page"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const stats = [
    {
      title: "Projetos Ativos",
      value: "12",
      description: "+2 este mês",
      icon: FolderOpen,
      color: "text-blue-600",
    },
    {
      title: "Sprints em Andamento",
      value: "8",
      description: "3 finalizando esta semana",
      icon: Target,
      color: "text-green-600",
    },
    {
      title: "Atividades Pendentes",
      value: "47",
      description: "-12% desde ontem",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Taxa de Conclusão",
      value: "87%",
      description: "+5% este mês",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  const recentProjects = [
    {
      id: 1,
      name: "Sistema E-commerce",
      status: "Em Andamento",
      progress: 75,
      team: 5,
      deadline: "2024-02-15",
      priority: "Alta",
    },
    {
      id: 2,
      name: "App Mobile",
      status: "Em Andamento",
      progress: 45,
      team: 3,
      deadline: "2024-03-01",
      priority: "Média",
    },
    {
      id: 3,
      name: "Dashboard Analytics",
      status: "Planejamento",
      progress: 20,
      team: 4,
      deadline: "2024-02-28",
      priority: "Baixa",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      title: "Implementar autenticação",
      project: "Sistema E-commerce",
      assignee: "João Silva",
      status: "Concluída",
      priority: "Alta",
    },
    {
      id: 2,
      title: "Design da tela de login",
      project: "App Mobile",
      assignee: "Maria Santos",
      status: "Em Progresso",
      priority: "Média",
    },
    {
      id: 3,
      title: "Configurar banco de dados",
      project: "Dashboard Analytics",
      assignee: "Pedro Costa",
      status: "Pendente",
      priority: "Alta",
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
      case "Em Andamento":
        return "bg-blue-100 text-blue-800"
      case "Pendente":
        return "bg-gray-100 text-gray-800"
      case "Planejamento":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <ProtectedPage>
      <div className="flex h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Visão geral dos seus projetos e atividades</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5" />
                      Projetos Recentes
                    </CardTitle>
                    <CardDescription>Acompanhe o progresso dos seus projetos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentProjects.map((project) => (
                        <div key={project.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{project.name}</h3>
                            <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {project.team}
                              </span>
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                {new Date(project.deadline).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                            <Badge className={getPriorityColor(project.priority)}>{project.priority}</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progresso</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Atividades Recentes
                    </CardTitle>
                    <CardDescription>Últimas atividades da sua equipe</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{activity.title}</h3>
                              <p className="text-xs text-gray-600 mt-1">{activity.project}</p>
                            </div>
                            <Badge className={getPriorityColor(activity.priority)}>{activity.priority}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={`/placeholder-svg-icon.png?height=24&width=24`} />
                                <AvatarFallback className="text-xs">
                                  {activity.assignee
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">{activity.assignee}</span>
                            </div>
                            <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  )
}
