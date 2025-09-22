"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Bell, Shield, Palette, Database } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { ProtectedPage } from "@/components/protected-page"

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    desktop: true,
    weekly: true,
  })

  return (
    <ProtectedPage>
      <div className="flex h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
                <p className="text-gray-600 mt-2">Gerencie as configurações da sua conta e da plataforma</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Settings Navigation */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Configurações</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <nav className="space-y-1">
                        <a
                          href="#profile"
                          className="flex items-center gap-3 px-6 py-3 text-sm font-medium bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        >
                          <User className="h-4 w-4" />
                          Perfil
                        </a>
                        <a
                          href="#notifications"
                          className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                          <Bell className="h-4 w-4" />
                          Notificações
                        </a>
                        <a
                          href="#security"
                          className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                          <Shield className="h-4 w-4" />
                          Segurança
                        </a>
                        <a
                          href="#appearance"
                          className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                          <Palette className="h-4 w-4" />
                          Aparência
                        </a>
                        <a
                          href="#integrations"
                          className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                          <Database className="h-4 w-4" />
                          Integrações
                        </a>
                      </nav>
                    </CardContent>
                  </Card>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Profile Settings */}
                  <Card id="profile">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Perfil
                      </CardTitle>
                      <CardDescription>Atualize suas informações pessoais e de contato</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src="/placeholder.svg?height=80&width=80" />
                          <AvatarFallback className="text-lg">JS</AvatarFallback>
                        </Avatar>
                        <div>
                          <Button variant="outline">Alterar Foto</Button>
                          <p className="text-sm text-gray-500 mt-2">JPG, GIF ou PNG. Máximo 1MB.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Nome</Label>
                          <Input id="firstName" defaultValue="João" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Sobrenome</Label>
                          <Input id="lastName" defaultValue="Silva" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="joao.silva@empresa.com" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" defaultValue="+55 11 99999-0001" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" placeholder="Conte um pouco sobre você..." />
                      </div>

                      <Button>Salvar Alterações</Button>
                    </CardContent>
                  </Card>

                  {/* Notification Settings */}
                  <Card id="notifications">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notificações
                      </CardTitle>
                      <CardDescription>Configure como você deseja receber notificações</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Notificações por Email</Label>
                            <p className="text-sm text-gray-500">Receba atualizações por email</p>
                          </div>
                          <Switch
                            checked={notifications.email}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Notificações Push</Label>
                            <p className="text-sm text-gray-500">Receba notificações no navegador</p>
                          </div>
                          <Switch
                            checked={notifications.push}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Notificações Desktop</Label>
                            <p className="text-sm text-gray-500">Receba notificações na área de trabalho</p>
                          </div>
                          <Switch
                            checked={notifications.desktop}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, desktop: checked })}
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Relatório Semanal</Label>
                            <p className="text-sm text-gray-500">Receba um resumo semanal por email</p>
                          </div>
                          <Switch
                            checked={notifications.weekly}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, weekly: checked })}
                          />
                        </div>
                      </div>

                      <Button>Salvar Preferências</Button>
                    </CardContent>
                  </Card>

                  {/* Security Settings */}
                  <Card id="security">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Segurança
                      </CardTitle>
                      <CardDescription>Gerencie sua senha e configurações de segurança</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Senha Atual</Label>
                          <Input id="currentPassword" type="password" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">Nova Senha</Label>
                          <Input id="newPassword" type="password" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Autenticação de Dois Fatores</Label>
                            <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                          </div>
                          <Button variant="outline">Configurar</Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Sessões Ativas</Label>
                            <p className="text-sm text-gray-500">Gerencie onde você está logado</p>
                          </div>
                          <Button variant="outline">Ver Sessões</Button>
                        </div>
                      </div>

                      <Button>Alterar Senha</Button>
                    </CardContent>
                  </Card>

                  {/* Appearance Settings */}
                  <Card id="appearance">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Aparência
                      </CardTitle>
                      <CardDescription>Personalize a aparência da plataforma</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Tema</Label>
                          <Select defaultValue="light">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Claro</SelectItem>
                              <SelectItem value="dark">Escuro</SelectItem>
                              <SelectItem value="system">Sistema</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Idioma</Label>
                          <Select defaultValue="pt-br">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Español</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Fuso Horário</Label>
                          <Select defaultValue="america-sao-paulo">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="america-sao-paulo">América/São Paulo</SelectItem>
                              <SelectItem value="america-new-york">América/Nova York</SelectItem>
                              <SelectItem value="europe-london">Europa/Londres</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button>Salvar Configurações</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  )
}
