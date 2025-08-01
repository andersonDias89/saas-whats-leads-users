import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: id,
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
            status: true
          }
        }
      }
    })

    if (!conversation) {
      return NextResponse.json(
        { message: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    // Pegar o nome do lead ou contactName da conversa
    const leadName = conversation.leads[0]?.name || conversation.contactName || 'Lead sem nome'
    
    // Mapear dados para o formato esperado
    const mappedConversation = {
      id: conversation.id,
      phoneNumber: conversation.phoneNumber,
      leadName: leadName,
      lastMessage: conversation.lastMessage || '',
      lastMessageTime: conversation.lastMessageAt || conversation.createdAt,
      unreadCount: 0, // Por enquanto, não implementado
      status: conversation.status || 'active',
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      lead: conversation.leads[0] || null,
      messages: conversation.messages.map(message => ({
        id: message.id,
        content: message.content,
        direction: message.direction as 'inbound' | 'outbound',
        timestamp: message.createdAt,
        messageType: message.messageType,
        status: message.status
      }))
    }

    return NextResponse.json(mappedConversation)

  } catch (error) {
    console.error('Erro ao buscar conversa:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validar se apenas status foi enviado
    if (Object.keys(body).length !== 1 || !body.status) {
      return NextResponse.json(
        { message: 'Apenas o campo status pode ser alterado' },
        { status: 400 }
      )
    }

    // Verificar se a conversa pertence ao usuário
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    if (!existingConversation) {
      return NextResponse.json(
        { message: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    // Atualizar apenas o status da conversa
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: id
      },
      data: {
        status: body.status
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
            status: true
          }
        }
      }
    })

    // Pegar o nome do lead ou contactName da conversa
    const leadName = updatedConversation.leads[0]?.name || updatedConversation.contactName || 'Lead sem nome'
    
    // Mapear dados para o formato esperado
    const mappedConversation = {
      id: updatedConversation.id,
      phoneNumber: updatedConversation.phoneNumber,
      leadName: leadName,
      lastMessage: updatedConversation.lastMessage || '',
      lastMessageTime: updatedConversation.lastMessageAt || updatedConversation.createdAt,
      unreadCount: 0,
      status: updatedConversation.status || 'active',
      createdAt: updatedConversation.createdAt,
      updatedAt: updatedConversation.updatedAt,
      lead: updatedConversation.leads[0] || null,
      messages: updatedConversation.messages.map(message => ({
        id: message.id,
        content: message.content,
        direction: message.direction as 'inbound' | 'outbound',
        timestamp: message.createdAt,
        messageType: message.messageType,
        status: message.status
      }))
    }

    return NextResponse.json(mappedConversation)

  } catch (error) {
    console.error('Erro ao atualizar conversa:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se a conversa pertence ao usuário
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    if (!existingConversation) {
      return NextResponse.json(
        { message: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    // Exclusão em cascata usando transação
    await prisma.$transaction(async (tx) => {
      // Deletar mensagens primeiro
      await tx.message.deleteMany({
        where: {
          conversationId: id
        }
      })
      
      // Deletar a conversa
      await tx.conversation.delete({
        where: {
          id: id
        }
      })
    })

    return NextResponse.json(
      { message: 'Conversa deletada com sucesso' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erro ao deletar conversa:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 