'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Ainda carregando
    
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-foreground-secondary">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Fixo - position: fixed, altura 100vh */}
      <div className="fixed left-0 top-0 h-screen z-50">
        <Sidebar />
      </div>
      
      {/* Área de Conteúdo com margem esquerda = largura do sidebar */}
      <div className="ml-64">
        {/* Conteúdo com scroll natural da página */}
        {children}
      </div>
    </div>
  )
} 