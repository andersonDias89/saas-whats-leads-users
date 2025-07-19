'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts'
import { Users, MessageCircle } from 'lucide-react'

interface ChartData {
  month: string
  value: number
}

interface DashboardChartsProps {
  monthlyData: ChartData[]
  totalLeads: number
  totalConversations: number
  activeConversations: number
  leadsChange: string
  conversationsChange: string
}

export function LeadsChart({ monthlyData, totalLeads, leadsChange }: { monthlyData: ChartData[], totalLeads: number, leadsChange: string }) {
  return (
    <div className="h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData} margin={{ top: 10, right: 5, left: 5, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.1)" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
            axisLine={{ stroke: '#374151', strokeWidth: 1 }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
            tickFormatter={(value) => value.toString()}
            axisLine={{ stroke: '#374151', strokeWidth: 1 }}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '12px',
              color: '#F9FAFB',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
              fontSize: '12px',
              fontWeight: '500'
            }}
            labelStyle={{
              color: '#10B981',
              fontWeight: '600',
              fontSize: '13px'
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            formatter={(value) => [`${value} leads`, 'Leads']}
            cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
          />
          <Bar 
            dataKey="value" 
            fill="url(#greenGradient)"
            radius={[6, 6, 0, 0]}
            stroke="url(#greenStroke)"
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D4AA" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="greenStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D4AA" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ConversationsChart({ totalConversations, activeConversations, conversationsChange }: { totalConversations: number, activeConversations: number, conversationsChange: string }) {
  // Criar dados para o gráfico de área baseado nas conversas
  const conversationData = [
    { month: '2025-01', conversas: Math.floor(totalConversations * 0.8), ativas: Math.floor(activeConversations * 0.8) },
    { month: '2025-02', conversas: Math.floor(totalConversations * 0.9), ativas: Math.floor(activeConversations * 0.9) },
    { month: '2025-03', conversas: Math.floor(totalConversations * 0.7), ativas: Math.floor(activeConversations * 0.7) },
    { month: '2025-04', conversas: Math.floor(totalConversations * 0.6), ativas: Math.floor(activeConversations * 0.6) },
    { month: '2025-05', conversas: Math.floor(totalConversations * 0.8), ativas: Math.floor(activeConversations * 0.8) },
    { month: '2025-06', conversas: totalConversations, ativas: activeConversations }
  ]

  return (
    <div className="h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={conversationData} margin={{ top: 10, right: 5, left: 5, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.1)" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
            axisLine={{ stroke: '#374151', strokeWidth: 1 }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
            tickFormatter={(value) => value.toString()}
            axisLine={{ stroke: '#374151', strokeWidth: 1 }}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '12px',
              color: '#F9FAFB',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
              fontSize: '12px',
              fontWeight: '500'
            }}
            labelStyle={{
              color: '#00D4AA',
              fontWeight: '600',
              fontSize: '13px'
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            formatter={(value, name) => [
              `${value} ${name === 'conversas' ? 'conversas' : 'ativas'}`, 
              name === 'conversas' ? 'Total' : 'Ativas'
            ]}
            cursor={{ fill: 'rgba(0, 212, 170, 0.1)' }}
          />
          <Bar 
            dataKey="conversas" 
            fill="url(#conversationsGradient)"
            radius={[6, 6, 0, 0]}
            stroke="url(#conversationsStroke)"
            strokeWidth={2}
            name="conversas"
          />
          <Bar 
            dataKey="ativas" 
            fill="url(#activeGradient)"
            radius={[6, 6, 0, 0]}
            stroke="url(#activeStroke)"
            strokeWidth={2}
            name="ativas"
          />
          <defs>
            <linearGradient id="conversationsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D4AA" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="conversationsStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D4AA" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#6EE7B7" />
              <stop offset="100%" stopColor="#A7F3D0" />
            </linearGradient>
            <linearGradient id="activeStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#6EE7B7" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 

export function MessagesChart({ totalMessages, messagesChange }: { totalMessages: number, messagesChange: string }) {
  // Criar dados para o gráfico de linha baseado nas mensagens
  const messagesData = [
    { month: '2025-01', mensagens: Math.floor(totalMessages * 0.6) },
    { month: '2025-02', mensagens: Math.floor(totalMessages * 0.7) },
    { month: '2025-03', mensagens: Math.floor(totalMessages * 0.8) },
    { month: '2025-04', mensagens: Math.floor(totalMessages * 0.9) },
    { month: '2025-05', mensagens: Math.floor(totalMessages * 0.85) },
    { month: '2025-06', mensagens: totalMessages }
  ]

  return (
    <div className="h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={messagesData} margin={{ top: 10, right: 5, left: 5, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.1)" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
            axisLine={{ stroke: '#374151', strokeWidth: 1 }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
            tickFormatter={(value) => value.toString()}
            axisLine={{ stroke: '#374151', strokeWidth: 1 }}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '12px',
              color: '#F9FAFB',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
              fontSize: '12px',
              fontWeight: '500'
            }}
            labelStyle={{
              color: '#00D4AA',
              fontWeight: '600',
              fontSize: '13px'
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            formatter={(value) => [`${value} mensagens`, 'Mensagens']}
            cursor={{ fill: 'rgba(0, 212, 170, 0.1)' }}
          />
          <Area 
            type="monotone"
            dataKey="mensagens" 
            stroke="url(#messagesStroke)"
            fill="url(#messagesGradient)"
            strokeWidth={3}
            fillOpacity={0.6}
          />
          <defs>
            <linearGradient id="messagesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.8} />
              <stop offset="50%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="messagesStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D4AA" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
} 