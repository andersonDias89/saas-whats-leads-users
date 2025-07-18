'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BarChart3,
  MessageCircle,
  Users,
  HelpCircle,
  Settings,
  User,
  LogOut,
  Phone,
  Mail
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface SidebarStats {
  totalLeads: number
  activeConversations: number
  unreadMessages: number
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Conversas', href: '/dashboard/conversations', icon: MessageCircle },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [stats, setStats] = useState<SidebarStats>({
    totalLeads: 0,
    activeConversations: 0,
    unreadMessages: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      }
    }

    fetchStats()
  }, [])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="flex h-full w-64 flex-col bg-background-secondary border-r border-border">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="ml-2 text-xl font-bold text-foreground">WhatsLeads</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start h-10 px-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary border-r-2 border-primary'
                    : 'text-foreground-secondary hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
                {/* Badges para estatísticas */}
                {item.name === 'Leads' && stats.totalLeads > 0 && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {stats.totalLeads}
                  </Badge>
                )}
                {item.name === 'Conversas' && stats.activeConversations > 0 && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {stats.activeConversations}
                  </Badge>
                )}
                {item.name === 'Message' && stats.unreadMessages > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    {stats.unreadMessages}
                  </Badge>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-border p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image || ''} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {session?.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {session?.user?.name || 'Usuário'}
            </p>
            <p className="text-xs text-foreground-muted truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground-muted">Leads</span>
            <span className="text-foreground font-medium">{stats.totalLeads}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground-muted">Conversas</span>
            <span className="text-foreground font-medium">{stats.activeConversations}</span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start h-9 px-3 text-sm text-foreground-secondary hover:bg-accent hover:text-accent-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  )
} 