import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Dados de exemplo para gerar conversas realistas
const sampleNames = [
  'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira',
  'Lucia Rodrigues', 'Roberto Almeida', 'Fernanda Lima', 'Ricardo Gomes', 'Patricia Martins',
  'Marcos Sousa', 'Juliana Barbosa', 'Andre Ribeiro', 'Camila Carvalho', 'Felipe Cardoso',
  'Vanessa Melo', 'Diego Castro', 'Gabriela Nascimento', 'Thiago Araujo', 'Isabela Moreira'
]

const samplePhones = [
  '11999887766', '11988776655', '11977665544', '11966554433', '11955443322',
  '11944332211', '11933221100', '11922110099', '11911009988', '11900998877',
  '11999887765', '11988776654', '11977665543', '11966554432', '11955443321',
  '11944332210', '11933221099', '11922109988', '11911009887', '11900998776'
]

const sampleEmails = [
  'joao.silva@email.com', 'maria.santos@email.com', 'pedro.oliveira@email.com',
  'ana.costa@email.com', 'carlos.ferreira@email.com', 'lucia.rodrigues@email.com',
  'roberto.almeida@email.com', 'fernanda.lima@email.com', 'ricardo.gomes@email.com',
  'patricia.martins@email.com', 'marcos.sousa@email.com', 'juliana.barbosa@email.com',
  'andre.ribeiro@email.com', 'camila.carvalho@email.com', 'felipe.cardoso@email.com',
  'vanessa.melo@email.com', 'diego.castro@email.com', 'gabriela.nascimento@email.com',
  'thiago.araujo@email.com', 'isabela.moreira@email.com'
]

const sampleMessages = [
  'Olá! Gostaria de saber mais sobre seus produtos.',
  'Oi! Vi seu anúncio e fiquei interessado.',
  'Bom dia! Tem algum desconto disponível?',
  'Oi! Queria fazer um orçamento.',
  'Olá! Vocês fazem entrega?',
  'Oi! Qual o prazo de entrega?',
  'Bom dia! Tem em estoque?',
  'Oi! Qual a forma de pagamento?',
  'Olá! Posso parcelar?',
  'Oi! Tem garantia?',
  'Bom dia! Qual o melhor horário para atendimento?',
  'Oi! Vocês atendem no sábado?',
  'Olá! Tem loja física?',
  'Oi! Posso agendar uma visita?',
  'Bom dia! Queria ver mais fotos.',
  'Oi! Tem outras cores disponíveis?',
  'Olá! Qual o tamanho disponível?',
  'Oi! Fazem instalação?',
  'Bom dia! Tem manutenção?',
  'Oi! Qual a durabilidade?'
]

const aiResponses = [
  'Olá! Obrigado pelo interesse. Posso te ajudar com informações sobre nossos produtos.',
  'Oi! Que ótimo que você se interessou! Vou te passar todas as informações.',
  'Bom dia! Sim, temos várias opções de desconto. Qual produto te interessa?',
  'Oi! Claro! Vou preparar um orçamento personalizado para você.',
  'Olá! Sim, fazemos entrega em toda a região. Qual seu endereço?',
  'Oi! O prazo de entrega varia de 3 a 7 dias úteis.',
  'Bom dia! Vou verificar o estoque para você. Qual produto?',
  'Oi! Aceitamos cartão, PIX e boleto. Qual prefere?',
  'Olá! Sim, parcelamos em até 12x sem juros.',
  'Oi! Sim, temos garantia de 1 ano em todos os produtos.',
  'Bom dia! Atendemos de segunda a sexta, das 8h às 18h.',
  'Oi! Infelizmente não atendemos aos sábados.',
  'Olá! Temos loja física na Rua das Flores, 123.',
  'Oi! Claro! Qual dia e horário seria melhor para você?',
  'Bom dia! Vou te enviar mais fotos por aqui mesmo.',
  'Oi! Temos várias cores disponíveis. Qual você prefere?',
  'Olá! Temos todos os tamanhos. Qual seria ideal?',
  'Oi! Sim, fazemos instalação com nossa equipe técnica.',
  'Bom dia! Oferecemos manutenção preventiva e corretiva.',
  'Oi! Nossos produtos têm durabilidade de 5 a 10 anos.'
]

const leadStatuses = ['novo', 'qualificado', 'nao_interessado', 'fechado']
const conversationStatuses = ['active', 'closed', 'archived']

async function main() {
  console.log('🌱 Iniciando seed de dados...')

  // Buscar o primeiro usuário (assumindo que já existe um usuário logado)
  const user = await prisma.user.findFirst()
  
  if (!user) {
    console.error('❌ Nenhum usuário encontrado. Crie um usuário primeiro.')
    return
  }

  console.log(`✅ Usuário encontrado: ${user.name}`)

  // Gerar 20 conversas com leads e mensagens
  for (let i = 0; i < 20; i++) {
    const name = sampleNames[i]
    const phone = samplePhones[i]
    const email = sampleEmails[i]
    const leadStatus = leadStatuses[Math.floor(Math.random() * leadStatuses.length)]
    const conversationStatus = conversationStatuses[Math.floor(Math.random() * conversationStatuses.length)]
    
    // Criar conversa
    const conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        phoneNumber: phone,
        contactName: name,
        status: conversationStatus,
        lastMessage: sampleMessages[i],
        lastMessageAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Últimos 30 dias
        updatedAt: new Date()
      }
    })

    // Criar lead associado à conversa
    const lead = await prisma.lead.create({
      data: {
        userId: user.id,
        conversationId: conversation.id,
        name: name,
        phone: phone,
        email: email,
        status: leadStatus,
        source: 'whatsapp',
        notes: `Lead gerado automaticamente para teste. Status: ${leadStatus}`,
        value: Math.random() > 0.5 ? Math.floor(Math.random() * 10000) + 1000 : null,
        createdAt: conversation.createdAt,
        updatedAt: new Date()
      }
    })

    // Gerar 3-8 mensagens por conversa
    const messageCount = Math.floor(Math.random() * 6) + 3
    const messages = []

    for (let j = 0; j < messageCount; j++) {
      const isInbound = j % 2 === 0 // Alternar entre inbound e outbound
      const messageContent = isInbound ? sampleMessages[Math.floor(Math.random() * sampleMessages.length)] : aiResponses[Math.floor(Math.random() * aiResponses.length)]
      
      const message = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          userId: user.id,
          content: messageContent,
          direction: isInbound ? 'inbound' : 'outbound',
          messageType: 'text',
          twilioSid: `MSG_${Math.random().toString(36).substr(2, 9)}`,
          status: 'delivered',
          createdAt: new Date(conversation.createdAt.getTime() + j * 60 * 60 * 1000) // 1 hora entre mensagens
        }
      })
      
      messages.push(message)
    }

    console.log(`✅ Criada conversa ${i + 1}/20: ${name} (${phone}) - ${messageCount} mensagens`)
  }

  console.log('🎉 Seed concluído com sucesso!')
  console.log('📊 Resumo:')
  console.log('- 20 conversas criadas')
  console.log('- 20 leads criados')
  console.log('- ~100 mensagens criadas')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 