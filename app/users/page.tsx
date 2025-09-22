"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users, Plus, Search, Filter, MoreHorizontal, Mail, Phone, Calendar } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { ProtectedPage } from "@/components/protected-page"

export default function UsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const users = [
    {
      id: 1,
      name: "João Silva",
      email: "joao.silva@empresa.com",
      role: "Desenvolvedor Full Stack",
      department: "Tecnologia",
      status: "Ativo",
      avatar: "/placeholder.svg?height=64&width=64",
      joinDate: "2023-01-15",
      projectsCount: 3,
      tasksCompleted: 45,
      phone: "+55 11 99999-0001",
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria.santos@empresa.com",
      role: "UI/UX Designer",
      department: "Design",
      status: "Ativo",
      avatar: "/placeholder.svg?height=64&width=64",
      joinDate: "2023-02-20",
      projectsCount: 2,
      tasksCompleted: 32,
      phone: "+55 11 99999-0002",
    },
    {
      id: 3,
      name: "Pedro Costa",
      email: "pedro.costa@empresa.com",
      role: "DevOps Engineer",
      department: "Tecnologia",
      status: "Ativo",
      avatar: "/placeholder.svg?height=64&width=64",
      joinDate: "2023-03-10",
      projectsCount: 4,
      tasksCompleted: 28,
      phone: "+55 11 99999-0003",
    },
    {
      id: 4,
      name: "Ana Lima",
      email: "ana.lima@empresa.com",
      role: "Product Manager",
      department: "Produto",
      status: "Ativo",
      avatar: "/placeholder.svg?height=64&width=64",
      joinDate: "2022-11-05",
      projectsCount: 5,
      tasksCompleted: 67,
      phone: "+55 11 99999-0004",
    },
    {
      id: 5,
      name: "Carlos Oliveira",
      email: "carlos.oliveira@empresa.com",
      role: "Desenvolvedor Mobile",
      department: "Tecnologia",
      status: "Férias",
      avatar: "/placeholder.svg?height=64&width=64",
      joinDate: "2023-04-12",
      projectsCount: 2,
      tasksCompleted: 19,
      phone: "+55 11 99999-0005",
    },
    {
      id: 6,
      name: "Fernanda Costa",
      email: "fernanda.costa@empresa.com",
      role: "QA Analyst",
      department: "Qualidade",
      status: "Ativo",
      avatar: "/placeholder.svg?height=64&width=64",
      joinDate: "2023-05-18",
      projectsCount: 3,
      tasksCompleted: 41,
      phone: "+55 11 99999-0006",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800"
      case "Inativo":
        return "bg-red-100 text-red-800"
      case "Férias":
        return "bg-yellow-100 text-yellow-800"
      case "Licença":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Tecnologia":
        return "bg-blue-100 text-blue-800"
      case "Design":
        return "bg-purple-100 text-purple-800"
      case "Produto":
        return "bg-green-100 text-green-800"
      case "Qualidade":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const userStats = {
    total: users.length,
    active: users.filter((u) => u.status === "Ativo").length,
    onLeave: users.filter((u) => u.status === "Férias" || u.status === "Licença").length,
    departments: [...new Set(users.map((u) => u.department))].length,
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
                  <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
                  <p className="text-gray-600 mt-2">Gerencie os usuários da sua equipe</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                      <DialogDescription>Preencha as informações do novo usuário</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="user-name">Nome Completo</Label>
                        <Input id="user-name" placeholder="Digite o nome completo" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="user-email">Email</Label>
                        <Input id="user-email" type="email" placeholder="email@empresa.com" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="user-phone">Telefone</Label>
                        <Input id="user-phone" placeholder="+55 11 99999-0000" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="user-role">Cargo</Label>
                          <Input id="user-role" placeholder="Ex: Desenvolvedor" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="user-department">Departamento</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tecnologia">Tecnologia</SelectItem>
                              <SelectItem value="design">Design</SelectItem>
                              <SelectItem value="produto">Produto</SelectItem>
                              <SelectItem value="qualidade">Qualidade</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Adicionar Usuário</Button>
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
                        <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                        <p className="text-2xl font-bold">{userStats.total}</p>
                      </div>
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                        <p className="text-2xl font-bold text-green-600">{userStats.active}</p>
                      </div>
                      <Users className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Em Licença/Férias</p>
                        <p className="text-2xl font-bold text-yellow-600">{userStats.onLeave}</p>
                      </div>
                      <Users className="h-8 w-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Departamentos</p>
                        <p className="text-2xl font-bold text-blue-600">{userStats.departments}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar usuários..."
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

              {/* Users Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-lg">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{user.name}</CardTitle>
                            <CardDescription className="mt-1">{user.role}</CardDescription>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Desativar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Status and Department */}
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                          <Badge className={getDepartmentColor(user.department)}>{user.department}</Badge>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{user.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Desde {new Date(user.joinDate).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{user.projectsCount}</div>
                            <div className="text-xs text-gray-600">Projetos</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{user.tasksCompleted}</div>
                            <div className="text-xs text-gray-600">Tarefas</div>
                          </div>
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
