import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar todas as conversas com leads
    const conversations = await prisma.conversation.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        leads: true,
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    // Buscar todos os leads
    const leads = await prisma.lead.findMany({
      where: {
        userId: session.user.id
      }
    })

    return NextResponse.json({
      conversations,
      leads,
      totalConversations: conversations.length,
      totalLeads: leads.length
    })

  } catch (error) {
    console.error('Erro ao buscar dados de teste:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 