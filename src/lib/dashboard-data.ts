import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function getDashboardData() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    throw new Error('Usuário não autenticado')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      leads: true,
      conversations: {
        include: {
          messages: true,
        },
      },
      messages: true,
    },
  })

  if (!user) {
    throw new Error('Usuário não encontrado')
  }

  // Calcular métricas dos leads
  const totalLeads = user.leads.length
  const leadsByStatus = {
    novo: user.leads.filter(lead => lead.status === 'novo').length,
    qualificado: user.leads.filter(lead => lead.status === 'qualificado').length,
    nao_interessado: user.leads.filter(lead => lead.status === 'nao_interessado').length,
    fechado: user.leads.filter(lead => lead.status === 'fechado').length,
  }

  // Calcular valor total dos leads
  const totalValue = user.leads.reduce((sum, lead) => sum + (lead.value || 0), 0)

  // Calcular métricas das conversas
  const totalConversations = user.conversations.length
  const activeConversations = user.conversations.filter(conv => conv.status === 'active').length
  const totalMessages = user.messages.length

  // Calcular mensagens por mês (últimos 6 meses)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const messagesByMonth = await prisma.message.groupBy({
    by: ['createdAt'],
    where: {
      userId: user.id,
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    _count: {
      id: true,
    },
  })

  // Agrupar mensagens por mês
  const monthlyMessages = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    const monthMessages = messagesByMonth.filter(msg => {
      const msgDate = new Date(msg.createdAt)
      return msgDate.getFullYear() === date.getFullYear() && msgDate.getMonth() === date.getMonth()
    })
    
    return {
      month: monthKey,
      count: monthMessages.reduce((sum, msg) => sum + msg._count.id, 0),
    }
  }).reverse()

  // Calcular progresso dos projetos (conversas ativas vs total)
  const projectProgress = {
    create: Math.round((activeConversations / Math.max(totalConversations, 1)) * 100),
    update: Math.round((leadsByStatus.qualificado / Math.max(totalLeads, 1)) * 100),
    send: Math.round((totalMessages / Math.max(totalConversations, 1)) * 100),
    deliver: Math.round((leadsByStatus.fechado / Math.max(totalLeads, 1)) * 100),
    change: Math.round((leadsByStatus.nao_interessado / Math.max(totalLeads, 1)) * 100),
  }

  // Calcular mudanças em relação ao mês anterior
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  
  const lastMonthLeads = user.leads.filter(lead => 
    lead.createdAt >= lastMonth
  ).length

  const lastMonthMessages = user.messages.filter(msg => 
    msg.createdAt >= lastMonth
  ).length

  const lastMonthValue = user.leads.filter(lead => 
    lead.createdAt >= lastMonth
  ).reduce((sum, lead) => sum + (lead.value || 0), 0)

  return {
    // KPIs principais - apenas dados reais
    kpis: {
      totalLeads: {
        value: totalLeads,
        change: lastMonthLeads > 0 ? `+${totalLeads - lastMonthLeads}` : '0',
        changeType: totalLeads >= lastMonthLeads ? 'increase' : 'decrease',
      },
      totalConversations: {
        value: totalConversations,
        change: totalConversations > 0 ? '+0' : '0',
        changeType: 'increase' as const,
      },
      totalMessages: {
        value: totalMessages,
        change: lastMonthMessages > 0 ? `+${totalMessages - lastMonthMessages}` : '0',
        changeType: 'increase' as const,
      },
      activeConversations: {
        value: activeConversations,
        change: activeConversations > 0 ? '+0' : '0',
        changeType: 'increase' as const,
      },
      totalValue: {
        value: totalValue,
        change: lastMonthValue > 0 ? ((totalValue - lastMonthValue) / lastMonthValue * 100).toFixed(1) : '0',
        changeType: totalValue >= lastMonthValue ? 'increase' : 'decrease',
      },
      leadsQualificados: {
        value: leadsByStatus.qualificado,
        change: leadsByStatus.qualificado > 0 ? '+0' : '0',
        changeType: 'increase' as const,
      },
    },

    // Dados dos gráficos
    charts: {
      revenue: {
        total: totalValue,
        change: lastMonthValue > 0 ? ((totalValue - lastMonthValue) / lastMonthValue * 100).toFixed(2) : '0',
        status: totalValue >= lastMonthValue ? 'success' : 'warning',
        monthlyData: monthlyMessages.map(item => ({
          month: item.month,
          value: item.count,
        })),
      },
      projectCompletion: projectProgress,
    },

    // Estatísticas dos leads
    leads: {
      total: totalLeads,
      byStatus: leadsByStatus,
      recentLeads: user.leads
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    },

    // Estatísticas das conversas
    conversations: {
      total: totalConversations,
      active: activeConversations,
      recentConversations: user.conversations
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
    },

    // Dados do usuário
    user: {
      name: user.name,
      email: user.email,
      companyName: user.companyName,
    },
  }
} 