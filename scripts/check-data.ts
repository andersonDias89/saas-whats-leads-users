import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verificando dados no banco...')

  // Contar usuários
  const userCount = await prisma.user.count()
  console.log(`👥 Usuários: ${userCount}`)

  // Contar conversas
  const conversationCount = await prisma.conversation.count()
  console.log(`💬 Conversas: ${conversationCount}`)

  // Contar leads
  const leadCount = await prisma.lead.count()
  console.log(`🎯 Leads: ${leadCount}`)

  // Contar mensagens
  const messageCount = await prisma.message.count()
  console.log(`📱 Mensagens: ${messageCount}`)

  // Verificar leads sem conversa
  const leadsWithoutConversation = await prisma.lead.findMany({
    where: {
      conversationId: null
    }
  })
  console.log(`⚠️ Leads sem conversa: ${leadsWithoutConversation.length}`)

  // Verificar conversas sem lead
  const conversationsWithoutLead = await prisma.conversation.findMany({
    where: {
      leads: {
        none: {}
      }
    }
  })
  console.log(`⚠️ Conversas sem lead: ${conversationsWithoutLead.length}`)

  // Mostrar alguns exemplos
  console.log('\n📋 Exemplos de conversas:')
  const conversations = await prisma.conversation.findMany({
    take: 5,
    include: {
      leads: true,
      messages: {
        take: 2
      }
    }
  })

  conversations.forEach((conv, index) => {
    console.log(`${index + 1}. ${conv.contactName} (${conv.phoneNumber}) - ${conv.status}`)
    console.log(`   Leads: ${conv.leads.length}, Mensagens: ${conv.messages.length}`)
  })

  console.log('\n📋 Exemplos de leads:')
  const leads = await prisma.lead.findMany({
    take: 5,
    include: {
      conversation: true
    }
  })

  leads.forEach((lead, index) => {
    console.log(`${index + 1}. ${lead.name} (${lead.phone}) - ${lead.status}`)
    console.log(`   Conversa: ${lead.conversation ? 'Sim' : 'Não'}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 