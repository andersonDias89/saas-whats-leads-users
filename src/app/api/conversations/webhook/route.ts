import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { twilioWebhookSchema } from '@/schemas'
import { Twilio } from 'twilio'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  try {
    console.log('📱 Webhook do Twilio recebido')
    
    // Parse form data (Twilio envia como form-data)
    const contentType = req.headers.get('content-type')
    console.log('📝 Content-Type:', contentType)
    
    let data = {}
    if (contentType?.includes('multipart/form-data')) {
      try {
        const formData = await req.formData()
        data = Object.fromEntries(formData.entries())
        console.log('✅ Parse como FormData bem-sucedido')
      } catch (formError) {
        console.log('❌ Erro no parse FormData:', formError)
        return NextResponse.json(
          { message: 'Erro ao processar dados do formulário' },
          { status: 400 }
        )
      }
    } else {
      try {
        const text = await req.text()
        console.log('📝 Conteúdo como texto:', text)
        const urlParams = new URLSearchParams(text)
        data = Object.fromEntries(urlParams.entries())
        console.log('✅ Parse manual bem-sucedido')
      } catch (textError) {
        console.log('❌ Erro no parse texto:', textError)
        return NextResponse.json(
          { message: 'Erro ao processar dados' },
          { status: 400 }
        )
      }
    }
    
    console.log('📝 Dados recebidos:', data)
    
    // Validar dados
    let validatedData
    try {
      validatedData = twilioWebhookSchema.parse(data)
      console.log('✅ Dados validados:', validatedData)
    } catch (validationError) {
      console.error('❌ Erro de validação:', validationError)
      return NextResponse.json(
        { message: 'Dados inválidos', error: validationError },
        { status: 400 }
      )
    }
    
    // Extrair informações
    const {
      From: from,
      To: to,
      Body: body,
      MessageSid: messageSid,
      AccountSid: accountSid,
      ProfileName: profileName,
      WaId: waId
    } = validatedData
    
    // Encontrar usuário pelo AccountSid
    const user = await prisma.user.findFirst({
      where: {
        twilioAccountSid: accountSid
      }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado para AccountSid:', accountSid)
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }
    
    console.log('✅ Usuário encontrado:', user.name)
    
    // Encontrar ou criar conversa
    let conversation = await prisma.conversation.findFirst({
      where: {
        userId: user.id,
        phoneNumber: from
      }
    })
    
    if (!conversation) {
      console.log('🆕 Criando nova conversa para:', from)
      conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          phoneNumber: from,
          contactName: profileName || waId || from,
          status: 'active'
        }
      })
    }
    
    // Salvar mensagem recebida
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        userId: user.id,
        content: body,
        direction: 'inbound',
        messageType: 'text',
        twilioSid: messageSid,
        status: 'delivered'
      }
    })
    
    console.log('✅ Mensagem salva:', message.id)
    
    // Atualizar última mensagem da conversa
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: body,
        lastMessageAt: new Date()
      }
    })
    
    // Criar ou atualizar lead
    let lead = await prisma.lead.findFirst({
      where: {
        userId: user.id,
        phone: from
      }
    })
    
    if (!lead) {
      console.log('🆕 Criando novo lead para:', from)
      console.log('📝 ProfileName:', profileName)
      console.log('📝 WaId:', waId)
      console.log('📝 From:', from)
      
      const leadName = profileName || waId || from
      console.log('📝 Nome do lead que será salvo:', leadName)
      
      lead = await prisma.lead.create({
        data: {
          userId: user.id,
          conversationId: conversation.id,
          name: leadName,
          phone: from,
          status: 'novo',
          source: 'whatsapp'
        }
      })
      
      console.log('✅ Lead criado com nome:', lead.name)
    } else {
      // Atualizar o nome do lead se não tiver ou se o profileName for diferente
      if (!lead.name || (profileName && lead.name !== profileName)) {
        console.log('🔄 Atualizando nome do lead existente')
        console.log('📝 Nome atual:', lead.name)
        console.log('📝 Novo nome:', profileName || waId || from)
        
        lead = await prisma.lead.update({
          where: { id: lead.id },
          data: {
            name: profileName || waId || from
          }
        })
        
        console.log('✅ Lead atualizado com nome:', lead.name)
      }
    }
    
    // Gerar resposta automática com OpenAI se configurado
    if (user.openaiApiKey && user.aiPrompt) {
      try {
        console.log('🤖 Gerando resposta automática...')
        
        const openai = new OpenAI({
          apiKey: user.openaiApiKey
        })
        
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: user.aiPrompt
            },
            {
              role: 'user',
              content: body
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
        
        const aiResponse = completion.choices[0]?.message?.content
        
        if (aiResponse) {
          console.log('🤖 Resposta da IA:', aiResponse)
          
          // Salvar resposta da IA
          const aiMessage = await prisma.message.create({
            data: {
              conversationId: conversation.id,
              userId: user.id,
              content: aiResponse,
              direction: 'outbound',
              messageType: 'text',
              status: 'sent'
            }
          })
          
          // Enviar resposta via Twilio
          const twilio = new Twilio(user.twilioAccountSid!, user.twilioAuthToken!)
          
          await twilio.messages.create({
            body: aiResponse,
            from: to,
            to: from
          })
          
          console.log('✅ Resposta enviada via Twilio')
          
          // Atualizar última mensagem da conversa
          await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
              lastMessage: aiResponse,
              lastMessageAt: new Date()
            }
          })
        }
        
      } catch (error) {
        console.error('❌ Erro ao gerar resposta automática:', error)
      }
    }
    
    return NextResponse.json({ 
      message: 'Webhook processado com sucesso',
      conversationId: conversation.id,
      messageId: message.id,
      leadId: lead.id
    })
    
  } catch (error) {
    console.error('❌ Erro no webhook:', error)
    
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