"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, FolderOpen, Target, CheckSquare, Users, Settings, Menu, X, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projetos", href: "/projects", icon: FolderOpen },
  { name: "Sprints", href: "/sprints", icon: Target },
  { name: "Atividades", href: "/tasks", icon: CheckSquare },
  { name: "Usuários", href: "/users", icon: Users },
  { name: "Configurações", href: "/settings", icon: Settings },
]

export function SidebarTest({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  // Dados de teste hardcoded
  const testUser = {
    id: 1,
    name: "João da Silva",
    username: "joao.silva",
    email: "joao.silva@example.com"
  }

  const displayUser = user || testUser

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      router.push("/login")
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
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setOpen(!open)} className="bg-white">
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-start h-16 px-6 border-b border-gray-200">
            <h1 className="text-2xl font-black text-gray-900">Jera</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                  {displayUser?.name ? getUserInitials(displayUser.name) : displayUser?.email ? displayUser.email.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {displayUser?.name || "Usuário"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {displayUser?.email || "email@example.com"}
                </p>
                <p className="text-xs text-blue-500 truncate">
                  Status: {user ? "Logado via Auth" : "Dados de Teste"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full text-gray-600 hover:text-red-600 hover:border-red-300 justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {open && <div className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  )
}
