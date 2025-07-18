'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Users, Phone, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral das suas automações do WhatsApp</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversas Ativas</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Conversas em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens Hoje</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Mensagens enviadas/recebidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">
              Leads qualificados/total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Primeiros Passos</CardTitle>
            <CardDescription>
              Configure sua conta para começar a receber leads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                1
              </div>
              <div>
                <p className="font-medium">Configure suas credenciais do Twilio</p>
                <p className="text-sm text-gray-600">Conecte sua conta do WhatsApp Business</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm">
                2
              </div>
              <div>
                <p className="font-medium">Configure sua API Key da OpenAI</p>
                <p className="text-sm text-gray-600">Para respostas automáticas com IA</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm">
                3
              </div>
              <div>
                <p className="font-medium">Personalize seu prompt da IA</p>
                <p className="text-sm text-gray-600">Defina como a IA deve responder seus clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status da Configuração</CardTitle>
            <CardDescription>
              Verifique se tudo está funcionando corretamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Twilio Configurado</span>
              <span className="text-sm text-red-600">❌ Não configurado</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">OpenAI Configurado</span>
              <span className="text-sm text-red-600">❌ Não configurado</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Webhook Ativo</span>
              <span className="text-sm text-red-600">❌ Inativo</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Prompt Personalizado</span>
              <span className="text-sm text-red-600">❌ Não definido</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>
            Últimas conversas e leads gerados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>Nenhuma atividade ainda</p>
            <p className="text-sm">Configure suas integrações para começar a receber dados</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 