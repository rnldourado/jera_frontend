"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Users as UsersIcon,
  User as UserIcon,
  Eye,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Sidebar } from "@/components/sidebar"
import { ProtectedPage } from "@/components/protected-page"
import { useUsers } from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api"
import { User, CreateUserRequest } from "@/lib/types"

interface UserFormData {
  name: string
  username: string
  email: string
  password: string
}

export default function UsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    username: "",
    email: "",
    password: ""
  })

  const { user: currentUser } = useAuth()
  const { data: users, loading, error, refetch } = useUsers()

  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      email: "",
      password: ""
    })
    setSelectedUser(null)
  }

  const handleCreateUser = async () => {
    if (!formData.name.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    setIsCreating(true)
    try {
      const userData: CreateUserRequest = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password
      }

      await apiClient.createUser(userData)
      
      setIsCreateModalOpen(false)
      resetForm()
      refetch()
      alert("Usuário criado com sucesso!")
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error)
      const errorMessage = error.response?.data?.message || error.message || "Erro desconhecido"
      alert(`Erro ao criar usuário: ${errorMessage}`)
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditUser = async () => {
    if (!selectedUser || !formData.name.trim() || !formData.username.trim() || !formData.email.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    setIsEditing(true)
    try {
      const userData = {
        name: formData.name,
        username: formData.username,
        email: formData.email
      }

      await apiClient.updateUser(selectedUser.id, userData)
      
      resetForm()
      refetch()
      alert("Usuário atualizado com sucesso!")
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error)
      const errorMessage = error.response?.data?.message || error.message || "Erro desconhecido"
      alert(`Erro ao atualizar usuário: ${errorMessage}`)
    } finally {
      setIsEditing(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (userId === currentUser?.id) {
      alert("Você não pode excluir sua própria conta!")
      return
    }

    setIsDeleting(true)
    try {
      await apiClient.deleteUser(userId)
      refetch()
      alert("Usuário excluído com sucesso!")
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error)
      const errorMessage = error.response?.data?.message || error.message || "Erro desconhecido"
      alert(`Erro ao excluir usuário: ${errorMessage}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  }) || []

  const userStats = {
    total: users?.length || 0,
    active: users?.length || 0,
  }

  if (loading) {
    return (
      <ProtectedPage>
        <div className="flex h-screen bg-gray-50">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Carregando usuários...</p>
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
              <p className="text-red-600 mb-4">Erro ao carregar usuários: {error}</p>
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
                  <h1 className="text-2xl font-semibold text-gray-900">Usuários</h1>
                  <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Usuário
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Criar Novo Usuário</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Digite o nome completo"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="username">Nome de Usuário</Label>
                          <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="Digite o nome de usuário"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="email@exemplo.com"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="password">Senha</Label>
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Digite a senha"
                            required
                          />
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
                        <Button onClick={handleCreateUser} disabled={isCreating}>
                          {isCreating ? "Criando..." : "Criar"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total de Usuários</p>
                          <p className="text-2xl font-bold">{userStats.total}</p>
                        </div>
                        <UsersIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Usuários Ativos</p>
                          <p className="text-2xl font-bold text-green-600">{userStats.active}</p>
                        </div>
                        <UsersIcon className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Search */}
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
                    Mais Filtros
                  </Button>
                </div>

                {/* Users List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src="/placeholder-user.jpg" />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{user.name}</h3>
                              <p className="text-sm text-gray-500">@{user.username}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <UserIcon className="h-4 w-4" />
                            <span>ID: {user.id}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setFormData({
                                    name: user.name,
                                    username: user.username,
                                    email: user.email,
                                    password: ""
                                  })
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Editar Usuário</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="edit-name">Nome Completo</Label>
                                  <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Digite o nome completo"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-username">Nome de Usuário</Label>
                                  <Input
                                    id="edit-username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Digite o nome de usuário"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-email">Email</Label>
                                  <Input
                                    id="edit-email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@exemplo.com"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2 mt-6">
                                <Button variant="outline" onClick={resetForm}>Cancelar</Button>
                                <Button onClick={handleEditUser} disabled={isEditing}>
                                  {isEditing ? "Salvando..." : "Salvar"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                disabled={user.id === currentUser?.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o usuário "{user.name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  disabled={isDeleting}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {isDeleting ? "Excluindo..." : "Excluir"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredUsers.length === 0 && (
                    <div className="col-span-full">
                      <Card>
                        <CardContent className="p-8 text-center">
                          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Nenhum usuário encontrado
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {searchTerm
                              ? "Tente ajustar os termos de busca."
                              : "Crie seu primeiro usuário para começar."}
                          </p>
                          {!searchTerm && (
                            <Button onClick={() => setIsCreateModalOpen(true)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Criar Primeiro Usuário
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  )
}
