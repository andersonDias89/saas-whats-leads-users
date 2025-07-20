# Guia de Erros de Lint e Build - Correções e Prevenção

## 📋 Visão Geral

Este documento registra os erros de lint e build que foram identificados e corrigidos no projeto, servindo como referência para evitar que sejam cometidos novamente.

## 🚨 Erros Corrigidos

### 1. **Imports Não Utilizados**

#### ❌ **Problema:**
```typescript
import { useState, useEffect, useCallback } from 'react'
// useCallback não estava sendo usado
```

#### ✅ **Solução:**
```typescript
import { useState, useEffect } from 'react'
// Remover imports não utilizados
```

#### 📍 **Arquivos Afetados:**
- `src/app/dashboard/leads/page.tsx`
- `src/app/dashboard/leads/[id]/page.tsx`

#### 🔧 **Prevenção:**
- Sempre verificar se todos os imports estão sendo utilizados
- Usar ESLint com regra `no-unused-vars`
- Remover imports automaticamente com VS Code/Cursor

---

### 2. **Variáveis Não Utilizadas**

#### ❌ **Problema:**
```typescript
const [loading, setLoading] = useState(false)
// setLoading nunca foi usado
```

#### ✅ **Solução:**
```typescript
// Remover variável não utilizada
// const [loading, setLoading] = useState(false)
```

#### 📍 **Arquivos Afetados:**
- `src/app/dashboard/leads/page.tsx`

#### 🔧 **Prevenção:**
- Verificar se variáveis de estado têm setters utilizados
- Usar prefixo `_` para variáveis intencionalmente não utilizadas
- Configurar ESLint para detectar variáveis não utilizadas

---

### 3. **Dependências de useEffect Ausentes**

#### ❌ **Problema:**
```typescript
useEffect(() => {
  fetchLeads()
}, []) // fetchLeads não estava nas dependências
```

#### ✅ **Solução:**
```typescript
const fetchLeads = useCallback(async () => {
  // lógica de fetch
}, [])

useEffect(() => {
  fetchLeads()
}, [fetchLeads])
```

#### 📍 **Arquivos Afetados:**
- `src/app/dashboard/leads/page.tsx`

#### 🔧 **Prevenção:**
- Sempre incluir funções chamadas no useEffect nas dependências
- Usar `useCallback` para funções que são dependências
- Configurar ESLint com `exhaustive-deps`

---

### 4. **Tipagem TypeScript Ausente**

#### ❌ **Problema:**
```typescript
const handleStatusChange = (value) => {
  // value sem tipagem
}
```

#### ✅ **Solução:**
```typescript
const handleStatusChange = (value: string) => {
  // value com tipagem explícita
}
```

#### 📍 **Arquivos Afetados:**
- `src/app/dashboard/leads/page.tsx`
- `src/app/dashboard/leads/[id]/page.tsx`

#### 🔧 **Prevenção:**
- Sempre tipar parâmetros de funções
- Usar `strict: true` no `tsconfig.json`
- Configurar ESLint com regras TypeScript

---

### 5. **Valores de Status Inconsistentes**

#### ❌ **Problema:**
```typescript
const statusOptions = [
  { value: 'new', label: 'Novo' }, // 'new' em inglês
  { value: 'contacted', label: 'Contactado' }
]
```

#### ✅ **Solução:**
```typescript
const statusOptions = [
  { value: 'novo', label: 'Novo' }, // 'novo' em português
  { value: 'contactado', label: 'Contactado' }
]
```

#### 📍 **Arquivos Afetados:**
- `src/app/dashboard/leads/page.tsx`
- `src/app/dashboard/leads/[id]/page.tsx`

#### 🔧 **Prevenção:**
- Manter consistência entre frontend e backend
- Usar constantes para valores de status
- Documentar valores aceitos para cada campo

---

### 6. **Roteamento de API Incorreto**

#### ❌ **Problema:**
```typescript
// Rota alternativa criada incorretamente
src/app/conversations/webhook/route.ts
```

#### ✅ **Solução:**
```typescript
// Usar rota principal correta
src/app/api/conversations/webhook/route.ts
```

#### 📍 **Arquivos Afetados:**
- Estrutura de pastas do projeto

#### 🔧 **Prevenção:**
- Seguir convenção Next.js: APIs em `/api/`
- Configurar webhooks externos para usar rotas corretas
- Documentar estrutura de rotas do projeto

---

## 🛠️ Configurações Recomendadas

### **ESLint Configuration**
```javascript
// eslint.config.mjs
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'warn'
  }
}
```

### **TypeScript Configuration**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### **VS Code/Cursor Settings**
```json
{
  "editor.codeActionsOnSave": {
    "source.removeUnusedImports": true,
    "source.organizeImports": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

---

## 📝 Checklist de Prevenção

### **Antes de Commitar:**
- [ ] Executar `npm run lint` e corrigir erros
- [ ] Executar `npm run build` e verificar build
- [ ] Verificar imports não utilizados
- [ ] Verificar variáveis não utilizadas
- [ ] Verificar dependências de useEffect
- [ ] Verificar tipagem TypeScript
- [ ] Verificar consistência de valores (frontend/backend)

### **Durante Desenvolvimento:**
- [ ] Usar ESLint em tempo real
- [ ] Configurar auto-fix no editor
- [ ] Verificar console por warnings
- [ ] Testar funcionalidades afetadas
- [ ] Manter documentação atualizada

---

## 🔍 Comandos Úteis

```bash
# Verificar erros de lint
npm run lint

# Verificar build
npm run build

# Verificar tipos TypeScript
npx tsc --noEmit

# Auto-fix de lint
npm run lint -- --fix

# Verificar dependências desatualizadas
npm audit
```

---

## 📚 Referências

- [Next.js ESLint Configuration](https://nextjs.org/docs/basic-features/eslint)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [React Hooks Rules](https://react.dev/warnings/invalid-hook-call-warning)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

## 📅 Histórico de Correções

| Data | Erro | Arquivo | Solução |
|------|------|---------|---------|
| 2024-01-XX | Imports não utilizados | `leads/page.tsx` | Removidos imports desnecessários |
| 2024-01-XX | Dependências useEffect | `leads/page.tsx` | Adicionado useCallback |
| 2024-01-XX | Tipagem ausente | `leads/[id]/page.tsx` | Adicionada tipagem explícita |
| 2024-01-XX | Status inconsistentes | `leads/*.tsx` | Alinhados valores PT-BR |
| 2024-01-XX | Roteamento incorreto | Estrutura | Removida rota alternativa |

---

**Última atualização:** Janeiro 2024  
**Responsável:** Equipe de Desenvolvimento  
**Versão:** 1.0 