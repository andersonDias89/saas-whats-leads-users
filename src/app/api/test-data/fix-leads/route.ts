import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar leads sem nome
    const leadsWithoutName = await prisma.lead.findMany({
      where: {
        userId: session.user.id,
        name: null
      },
      include: {
        conversation: true
      }
    })

    console.log('🔍 Leads sem nome encontrados:', leadsWithoutName.length)

    const updatedLeads = []

    for (const lead of leadsWithoutName) {
      // Tentar pegar o nome da conversa
      const contactName = lead.conversation?.contactName
      
      if (contactName) {
        const updatedLead = await prisma.lead.update({
          where: { id: lead.id },
          data: { name: contactName }
        })
        updatedLeads.push(updatedLead)
        console.log('✅ Lead atualizado:', lead.id, '->', contactName)
      } else {
        // Se não tiver contactName, usar o telefone como nome
        const phoneName = `Lead ${lead.phone.slice(-4)}`
        const updatedLead = await prisma.lead.update({
          where: { id: lead.id },
          data: { name: phoneName }
        })
        updatedLeads.push(updatedLead)
        console.log('✅ Lead atualizado com telefone:', lead.id, '->', phoneName)
      }
    }

    return NextResponse.json({
      message: 'Leads corrigidos com sucesso',
      totalLeadsWithoutName: leadsWithoutName.length,
      updatedLeads: updatedLeads.length,
      leads: updatedLeads
    })

  } catch (error) {
    console.error('Erro ao corrigir leads:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 