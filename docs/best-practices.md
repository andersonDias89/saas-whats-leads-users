# Melhores Práticas do Projeto - Cursor SaaS WhatsApp Leads

## 🎯 Visão Geral

Este documento estabelece as melhores práticas específicas do projeto para manter consistência, qualidade e evitar erros comuns.

## 📁 Estrutura do Projeto

### **Convenções de Pastas**
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Rotas de API (sempre aqui!)
│   ├── dashboard/         # Páginas do dashboard
│   └── (auth)/           # Páginas de autenticação
├── components/            # Componentes reutilizáveis
├── lib/                   # Utilitários e configurações
├── schemas/               # Schemas Zod
└── types/                 # Tipos TypeScript
```

### **⚠️ Regra Importante:**
- **APIs SEMPRE em `/api/`** - Nunca criar rotas alternativas
- **Webhooks externos** devem ser configurados para usar `/api/...`

---

## 🔧 Configurações de Desenvolvimento

### **ESLint - Regras Obrigatórias**
```javascript
// eslint.config.mjs
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended'
  ],
  rules: {
    // OBRIGATÓRIO: Detectar imports não utilizados
    '@typescript-eslint/no-unused-vars': 'error',
    
    // OBRIGATÓRIO: Verificar dependências de hooks
    'react-hooks/exhaustive-deps': 'warn',
    
    // RECOMENDADO: Tipagem explícita
    '@typescript-eslint/explicit-function-return-type': 'warn',
    
    // RECOMENDADO: Preferir const
    'prefer-const': 'error'
  }
}
```

### **TypeScript - Configurações Strict**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## 🎨 Padrões de Código

### **1. Imports e Exports**

#### ✅ **Correto:**
```typescript
// Imports organizados
import { useState, useEffect, useCallback } from 'react'
import { prisma } from '@/lib/prisma'
import { twilioWebhookSchema } from '@/schemas'

// Exports nomeados
export { twilioWebhookSchema }
export type { User, Lead, Conversation }
```

#### ❌ **Evitar:**
```typescript
// Imports não utilizados
import { useState, useEffect, useCallback, useMemo } from 'react'
// useMemo não usado

// Exports default desnecessários
export default function Component() {}
```

### **2. Hooks React**

#### ✅ **Correto:**
```typescript
const fetchData = useCallback(async () => {
  // lógica
}, [dependencies])

useEffect(() => {
  fetchData()
}, [fetchData])
```

#### ❌ **Evitar:**
```typescript
useEffect(() => {
  fetchData() // fetchData não nas dependências
}, [])
```

### **3. Tipagem TypeScript**

#### ✅ **Correto:**
```typescript
interface Lead {
  id: string
  name: string
  status: 'novo' | 'contactado' | 'convertido'
}

const handleStatusChange = (value: string): void => {
  // lógica
}
```

#### ❌ **Evitar:**
```typescript
const handleStatusChange = (value) => {
  // sem tipagem
}
```

---

## 🌐 Padrões de API

### **1. Rotas de API**

#### ✅ **Correto:**
```
/api/conversations/webhook
/api/leads
/api/users
```

#### ❌ **Evitar:**
```
/conversations/webhook  # Fora de /api/
```

### **2. Validação com Zod**

#### ✅ **Correto:**
```typescript
import { z } from 'zod'

const webhookSchema = z.object({
  From: z.string(),
  To: z.string(),
  Body: z.string()
})

export async function POST(req: NextRequest) {
  const data = await req.json()
  const validatedData = webhookSchema.parse(data)
}
```

### **3. Tratamento de Erros**

#### ✅ **Correto:**
```typescript
try {
  const result = await prisma.lead.create({ data })
  return NextResponse.json(result)
} catch (error) {
  console.error('Erro ao criar lead:', error)
  return NextResponse.json(
    { message: 'Erro interno do servidor' },
    { status: 500 }
  )
}
```

---

## 🗄️ Padrões de Banco de Dados

### **1. Status em Português**

#### ✅ **Correto:**
```typescript
// Frontend
const statusOptions = [
  { value: 'novo', label: 'Novo' },
  { value: 'contactado', label: 'Contactado' },
  { value: 'convertido', label: 'Convertido' }
]

// Backend (Prisma)
model Lead {
  status String @default("novo")
}
```

#### ❌ **Evitar:**
```typescript
// Misturar idiomas
{ value: 'new', label: 'Novo' }
{ value: 'contacted', label: 'Contactado' }
```

### **2. Relacionamentos**

#### ✅ **Correto:**
```typescript
// Sempre incluir relacionamentos necessários
const lead = await prisma.lead.findFirst({
  where: { id },
  include: {
    conversation: true,
    user: true
  }
})
```

---

## 🔄 Fluxo de Desenvolvimento

### **1. Antes de Começar**
```bash
# Verificar se não há erros
npm run lint
npm run build
```

### **2. Durante Desenvolvimento**
```bash
# Executar em paralelo
npm run dev
npm run lint -- --watch
```

### **3. Antes de Commitar**
```bash
# Checklist obrigatório
npm run lint
npm run build
npm run type-check
```

---

## 🚨 Checklist de Qualidade

### **Cada Commit Deve:**
- [ ] Passar em `npm run lint`
- [ ] Passar em `npm run build`
- [ ] Não ter imports não utilizados
- [ ] Não ter variáveis não utilizadas
- [ ] Ter tipagem TypeScript adequada
- [ ] Seguir padrões de nomenclatura
- [ ] Manter consistência de idioma (PT-BR)

### **Cada PR Deve:**
- [ ] Ter testes (quando aplicável)
- [ ] Ter documentação atualizada
- [ ] Seguir padrões de commit
- [ ] Ser revisado por outro desenvolvedor

---

## 📚 Recursos Úteis

### **Comandos Frequentes**
```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção

# Qualidade
npm run lint         # Verificar lint
npm run lint:fix     # Corrigir lint automaticamente
npx tsc --noEmit     # Verificar tipos

# Banco de dados
npx prisma generate  # Gerar cliente Prisma
npx prisma db push   # Sincronizar schema
npx prisma studio    # Interface visual do banco
```

### **Extensões Recomendadas (VS Code/Cursor)**
- ESLint
- Prettier
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer

---

## 🔍 Debugging

### **Problemas Comuns**

#### **1. Webhook 404**
- ✅ Verificar se rota está em `/api/`
- ✅ Verificar configuração do Twilio
- ✅ Verificar ngrok tunnel

#### **2. Status não aparece**
- ✅ Verificar consistência PT-BR
- ✅ Verificar banco de dados
- ✅ Verificar frontend/backend

#### **3. Build falha**
- ✅ Verificar imports não utilizados
- ✅ Verificar tipagem TypeScript
- ✅ Verificar dependências

---

**Última atualização:** Janeiro 2024  
**Responsável:** Equipe de Desenvolvimento  
**Versão:** 1.0 