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

    const lead = await prisma.lead.findFirst({
      where: {
        id: id,
        userId: session.user.id
      },
      include: {
        conversation: {
          select: {
            id: true,
            lastMessage: true,
            lastMessageAt: true,
            messages: {
              select: {
                id: true
              }
            }
          }
        }
      }
    })

    if (!lead) {
      return NextResponse.json(
        { message: 'Lead não encontrado' },
        { status: 404 }
      )
    }

    // Mapear dados para o formato esperado
    const mappedLead = {
      ...lead,
      conversation: lead.conversation ? {
        id: lead.conversation.id,
        lastMessage: lead.conversation.lastMessage,
        lastMessageAt: lead.conversation.lastMessageAt,
        messagesCount: lead.conversation.messages.length
      } : null
    }

    return NextResponse.json(mappedLead)

  } catch (error) {
    console.error('Erro ao buscar lead:', error)
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

    // Verificar se o lead pertence ao usuário
    const existingLead = await prisma.lead.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    if (!existingLead) {
      return NextResponse.json(
        { message: 'Lead não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar lead
    const updatedLead = await prisma.lead.update({
      where: {
        id: id
      },
      data: {
        name: body.name,
        email: body.email,
        status: body.status,
        notes: body.notes
      },
      include: {
        conversation: {
          select: {
            id: true,
            lastMessage: true,
            lastMessageAt: true,
            messages: {
              select: {
                id: true
              }
            }
          }
        }
      }
    })

    // Mapear dados para o formato esperado
    const mappedLead = {
      ...updatedLead,
      conversation: updatedLead.conversation ? {
        id: updatedLead.conversation.id,
        lastMessage: updatedLead.conversation.lastMessage,
        lastMessageAt: updatedLead.conversation.lastMessageAt,
        messagesCount: updatedLead.conversation.messages.length
      } : null
    }

    return NextResponse.json(mappedLead)

  } catch (error) {
    console.error('Erro ao atualizar lead:', error)
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

    // Verificar se o lead pertence ao usuário
    const existingLead = await prisma.lead.findFirst({
      where: {
        id: id,
        userId: session.user.id
      },
      include: {
        conversation: {
          include: {
            messages: true
          }
        }
      }
    })

    if (!existingLead) {
      return NextResponse.json(
        { message: 'Lead não encontrado' },
        { status: 404 }
      )
    }

    // Exclusão em cascata usando transação
    await prisma.$transaction(async (tx) => {
      // Se o lead tem uma conversa vinculada, deletar mensagens primeiro
      if (existingLead.conversation) {
        // Deletar mensagens da conversa
        await tx.message.deleteMany({
          where: {
            conversationId: existingLead.conversation.id
          }
        })
        
        // Deletar a conversa
        await tx.conversation.delete({
          where: {
            id: existingLead.conversation.id
          }
        })
      }
      
      // Deletar o lead
      await tx.lead.delete({
        where: {
          id: id
        }
      })
    })

    return NextResponse.json(
      { message: 'Lead e conversas vinculadas deletados com sucesso' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erro ao deletar lead:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 