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
│   ├── leads/                 # Componentes específicos de leads
│   │   ├── create-lead-modal.tsx # Modal de criação manual
│   │   ├── import-leads-modal.tsx # Modal de importação em massa
│   │   └── index.ts           # Exports
├── hooks/                       # Hooks customizados por domínio
│   ├── leads/                  # Hooks de leads
│   │   ├── use-leads.ts       # Hook para lista e criação de leads
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
│   │   ├── lead.ts           # Schema de lead e criação
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

// Schema para validação geral de leads
export const leadSchema = z.object({
  name: z.string().optional(),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email().optional(),
  status: leadStatusSchema,
  notes: z.string().optional()
})

// Schema específico para criação manual de leads
export const createLeadSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  status: leadStatusSchema,
  notes: z.string().optional().or(z.literal('')),
  source: z.enum(['whatsapp', 'manual'])
})
```

### **2. Services (Lógica de Negócio)**

#### **Padrão de Serviço:**
```typescript
// src/services/leads/leads-service.ts
export class LeadsService {
  // Buscar leads do usuário
  static async getLeadsByUserId(userId: string): Promise<LeadWithConversation[]>
  
  // Criar lead manualmente
  static async createLead(userId: string, data: CreateLeadData): Promise<LeadWithConversation>
  
  // Atualizar lead
  static async updateLead(leadId: string, userId: string, data: UpdateLeadData): Promise<LeadWithConversation>
  
  // Deletar lead
  static async deleteLead(leadId: string, userId: string): Promise<void>
}
```

### **3. Hooks Customizados**

#### **Padrão de Hook:**
```typescript
// src/hooks/leads/use-leads.ts
export function useLeads() {
  const [leads, setLeads] = useState<LeadWithConversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Carregar leads
  const loadLeads = useCallback(async () => { /* ... */ }, [])
  
  // Criar lead manualmente
  const createLead = useCallback(async (data: CreateLeadData) => { /* ... */ }, [])
  
  // Atualizar status
  const updateLeadStatus = useCallback(async (leadId: string, status: LeadStatus) => { /* ... */ }, [])
  
  // Deletar lead
  const deleteLead = useCallback(async (leadId: string) => { /* ... */ }, [])

  return {
    leads,
    isLoading,
    loadLeads,
    createLead,
    updateLeadStatus,
    deleteLead
  }
}
```

### **4. APIs REST**

#### **Padrão de API:**
```typescript
// src/app/api/leads/route.ts
export async function GET() {
  // Buscar leads do usuário autenticado
}

export async function POST(request: NextRequest) {
  // Criar lead manualmente
  const session = await getServerSession(authOptions)
  const body = await request.json()
  const validatedData = createLeadSchema.parse(body)
  
  const lead = await LeadsService.createLead(session.user.id, validatedData)
  return NextResponse.json(lead, { status: 201 })
}
```

## 🎨 Componentes UI

### **Modal de Criação Manual:**
```typescript
// src/components/leads/create-lead-modal.tsx
export function CreateLeadModal({ open, onOpenChange, onSubmit }: CreateLeadModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateLeadData>({
    resolver: zodResolver(createLeadSchema)
  })
  
  // Formulário com validação em tempo real
  // Ícones intuitivos (User, Phone, Mail, FileText)
  // Feedback visual de sucesso/erro
}
```

## 📊 Modelo de Dados

### **Lead com Origem:**
```typescript
model Lead {
  id             String   @id @default(cuid())
  userId         String
  conversationId String?  // Opcional - leads manuais não têm conversa
  name           String?
  phone          String
  email          String?
  status         String   @default("novo")
  source         String   @default("whatsapp") // "whatsapp" | "manual"
  notes          String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  conversation Conversation? @relation(fields: [conversationId], references: [id], onDelete: SetNull)
}
```

## 🚀 Funcionalidades Principais

### **1. Criação Manual de Leads**
- Modal moderno e arrastável
- Validação completa com Zod
- Integração com botão "Novo Lead"
- Badge visual indicando origem

### **2. Importação em Massa de Leads**
- Modal de upload com drag & drop
- Suporte para arquivos CSV e Excel
- Template para download com 20 leads de exemplo
- Barra de progresso em tempo real
- Validação linha por linha com feedback detalhado
- Processamento em lote com tratamento de erros

### **3. Origem dos Leads**
- **WhatsApp**: Leads vindos de conversas
- **Manual**: Leads cadastrados manualmente
- Ícones distintos (MessageSquare vs Edit3)
- Exibição discreta ao lado do nome

### **4. Regras de Negócio**
- Leads podem ter ou não conversa associada
- Validação de telefone único por usuário
- Status em português
- Campo `value` removido

## 🔄 Fluxo de Dados

### **Criação Manual:**
1. Usuário clica em "Novo Lead"
2. Modal abre com formulário
3. Dados validados com `createLeadSchema`
4. API `/api/leads` (POST) processa
5. `LeadsService.createLead()` executa
6. Lead criado com `source: 'manual'`
7. Lista atualizada automaticamente

### **Importação em Massa:**
1. Usuário clica em "Importar"
2. Modal abre com área de upload
3. Arquivo processado e validado com `importLeadsSchema`
4. API `/api/leads/import` (POST) processa
5. `LeadsService.importLeads()` executa linha por linha
6. Leads criados com `source: 'manual'`
7. Resultado com contadores de sucesso/erro
8. Lista atualizada automaticamente

### **Exibição:**
1. Leads carregados via `useLeads()`
2. Origem exibida com ícone discreto
3. Telefone formatado (sem prefixo whatsapp:)
4. Status e ações disponíveis

## 📚 Documentação Relacionada

- [docs/testing-strategy.md](mdc:docs/testing-strategy.md) - Estratégia de testes
- [docs/best-practices.md](mdc:docs/best-practices.md) - Melhores práticas
- [docs/lint-build-errors-guide.md](mdc:docs/lint-build-errors-guide.md) - Guia de erros 