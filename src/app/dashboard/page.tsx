import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  CheckCircle,
  Users,
  MessageCircle
} from 'lucide-react'
import { getDashboardData } from '@/lib/dashboard-data'
import { LeadsChart, ConversationsChart } from '@/components/dashboard/charts'

export default async function DashboardPage() {
  const data = await getDashboardData()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <nav className="text-sm text-foreground-muted mb-2">
            Pages / Dashboard
          </nav>
          <h1 className="text-3xl font-bold text-foreground">Main Dashboard</h1>
        </div>
      </div>

      {/* KPI Cards - Dados Reais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card className="bg-card border-card-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-secondary">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-foreground-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{data.kpis.totalLeads.value}</div>
            <p className="text-xs text-foreground-muted">
              {data.kpis.totalLeads.change} este mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-secondary">Conversas</CardTitle>
            <MessageCircle className="h-4 w-4 text-foreground-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{data.kpis.totalConversations.value}</div>
            <p className="text-xs text-foreground-muted">
              {data.kpis.totalConversations.change} este mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-secondary">Mensagens</CardTitle>
            <FileText className="h-4 w-4 text-foreground-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{data.kpis.totalMessages.value}</div>
            <p className="text-xs text-foreground-muted">
              {data.kpis.totalMessages.change} este mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-secondary">Leads Qualificados</CardTitle>
            <CheckCircle className="h-4 w-4 text-foreground-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{data.kpis.leadsQualificados.value}</div>
            <p className="text-xs text-foreground-muted">
              {data.kpis.leadsQualificados.change} este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Leads Novos */}
        <Card className="bg-card border-card-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">
                  {data.kpis.totalLeads.value} Leads Novos
                </CardTitle>
                <CardDescription className="text-success">
                  {data.kpis.totalLeads.change} este mês
                </CardDescription>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <LeadsChart 
              monthlyData={data.charts.revenue.monthlyData}
              totalLeads={data.kpis.totalLeads.value}
              leadsChange={data.kpis.totalLeads.change}
            />
          </CardContent>
        </Card>

        {/* Gráfico de Conversas */}
        <Card className="bg-card border-card-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">
                  {data.kpis.totalConversations.value} Conversas
                </CardTitle>
                <CardDescription className="text-success">
                  {data.kpis.totalConversations.change} este mês
                </CardDescription>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ConversationsChart 
              totalConversations={data.kpis.totalConversations.value}
              activeConversations={data.conversations.active}
              conversationsChange={data.kpis.totalConversations.change}
            />
          </CardContent>
        </Card>
      </div>

      {/* Team, Tasks, Outreach, Storage Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Team Members */}
        <Card className="bg-card border-card-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Leads</CardTitle>
            <CardDescription className="text-muted-foreground">
              Latest leads captured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.leads.recentLeads.length > 0 ? (
                data.leads.recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {lead.name || 'Nome não informado'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {lead.phone}
                      </p>
                    </div>
                    <Badge variant={lead.status === 'fechado' ? 'success' : 'secondary'}>
                      {lead.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Users className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">Nenhum lead ainda</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card className="bg-card border-card-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Conversations</CardTitle>
            <CardDescription className="text-muted-foreground">
              Latest conversations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.conversations.recentConversations.length > 0 ? (
                data.conversations.recentConversations.map((conversation) => (
                  <div key={conversation.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {conversation.contactName || conversation.phoneNumber}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.lastMessage || 'Nenhuma mensagem'}
                      </p>
                    </div>
                    <Badge variant={conversation.status === 'active' ? 'success' : 'secondary'}>
                      {conversation.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <MessageCircle className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">Nenhuma conversa ainda</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Outreach Success */}
        <Card className="bg-card border-card-border">
          <CardHeader>
            <CardTitle className="text-foreground">Lead Status</CardTitle>
            <CardDescription className="text-muted-foreground">
              Distribution by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.leads.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-sm text-foreground-secondary capitalize">
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Server Storage */}
        <Card className="bg-card border-card-border">
          <CardHeader>
            <CardTitle className="text-foreground">System Overview</CardTitle>
            <CardDescription className="text-muted-foreground">
              Current system status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Total Leads</span>
                <span className="text-sm font-medium text-foreground">{data.leads.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Active Conversations</span>
                <span className="text-sm font-medium text-foreground">{data.conversations.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Total Messages</span>
                <span className="text-sm font-medium text-foreground">{data.kpis.totalMessages.value}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Leads Qualificados</span>
                <span className="text-sm font-medium text-foreground">{data.kpis.leadsQualificados.value}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Reports Table */}
      <Card className="bg-card border-card-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
          <CardDescription className="text-muted-foreground">
            Latest activities and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.leads.recentLeads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {lead.name || 'Nome não informado'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(lead.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={lead.status === 'fechado' ? 'success' : 'secondary'}>
                    {lead.status}
                  </Badge>
                  {lead.value && (
                    <span className="text-sm font-medium text-foreground">
                      {formatCurrency(lead.value)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 