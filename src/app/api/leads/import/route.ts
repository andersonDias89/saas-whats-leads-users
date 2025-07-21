import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LeadsService } from '@/services/leads'
import { importLeadsSchema } from '@/schemas/leads'

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
    const validatedData = importLeadsSchema.parse(body)
    
    const result = await LeadsService.importLeads(session.user.id, validatedData)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Erro ao importar leads:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 