import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { conversationId, content } = body

    if (!conversationId || !content) {
      return NextResponse.json(
        { message: 'Campos obrigatórios: conversationId, content' },
        { status: 400 }
      )
    }

    // Verificar se a conversa pertence ao usuário
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: session.user.id
      }
    })

    if (!conversation) {
      return NextResponse.json(
        { message: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    // Criar mensagem
    const message = await prisma.message.create({
      data: {
        conversationId,
        userId: session.user.id,
        content: content.trim(),
        direction: 'outbound',
        messageType: 'text'
      },
      include: {
        conversation: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Atualizar última mensagem da conversa
    await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessage: content.trim(),
        lastMessageAt: new Date()
      }
    })

    return NextResponse.json(message)

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 