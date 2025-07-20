# 🏗️ Arquitetura do Projeto - Cursor SaaS WhatsApp Leads

## 📋 Visão Geral

Este documento descreve a arquitetura refatorada do projeto, estabelecendo padrões de organização, separação de responsabilidades e escalabilidade.

## 🎯 Princípios da Arquitetura

### **1. Separação de Responsabilidades**
- **Presentation Layer:** Componentes React e páginas
- **Business Logic Layer:** Services e hooks customizados
- **Data Access Layer:** Prisma ORM e APIs
- **Validation Layer:** Schemas Zod

### **2. Modularização por Domínio**
- Organização baseada em domínios de negócio
- Schemas, tipos, serviços e hooks agrupados por funcionalidade
- Reutilização e manutenibilidade

### **3. Type Safety**
- TypeScript strict mode
- Schemas Zod para validação
- Tipos bem definidos e reutilizáveis

## 📁 Estrutura da Arquitetura

```
src/
├── app/                          # Next.js App Router
│   ├── api/                     # APIs REST (sempre aqui!)
│   │   ├── leads/              # APIs de leads
│   │   ├── conversations/      # APIs de conversas
│   │   └── dashboard/          # APIs do dashboard
│   ├── dashboard/              # Páginas do dashboard
│   └── (auth)/                # Páginas de autenticação
├── components/                  # Componentes reutilizáveis
├── hooks/                       # Hooks customizados por domínio
│   ├── leads/                  # Hooks de leads
│   │   ├── use-leads.ts       # Hook para lista de leads
│   │   ├── use-lead.ts        # Hook para lead individual
│   │   └── index.ts           # Exports
│   └── index.ts               # Exports globais
├── lib/                         # Utilitários e configurações
│   ├── utils/                  # Utilitários organizados
│   │   ├── constants.ts       # Constantes centralizadas
│   │   ├── formatting.ts      # Funções de formatação
│   │   ├── date.ts           # Utilitários de data
│   │   └── index.ts          # Exports
│   └── prisma.ts              # Cliente Prisma
├── schemas/                     # Schemas Zod por domínio
│   ├── auth/                  # Schemas de autenticação
│   │   ├── login.ts          # Schema de login
│   │   ├── register.ts       # Schema de registro
│   │   └── index.ts          # Exports
│   ├── leads/                # Schemas de leads
│   │   ├── lead.ts           # Schema de lead
│   │   ├── status.ts         # Schema de status
│   │   └── index.ts          # Exports
│   ├── conversations/        # Schemas de conversas
│   │   ├── message.ts        # Schema de mensagem
│   │   ├── webhook.ts        # Schema de webhook
│   │   └── index.ts          # Exports
│   ├── settings/             # Schemas de configurações
│   │   ├── user-settings.ts  # Schema de configurações do usuário
│   │   └── index.ts          # Exports
│   └── index.ts              # Exports globais
├── services/                   # Camada de serviços por domínio
│   ├── leads/                # Serviços de leads
│   │   ├── leads-service.ts  # Classe de serviço de leads
│   │   └── index.ts          # Exports
│   └── index.ts              # Exports globais
└── types/                      # Tipos TypeScript por domínio
    ├── auth/                  # Tipos de autenticação
    │   ├── user.ts           # Tipo de usuário
    │   └── index.ts          # Exports
    ├── leads/                # Tipos de leads
    │   ├── lead.ts           # Tipo de lead
    │   └── index.ts          # Exports
    ├── conversations/        # Tipos de conversas
    │   ├── conversation.ts   # Tipo de conversa
    │   ├── message.ts        # Tipo de mensagem
    │   └── index.ts          # Exports
    ├── dashboard/            # Tipos do dashboard
    │   ├── stats.ts          # Tipo de estatísticas
    │   └── index.ts          # Exports
    └── index.ts              # Exports globais
```

## 🔧 Padrões de Implementação

### **1. Schemas Zod**

#### **Organização por Domínio:**
```typescript
// src/schemas/leads/lead.ts
import { z } from 'zod'
import { leadStatusSchema } from './status'

export const leadSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().min(10, 'Telefone inválido'),
  status: leadStatusSchema,
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Lead = z.infer<typeof leadSchema>
```

#### **Exports Centralizados:**
```typescript
// src/schemas/leads/index.ts
export * from './lead'
export * from './status'

// src/schemas/index.ts
export * from './auth'
export * from './leads'
export * from './conversations'
export * from './settings'
```

### **2. Tipos TypeScript**

#### **Organização por Domínio:**
```typescript
// src/types/leads/lead.ts
import { LeadStatus } from '@/schemas/leads'

export interface Lead {
  id: string
  name: string
  email?: string
  phone: string
  status: LeadStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface LeadWithConversation extends Lead {
  conversations: Conversation[]
}
```

### **3. Services (Camada de Negócio)**

#### **Padrão de Implementação:**
```typescript
// src/services/leads/leads-service.ts
import { prisma } from '@/lib/prisma'
import { Lead, LeadStatus } from '@/schemas/leads'
import { LeadWithConversation } from '@/types/leads'

export class LeadsService {
  async getAllLeads(): Promise<Lead[]> {
    return await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  async getLeadById(id: string): Promise<LeadWithConversation | null> {
    return await prisma.lead.findUnique({
      where: { id },
      include: {
        conversations: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })
  }

  async updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
    return await prisma.lead.update({
      where: { id },
      data: { status }
    })
  }

  async deleteLead(id: string): Promise<void> {
    await prisma.lead.delete({
      where: { id }
    })
  }
}
```

### **4. Custom Hooks**

#### **Padrão de Implementação:**
```typescript
// src/hooks/leads/use-leads.ts
import { useState, useEffect, useCallback } from 'react'
import { Lead } from '@/types/leads'
import { LeadsService } from '@/services/leads'

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true)
      const service = new LeadsService()
      const data = await service.getAllLeads()
      setLeads(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar leads')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateLeadStatus = useCallback(async (id: string, status: string) => {
    try {
      const service = new LeadsService()
      await service.updateLeadStatus(id, status as any)
      await fetchLeads() // Recarregar dados
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status')
    }
  }, [fetchLeads])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  return {
    leads,
    loading,
    error,
    refetch: fetchLeads,
    updateLeadStatus
  }
}
```

### **5. Utilitários Centralizados**

#### **Constantes:**
```typescript
// src/lib/utils/constants.ts
export const LEAD_STATUS_OPTIONS = [
  { value: 'novo', label: 'Novo', color: 'bg-blue-100 text-blue-800' },
  { value: 'qualificado', label: 'Qualificado', color: 'bg-green-100 text-green-800' },
  { value: 'nao_interessado', label: 'Não Interessado', color: 'bg-red-100 text-red-800' },
  { value: 'fechado', label: 'Fechado', color: 'bg-gray-100 text-gray-800' }
]

export const PAGINATION_DEFAULTS = {
  ITEMS_PER_PAGE: 10,
  MAX_ITEMS_PER_PAGE: 50
}

export const API_ENDPOINTS = {
  LEADS: '/api/leads',
  CONVERSATIONS: '/api/conversations',
  DASHBOARD: '/api/dashboard'
}
```

#### **Formatação:**
```typescript
// src/lib/utils/formatting.ts
import { formatCurrency } from './currency'
import { formatPhone } from './phone'
import { getStatusBadge } from './status-badge'
import { formatRelativeTime } from './relative-time'

export {
  formatCurrency,
  formatPhone,
  getStatusBadge,
  formatRelativeTime
}
```

### **6. APIs (Camada de Apresentação)**

#### **Padrão de Implementação:**
```typescript
// src/app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { LeadsService } from '@/services/leads'

export async function GET() {
  try {
    const service = new LeadsService()
    const leads = await service.getAllLeads()
    return NextResponse.json(leads)
  } catch (error) {
    console.error('Erro ao buscar leads:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const service = new LeadsService()
    const lead = await service.createLead(data)
    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar lead:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
```

## 🎨 Padrões de Componentes

### **1. Uso de Hooks Customizados:**
```typescript
// src/app/dashboard/leads/page.tsx
import { useLeads } from '@/hooks/leads'
import { LEAD_STATUS_OPTIONS } from '@/lib/utils/constants'
import { getStatusBadge } from '@/lib/utils/formatting'

export default function LeadsPage() {
  const { leads, loading, error, updateLeadStatus } = useLeads()
  
  // Componente usa dados do hook
  return (
    <div>
      {leads.map(lead => (
        <div key={lead.id}>
          {getStatusBadge(lead.status)}
          <Select onValueChange={(value) => updateLeadStatus(lead.id, value)}>
            {LEAD_STATUS_OPTIONS.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      ))}
    </div>
  )
}
```

## 🔄 Fluxo de Dados

### **1. Leitura de Dados:**
```
Component → Hook → Service → Prisma → Database
```

### **2. Escrita de Dados:**
```
Component → Hook → Service → Prisma → Database
```

### **3. Validação:**
```
API Request → Zod Schema → Service → Database
```

## 📋 Checklist de Implementação

### **Para Novas Features:**

#### **1. Schemas e Tipos:**
- [ ] Criar schema Zod em `src/schemas/[domain]/`
- [ ] Criar tipos TypeScript em `src/types/[domain]/`
- [ ] Adicionar exports nos arquivos `index.ts`

#### **2. Services:**
- [ ] Criar service em `src/services/[domain]/`
- [ ] Implementar métodos CRUD
- [ ] Adicionar tratamento de erros
- [ ] Adicionar exports no `index.ts`

#### **3. Hooks:**
- [ ] Criar hook em `src/hooks/[domain]/`
- [ ] Implementar estado e lógica
- [ ] Adicionar tratamento de erros
- [ ] Adicionar exports no `index.ts`

#### **4. APIs:**
- [ ] Criar rota em `src/app/api/[domain]/`
- [ ] Usar service layer
- [ ] Implementar validação com Zod
- [ ] Adicionar tratamento de erros

#### **5. Componentes:**
- [ ] Usar hooks customizados
- [ ] Usar constantes centralizadas
- [ ] Usar utilitários de formatação
- [ ] Implementar loading states

#### **6. Utilitários:**
- [ ] Adicionar constantes em `src/lib/utils/constants.ts`
- [ ] Adicionar funções de formatação em `src/lib/utils/formatting.ts`
- [ ] Adicionar exports nos arquivos `index.ts`

## 🚀 Benefícios da Arquitetura

### **1. Manutenibilidade:**
- Código organizado por domínio
- Responsabilidades bem definidas
- Fácil localização de código

### **2. Reutilização:**
- Services reutilizáveis
- Hooks compartilhados
- Utilitários centralizados

### **3. Escalabilidade:**
- Estrutura preparada para crescimento
- Padrões consistentes
- Fácil adição de novas features

### **4. Testabilidade:**
- Services isolados e testáveis
- Hooks customizados com testes completos
- Lógica separada da UI
- Schemas Zod validados
- Componentes UI testados
- Integração com Jest e Testing Library

### **5. Type Safety:**
- TypeScript strict mode
- Schemas Zod para validação
- Tipos bem definidos

## 📚 Documentação Relacionada

- [Estratégia de Testes](testing-strategy.md) - Configuração e padrões de testes
- [Melhores Práticas](best-practices.md) - Padrões gerais do projeto
- [Guia de Erros](lint-build-errors-guide.md) - Erros comuns e soluções
- [README](README.md) - Visão geral da documentação

---

**Última atualização:** Janeiro 2024  
**Versão da Arquitetura:** 2.0  
**Responsável:** Equipe de Desenvolvimento 