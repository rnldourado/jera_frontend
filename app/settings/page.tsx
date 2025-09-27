"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Lock, 
  Settings as SettingsIcon,
  Save,
  AlertCircle
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { ProtectedPage } from "@/components/protected-page"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Administrator } from "@/lib/types"

interface UserSettings {
  name: string
  username: string
  email: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface SystemSettings {
  notifications: {
    emailNotifications: boolean
    projectUpdates: boolean
    taskAssignments: boolean
    sprintChanges: boolean
  }
  preferences: {
    language: 'pt-BR' | 'en-US'
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
    timezone: string
  }
}

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()

  // States para diferentes seções
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: "",
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    notifications: {
      emailNotifications: true,
      projectUpdates: true,
      taskAssignments: true,
      sprintChanges: false
    },
    preferences: {
      language: 'pt-BR',
      dateFormat: 'DD/MM/YYYY',
      timezone: 'America/Sao_Paulo'
    }
  })

  const [userAdminData, setUserAdminData] = useState<Administrator | null>(null)

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    if (user) {
      setUserSettings(prev => ({
        ...prev,
        name: user.name || "",
        username: user.username || "",
        email: user.email || ""
      }))
      
      // Carregar configurações do localStorage
      loadSystemSettings()
      checkAdminStatus()
    }
  }, [user])

  const loadSystemSettings = () => {
    const savedSettings = localStorage.getItem('systemSettings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSystemSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
      }
    }
  }

  const checkAdminStatus = async () => {
    if (!user) return
    
    try {
      // Verificar se o usuário é admin
      const adminData = await apiClient.getAdministratorByUserId(user.id)
      setUserAdminData(adminData)
    } catch (error) {
      // Usuário não é admin, isso é normal
      setUserAdminData(null)
    }
  }

  const handleUserSettingsChange = (field: keyof UserSettings, value: string) => {
    setUserSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSystemSettingsChange = (section: keyof SystemSettings, field: string, value: any) => {
    setSystemSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const saveUserProfile = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const updateData: any = {
        name: userSettings.name,
        username: userSettings.username,
        email: userSettings.email
      }

      await apiClient.updateUser(user.id, updateData)
      
      // Atualizar contexto do usuário
      refreshUser()
      
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const changePassword = async () => {
    toast({
      title: "Funcionalidade Indisponível",
      description: "A alteração de senha será implementada em uma futura versão da API.",
      variant: "destructive"
    })
  }

  const saveSystemSettings = async () => {
    setIsLoading(true)
    try {
      // Salvar no localStorage (em produção, salvar no backend)
      localStorage.setItem('systemSettings', JSON.stringify(systemSettings))
      
      toast({
        title: "Sucesso",
        description: "Configurações do sistema salvas!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <ProtectedPage>
      <div className="flex h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <SettingsIcon className="h-8 w-8 text-gray-700" />
                  <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
                </div>
                <p className="text-gray-600">
                  Gerencie suas preferências e configurações da conta
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Perfil
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notificações
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Preferências
                  </TabsTrigger>
                </TabsList>

                {/* Perfil do Usuário */}
                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informações Pessoais
                      </CardTitle>
                      <CardDescription>
                        Atualize suas informações de perfil
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Avatar */}
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src="/placeholder.svg?height=80&width=80" />
                          <AvatarFallback className="bg-purple-100 text-purple-700 text-xl font-semibold">
                            {user?.name ? getUserInitials(user.name) : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Button variant="outline" size="sm" disabled>
                            Alterar Foto
                          </Button>
                          <p className="text-sm text-gray-500 mt-1">
                            Funcionalidade será implementada em breve
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Formulário de dados pessoais */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input
                            id="name"
                            value={userSettings.name}
                            onChange={(e) => handleUserSettingsChange('name', e.target.value)}
                            placeholder="Seu nome completo"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={userSettings.username}
                            onChange={(e) => handleUserSettingsChange('username', e.target.value)}
                            placeholder="Seu username"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="email">E-mail</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userSettings.email}
                            onChange={(e) => handleUserSettingsChange('email', e.target.value)}
                            placeholder="seu@email.com"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={saveUserProfile} disabled={isLoading}>
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? "Salvando..." : "Salvar Perfil"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Status de Admin */}
                  {userAdminData && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Status de Administrador
                        </CardTitle>
                        <CardDescription>
                          Suas permissões administrativas
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              {userAdminData.level}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              Status: {userAdminData.active ? "Ativo" : "Inativo"}
                            </span>
                          </div>
                          
                          {userAdminData.permissions && userAdminData.permissions.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Permissões:</p>
                              <div className="flex flex-wrap gap-2">
                                {userAdminData.permissions.map((permission: string) => (
                                  <Badge key={permission} variant="outline">
                                    {permission}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Alteração de Senha - Funcionalidade Limitada */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Segurança da Conta
                      </CardTitle>
                      <CardDescription>
                        Configurações de segurança (funcionalidades limitadas)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Alteração de senha:</strong> Esta funcionalidade será implementada em uma futura versão da API.
                          Por enquanto, entre em contato com o administrador do sistema para alterar sua senha.
                        </AlertDescription>
                      </Alert>

                      <div className="flex justify-end">
                        <Button onClick={changePassword} variant="outline" disabled>
                          <Lock className="h-4 w-4 mr-2" />
                          Alterar Senha
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notificações */}
                <TabsContent value="notifications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Preferências de Notificação
                      </CardTitle>
                      <CardDescription>
                        Configure como você deseja receber notificações
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="emailNotifications">Notificações por E-mail</Label>
                            <p className="text-sm text-gray-500">
                              Receber notificações gerais por e-mail
                            </p>
                          </div>
                          <Switch
                            id="emailNotifications"
                            checked={systemSettings.notifications.emailNotifications}
                            onCheckedChange={(checked) => 
                              handleSystemSettingsChange('notifications', 'emailNotifications', checked)
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="projectUpdates">Atualizações de Projetos</Label>
                            <p className="text-sm text-gray-500">
                              Notificações sobre mudanças em projetos
                            </p>
                          </div>
                          <Switch
                            id="projectUpdates"
                            checked={systemSettings.notifications.projectUpdates}
                            onCheckedChange={(checked) => 
                              handleSystemSettingsChange('notifications', 'projectUpdates', checked)
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="taskAssignments">Atribuições de Tarefas</Label>
                            <p className="text-sm text-gray-500">
                              Notificações quando tarefas forem atribuídas a você
                            </p>
                          </div>
                          <Switch
                            id="taskAssignments"
                            checked={systemSettings.notifications.taskAssignments}
                            onCheckedChange={(checked) => 
                              handleSystemSettingsChange('notifications', 'taskAssignments', checked)
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="sprintChanges">Mudanças em Sprints</Label>
                            <p className="text-sm text-gray-500">
                              Notificações sobre alterações em sprints
                            </p>
                          </div>
                          <Switch
                            id="sprintChanges"
                            checked={systemSettings.notifications.sprintChanges}
                            onCheckedChange={(checked) => 
                              handleSystemSettingsChange('notifications', 'sprintChanges', checked)
                            }
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={saveSystemSettings} disabled={isLoading}>
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? "Salvando..." : "Salvar Preferências"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Preferências */}
                <TabsContent value="preferences" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Preferências do Sistema
                      </CardTitle>
                      <CardDescription>
                        Personalize a aparência e comportamento do sistema (salvo localmente)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="language">Idioma</Label>
                          <Select
                            value={systemSettings.preferences.language}
                            onValueChange={(value) => 
                              handleSystemSettingsChange('preferences', 'language', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um idioma" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                              <SelectItem value="en-US">English (US)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dateFormat">Formato de Data</Label>
                          <Select
                            value={systemSettings.preferences.dateFormat}
                            onValueChange={(value) => 
                              handleSystemSettingsChange('preferences', 'dateFormat', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um formato" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="timezone">Fuso Horário</Label>
                          <Select
                            value={systemSettings.preferences.timezone}
                            onValueChange={(value) => 
                              handleSystemSettingsChange('preferences', 'timezone', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um fuso horário" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                              <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                              <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                              <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Nota:</strong> Essas configurações são salvas localmente no seu navegador. 
                          A funcionalidade de tema será implementada em uma futura versão.
                        </AlertDescription>
                      </Alert>

                      <div className="flex justify-end">
                        <Button onClick={saveSystemSettings} disabled={isLoading}>
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? "Salvando..." : "Salvar Preferências"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Informações da Sessão */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações da Sessão</CardTitle>
                      <CardDescription>
                        Detalhes sobre sua sessão atual
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Data de Login</Label>
                          <p className="text-sm text-gray-600">
                            {new Date().toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Último Acesso</Label>
                          <p className="text-sm text-gray-600">
                            {new Date().toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  )
}
