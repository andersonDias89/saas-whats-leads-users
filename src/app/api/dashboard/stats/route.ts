import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        leads: true,
        conversations: true,
        messages: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Calcular estatísticas
    const totalLeads = user.leads.length
    const totalConversations = user.conversations.length
    const activeConversations = user.conversations.filter(conv => conv.status === 'active').length
    const unreadMessages = user.messages.filter(msg => msg.status === 'sent').length // Simplificado

    return NextResponse.json({
      totalLeads,
      totalConversations,
      activeConversations,
      unreadMessages,
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 