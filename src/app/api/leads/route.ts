import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LeadsService } from '@/services/leads'
import { createLeadSchema } from '@/schemas/leads'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const leads = await LeadsService.getLeadsByUserId(session.user.id)

    return NextResponse.json(leads)

  } catch (error) {
    console.error('Erro ao buscar leads:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validar dados de entrada
    const validatedData = createLeadSchema.parse(body)
    
    const lead = await LeadsService.createLead(session.user.id, validatedData)

    return NextResponse.json(lead, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar lead:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Já existe um lead com este telefone') {
        return NextResponse.json(
          { message: error.message },
          { status: 409 }
        )
      }
    }
    
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 