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

  // Calcular dados reais por mês (últimos 6 meses)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  // Buscar dados reais do banco
  const leadsByMonth = await prisma.lead.groupBy({
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

  const conversationsByMonth = await prisma.conversation.groupBy({
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

  // Agrupar dados por mês
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    const monthLeads = leadsByMonth.filter(item => {
      const itemDate = new Date(item.createdAt)
      return itemDate.getFullYear() === date.getFullYear() && itemDate.getMonth() === date.getMonth()
    })
    
    const monthConversations = conversationsByMonth.filter(item => {
      const itemDate = new Date(item.createdAt)
      return itemDate.getFullYear() === date.getFullYear() && itemDate.getMonth() === date.getMonth()
    })
    
    const monthMessages = messagesByMonth.filter(item => {
      const itemDate = new Date(item.createdAt)
      return itemDate.getFullYear() === date.getFullYear() && itemDate.getMonth() === date.getMonth()
    })
    
    return {
      month: monthKey,
      leads: monthLeads.reduce((sum, item) => sum + item._count.id, 0),
      conversations: monthConversations.reduce((sum, item) => sum + item._count.id, 0),
      messages: monthMessages.reduce((sum, item) => sum + item._count.id, 0),
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

  // Calcular dados do mês atual vs mês anterior
  const now = new Date()
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  
  // Leads do mês atual
  const currentMonthLeads = user.leads.filter(lead => 
    lead.createdAt >= currentMonth
  ).length
  
  // Leads do mês anterior
  const lastMonthLeads = user.leads.filter(lead => 
    lead.createdAt >= lastMonth && lead.createdAt < currentMonth
  ).length
  
  // Conversas do mês atual
  const currentMonthConversations = user.conversations.filter(conv => 
    conv.createdAt >= currentMonth
  ).length
  
  // Conversas do mês anterior
  const lastMonthConversations = user.conversations.filter(conv => 
    conv.createdAt >= lastMonth && conv.createdAt < currentMonth
  ).length
  
  // Mensagens do mês atual
  const currentMonthMessages = user.messages.filter(msg => 
    msg.createdAt >= currentMonth
  ).length
  
  // Mensagens do mês anterior
  const lastMonthMessages = user.messages.filter(msg => 
    msg.createdAt >= lastMonth && msg.createdAt < currentMonth
  ).length
  
  // Valor do mês atual
  const currentMonthValue = user.leads.filter(lead => 
    lead.createdAt >= currentMonth
  ).reduce((sum, lead) => sum + (lead.value || 0), 0)
  
  // Valor do mês anterior
  const lastMonthValue = user.leads.filter(lead => 
    lead.createdAt >= lastMonth && lead.createdAt < currentMonth
  ).reduce((sum, lead) => sum + (lead.value || 0), 0)

  return {
    // KPIs principais - apenas dados reais
    kpis: {
      totalLeads: {
        value: totalLeads,
        change: lastMonthLeads > 0 ? `+${currentMonthLeads - lastMonthLeads}` : `+${currentMonthLeads}`,
        changeType: currentMonthLeads >= lastMonthLeads ? 'increase' : 'decrease',
      },
      totalConversations: {
        value: totalConversations,
        change: lastMonthConversations > 0 ? `+${currentMonthConversations - lastMonthConversations}` : `+${currentMonthConversations}`,
        changeType: currentMonthConversations >= lastMonthConversations ? 'increase' : 'decrease',
      },
      totalMessages: {
        value: totalMessages,
        change: lastMonthMessages > 0 ? `+${currentMonthMessages - lastMonthMessages}` : `+${currentMonthMessages}`,
        changeType: currentMonthMessages >= lastMonthMessages ? 'increase' : 'decrease',
      },
      leadsQualificados: {
        value: leadsByStatus.qualificado,
        change: leadsByStatus.qualificado > 0 ? `+${leadsByStatus.qualificado}` : '0',
        changeType: 'increase' as const,
      },
    },

    // Dados dos gráficos
    charts: {
      revenue: {
        total: totalValue,
        change: lastMonthValue > 0 ? ((currentMonthValue - lastMonthValue) / lastMonthValue * 100).toFixed(2) : '0',
        status: currentMonthValue >= lastMonthValue ? 'success' : 'warning',
        monthlyData: monthlyData.map(item => ({
          month: item.month,
          value: item.leads,
        })),
      },
      conversations: {
        monthlyData: monthlyData.map(item => ({
          month: item.month,
          value: item.conversations,
        })),
      },
      messages: {
        monthlyData: monthlyData.map(item => ({
          month: item.month,
          value: item.messages,
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