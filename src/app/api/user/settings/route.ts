import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { userSettingsSchema } from '@/schemas'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        companyName: true,
        twilioAccountSid: true,
        twilioAuthToken: true,
        twilioWhatsappNumber: true,
        twilioSandboxKeyword: true,
        openaiApiKey: true,
        aiPrompt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)

  } catch (error) {
    console.error('Erro ao carregar configurações:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('❌ Usuário não autorizado')
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    console.log('✅ Usuário autorizado:', session.user.id)
    const body = await req.json()
    console.log('📝 Dados recebidos:', JSON.stringify(body, null, 2))
    
    // Validar dados
    const validatedData = userSettingsSchema.parse(body)
    console.log('✅ Dados validados:', JSON.stringify(validatedData, null, 2))
    
    // Atualizar usuário
    console.log('💾 Salvando no banco de dados...')
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        companyName: validatedData.companyName,
        twilioAccountSid: validatedData.twilioAccountSid,
        twilioAuthToken: validatedData.twilioAuthToken,
        twilioWhatsappNumber: validatedData.twilioWhatsappNumber,
        twilioSandboxKeyword: validatedData.twilioSandboxKeyword,
        openaiApiKey: validatedData.openaiApiKey,
        aiPrompt: validatedData.aiPrompt
      },
      select: {
        id: true,
        companyName: true,
        twilioAccountSid: true,
        twilioWhatsappNumber: true,
        twilioSandboxKeyword: true,
        aiPrompt: true
      }
    })
    
    console.log('✅ Usuário atualizado:', updatedUser)
    return NextResponse.json({
      message: 'Configurações salvas com sucesso',
      user: updatedUser
    })
    
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Dados inválidos' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 