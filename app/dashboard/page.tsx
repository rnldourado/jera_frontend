"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FolderOpen, Clock, Target } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { ProtectedPage } from "@/components/protected-page"
import { useProjects, useTasks, useSprints, useUserProjects, useUserTasks, useUserSprints } from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { user } = useAuth()
  const { data: projects, loading: projectsLoading } = useUserProjects(user?.id || null)
  const { data: tasks, loading: tasksLoading } = useUserTasks(user?.id || null)
  const { data: sprints, loading: sprintsLoading } = useUserSprints(user?.id || null)

  // Calculate stats from API data
  const activeProjects = projects?.filter((p) => p.status === "in progress").length || 0
  const activeTasks = tasks?.filter((t) => t.status === "in progress").length || 0
  const activeSprints = sprints?.filter((s) => s.status === "in_progress").length || 0

  // Get recent projects (last 2 projects)
  const recentProjects = projects?.slice(-2) || []

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "in progress":
        return { text: "In progress", color: "bg-yellow-100 text-yellow-800" }
      case "done":
        return { text: "Done", color: "bg-green-100 text-green-800" }
      case "to do":
        return { text: "To do", color: "bg-gray-100 text-gray-800" }
      default:
        return { text: status, color: "bg-gray-100 text-gray-800" }
    }
  }

  const stats = [
    {
      title: "Projetos ativos",
      value: projectsLoading ? "..." : activeProjects.toString(),
      icon: FolderOpen,
      iconColor: "text-gray-500",
    },
    {
      title: "Atividades em andamento",
      value: tasksLoading ? "..." : activeTasks.toString(),
      icon: Clock,
      iconColor: "text-red-500",
    },
    {
      title: "Sprints em andamento",
      value: sprintsLoading ? "..." : activeSprints.toString(),
      icon: Target,
      iconColor: "text-green-500",
    },
  ]

  return (
    <ProtectedPage>
      <div className="flex h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="p-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <Card key={index} className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">{stat.title}</span>
                        <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                      </div>
                      <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Projects */}
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <FolderOpen className="h-5 w-5 text-gray-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Projetos recentes</h2>
                  </div>

                  {projectsLoading ? (
                    <div className="text-center py-8 text-gray-500">Carregando projetos...</div>
                  ) : recentProjects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">Nenhum projeto encontrado</div>
                  ) : (
                    <div className="space-y-4">
                      {recentProjects.map((project) => {
                        const statusDisplay = getStatusDisplay(project.status)
                        return (
                          <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">{project.name}</span>
                            <Badge className={`${statusDisplay.color} border-0 font-medium`}>
                              {statusDisplay.text}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  )
}
