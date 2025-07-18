import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
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

    const body = await req.json()
    const { status, notes, value, name, email } = body

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
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(value !== undefined && { value }),
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email })
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

    return NextResponse.json(updatedLead)

  } catch (error) {
    console.error('Erro ao atualizar lead:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 