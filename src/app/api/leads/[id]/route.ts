import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LeadsService } from '@/services/leads'

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

    const lead = await LeadsService.getLeadById(id, session.user.id)

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

    const updatedLead = await LeadsService.updateLead(id, session.user.id, {
      name: body.name,
      email: body.email,
      status: body.status,
      notes: body.notes
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

    const result = await LeadsService.deleteLead(id, session.user.id)

    return NextResponse.json(result, { status: 200 })

  } catch (error) {
    console.error('Erro ao deletar lead:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 