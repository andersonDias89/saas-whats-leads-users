'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
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
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
          />
          <YAxis 
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={(value) => value.toString()}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            formatter={(value) => [`${value} leads`, 'Leads']}
          />
          <Bar 
            dataKey="value" 
            fill="url(#greenGradient)"
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ConversationsChart({ totalConversations, activeConversations, conversationsChange }: { totalConversations: number, activeConversations: number, conversationsChange: string }) {
  const data = [
    { name: 'Conversas Ativas', value: activeConversations, color: '#10B981' },
    { name: 'Conversas Inativas', value: Math.max(totalConversations - activeConversations, 0), color: '#374151' }
  ]

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            formatter={(value, name) => [`${value} conversas`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
} 