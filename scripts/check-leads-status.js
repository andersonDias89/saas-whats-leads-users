const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkLeadsStatus() {
  try {
    console.log('🔍 Verificando status dos leads...')
    
    const leads = await prisma.lead.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`📊 Total de leads: ${leads.length}`)
    
    // Agrupar por status
    const statusCount = {}
    leads.forEach(lead => {
      statusCount[lead.status] = (statusCount[lead.status] || 0) + 1
    })
    
    console.log('\n📈 Distribuição por status:')
    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} leads`)
    })
    
    console.log('\n📋 Últimos 5 leads:')
    leads.slice(0, 5).forEach((lead, index) => {
      console.log(`   ${index + 1}. ${lead.name || 'Sem nome'} - ${lead.phone} - Status: ${lead.status} - ${new Date(lead.createdAt).toLocaleDateString('pt-BR')}`)
    })
    
    // Verificar se há leads com status antigos (em inglês)
    const oldStatusLeads = leads.filter(lead => 
      ['new', 'contacted', 'qualified', 'converted', 'lost'].includes(lead.status)
    )
    
    if (oldStatusLeads.length > 0) {
      console.log(`\n⚠️  Encontrados ${oldStatusLeads.length} leads com status antigos (em inglês):`)
      oldStatusLeads.forEach(lead => {
        console.log(`   - ${lead.name || 'Sem nome'} (${lead.phone}): ${lead.status}`)
      })
      
      console.log('\n🔄 Deseja migrar esses leads para os novos status? (y/n)')
      // Aqui você pode adicionar lógica para migração automática se necessário
    } else {
      console.log('\n✅ Todos os leads estão com status corretos!')
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar leads:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkLeadsStatus() 