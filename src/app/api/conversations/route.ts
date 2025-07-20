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

    const conversations = await prisma.conversation.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        },
        leads: {
          select: {
            id: true,
            name: true,
            phone: true,
            status: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      }
    })

    // Mapear os dados para o formato esperado pelo frontend
    const mappedConversations = conversations.map(conversation => {
      // Pegar o nome do lead ou contactName da conversa
      const leadName = conversation.leads[0]?.name || conversation.contactName || 'Lead sem nome'
      
      return {
        id: conversation.id,
        phoneNumber: conversation.phoneNumber,
        leadName: leadName,
        lastMessage: conversation.lastMessage || '',
        lastMessageTime: conversation.lastMessageAt || conversation.createdAt,
        unreadCount: 0, // Por enquanto, não implementado
        status: conversation.status || 'active',
        messages: conversation.messages.map(message => ({
          id: message.id,
          content: message.content,
          direction: message.direction as 'inbound' | 'outbound',
          timestamp: message.createdAt
        }))
      }
    })

    return NextResponse.json(mappedConversations)

  } catch (error) {
    console.error('Erro ao buscar conversas:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 