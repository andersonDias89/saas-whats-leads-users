import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Twilio } from 'twilio'

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
    const { phoneNumber, message } = body

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { message: 'Campos obrigatórios: phoneNumber, message' },
        { status: 400 }
      )
    }

    // Buscar usuário e configurações
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        twilioAccountSid: true,
        twilioAuthToken: true,
        twilioWhatsappNumber: true
      }
    })

    if (!user?.twilioAccountSid || !user?.twilioAuthToken || !user?.twilioWhatsappNumber) {
      return NextResponse.json(
        { message: 'Configurações do Twilio não encontradas' },
        { status: 400 }
      )
    }

    // Enviar mensagem via Twilio
    const twilio = new Twilio(user.twilioAccountSid, user.twilioAuthToken)
    
    const twilioMessage = await twilio.messages.create({
      body: message,
      from: user.twilioWhatsappNumber,
      to: phoneNumber.startsWith('whatsapp:') ? phoneNumber : `whatsapp:${phoneNumber}`
    })

    console.log('✅ Mensagem enviada via Twilio:', twilioMessage.sid)

    // Encontrar ou criar conversa
    let conversation = await prisma.conversation.findFirst({
      where: {
        userId: user.id,
        phoneNumber: phoneNumber.startsWith('whatsapp:') ? phoneNumber : `whatsapp:${phoneNumber}`
      }
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          phoneNumber: phoneNumber.startsWith('whatsapp:') ? phoneNumber : `whatsapp:${phoneNumber}`,
          status: 'active'
        }
      })
    }

    // Salvar mensagem no banco
    const savedMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        userId: user.id,
        content: message,
        direction: 'outbound',
        messageType: 'text',
        twilioSid: twilioMessage.sid,
        status: 'sent'
      }
    })

    // Atualizar última mensagem da conversa
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: message,
        lastMessageAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Mensagem enviada com sucesso',
      twilioSid: twilioMessage.sid,
      conversationId: conversation.id,
      messageId: savedMessage.id
    })

  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error)
    return NextResponse.json(
      { message: 'Erro ao enviar mensagem' },
      { status: 500 }
    )
  }
} 