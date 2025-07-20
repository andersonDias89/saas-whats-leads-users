const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkTwilioConfig() {
  try {
    console.log('🔍 Verificando configurações do Twilio...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        twilioAccountSid: true,
        twilioAuthToken: true,
        twilioWhatsappNumber: true,
        twilioSandboxKeyword: true,
        openaiApiKey: true,
        aiPrompt: true
      }
    })
    
    console.log(`📊 Total de usuários: ${users.length}`)
    
    users.forEach((user, index) => {
      console.log(`\n👤 Usuário ${index + 1}:`)
      console.log(`   Nome: ${user.name}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Twilio Account SID: ${user.twilioAccountSid ? '✅ Configurado' : '❌ Não configurado'}`)
      console.log(`   Twilio Auth Token: ${user.twilioAuthToken ? '✅ Configurado' : '❌ Não configurado'}`)
      console.log(`   WhatsApp Number: ${user.twilioWhatsappNumber ? '✅ Configurado' : '❌ Não configurado'}`)
      console.log(`   Sandbox Keyword: ${user.twilioSandboxKeyword ? '✅ Configurado' : '❌ Não configurado'}`)
      console.log(`   OpenAI API Key: ${user.openaiApiKey ? '✅ Configurado' : '❌ Não configurado'}`)
      console.log(`   AI Prompt: ${user.aiPrompt ? '✅ Configurado' : '❌ Não configurado'}`)
      
      if (user.twilioAccountSid) {
        console.log(`   🔗 URL do Webhook: https://ae207a4689f5.ngrok-free.app/conversations/webhook`)
        console.log(`   📱 Account SID para teste: ${user.twilioAccountSid}`)
      }
    })
    
  } catch (error) {
    console.error('❌ Erro ao verificar configurações:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTwilioConfig() 