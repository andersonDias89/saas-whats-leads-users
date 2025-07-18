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
        <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
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
  const data = [
    { name: 'Conversas Ativas', value: activeConversations, color: '#00D4AA' },
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
            innerRadius={45}
            outerRadius={75}
            paddingAngle={8}
            dataKey="value"
            stroke="#1F2937"
            strokeWidth={3}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke={entry.color}
                strokeWidth={2}
              />
            ))}
          </Pie>
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
            formatter={(value, name) => [`${value} conversas`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
} 