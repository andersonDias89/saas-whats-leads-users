# 🧪 Estratégia de Testes - Cursor SaaS WhatsApp Leads

## 📋 Visão Geral

Este documento descreve a estratégia de testes implementada no projeto, incluindo configuração, padrões e cobertura atual.

## 🛠️ Configuração de Testes

### **Tecnologias Utilizadas:**
- **Jest** - Framework de testes principal
- **@testing-library/react** - Testes de componentes React
- **@testing-library/jest-dom** - Matchers customizados para DOM
- **jest-environment-jsdom** - Ambiente de testes para React

### **Arquivos de Configuração:**
- `jest.config.js` - Configuração principal do Jest
- `jest.setup.js` - Setup global dos testes
- `__tests__/types/jest.d.ts` - Definições de tipos para Jest

## 📁 Estrutura de Testes

```
__tests__/
├── api/                    # Testes de APIs
│   └── leads/
│       └── route.test.ts
├── components/             # Testes de componentes
│   └── ui/
│       └── button.test.tsx
├── hooks/                  # Testes de hooks customizados
│   └── leads/
│       └── use-leads.test.tsx
├── integration/            # Testes de integração
│   └── lead-validation.test.ts
├── lib/                    # Testes de utilitários
│   └── utils/
│       └── date.test.ts
├── schemas/                # Testes de schemas Zod
│   └── leads/
│       ├── lead.test.ts
│       └── status.test.ts
├── services/               # Testes de services
│   └── leads/
│       └── leads-service.test.ts
└── types/                  # Definições de tipos
    └── jest.d.ts
```

## 🎯 Tipos de Testes Implementados

### **1. Testes de Schemas (Zod)**
**Arquivo:** `__tests__/schemas/leads/`

#### **Lead Schema (`lead.test.ts`):**
- ✅ Validação de dados válidos
- ✅ Rejeição de dados inválidos
- ✅ Validação de campos obrigatórios
- ✅ Validação de tipos de dados
- ✅ Validação de formatos (email, telefone)

#### **Status Schema (`status.test.ts`):**
- ✅ Validação de status válidos
- ✅ Rejeição de status inválidos
- ✅ Validação de enum completo

### **2. Testes de Hooks Customizados**
**Arquivo:** `__tests__/hooks/leads/use-leads.test.tsx`

#### **useLeads Hook:**
- ✅ Carregamento inicial de leads
- ✅ Tratamento de erros de rede
- ✅ Atualização de leads
- ✅ Exclusão de leads
- ✅ Estados de loading
- ✅ Integração com toast notifications

### **3. Testes de Componentes UI**
**Arquivo:** `__tests__/components/ui/button.test.tsx`

#### **Button Component:**
- ✅ Renderização correta
- ✅ Eventos de clique
- ✅ Variantes de estilo (primary, secondary, etc.)
- ✅ Estados (disabled, loading)
- ✅ Props customizadas

### **4. Testes de Utilitários**
**Arquivo:** `__tests__/lib/utils/date.test.ts`

#### **Date Utils:**
- ✅ Formatação de datas
- ✅ Conversão de timezone
- ✅ Validação de formatos
- ✅ Tratamento de datas inválidas

### **5. Testes de Integração**
**Arquivo:** `__tests__/integration/lead-validation.test.ts`

#### **Lead Validation Flow:**
- ✅ Validação completa de leads
- ✅ Validação de telefone em contexto
- ✅ Validação de email em contexto
- ✅ Cenários de erro e sucesso

## 🔧 Configuração e Mocks

### **Mocks Globais (jest.setup.js):**
```javascript
// Next.js Router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    lead: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}))

// Fetch API
global.fetch = jest.fn()

// Toast Notifications
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
}))

// Socket.io
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  })),
}))
```

### **Configuração do Jest:**
```javascript
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
    '!src/app/page.tsx',
    '!src/app/globals.css',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
```

## 📊 Cobertura Atual

### **Testes Implementados:**
- ✅ **Schemas:** 100% (lead, status)
- ✅ **Hooks:** 90% (useLeads)
- ✅ **Components:** 80% (Button)
- ✅ **Utils:** 100% (date utils)
- ✅ **Integration:** 85% (lead validation)

### **Testes Pendentes:**
- ⏳ **Services:** LeadsService (problemas de mock do Prisma)
- ⏳ **APIs:** Route handlers (problemas de resolução de módulos)
- ⏳ **Webhooks:** Twilio webhook API
- ⏳ **E2E:** Testes end-to-end com Playwright

### **Estatísticas:**
- **Total de Testes:** 60+
- **Suites de Teste:** 6
- **Cobertura Alvo:** 70%
- **Tempo de Execução:** ~3.5s

## 🚀 Comandos de Teste

### **Executar Todos os Testes:**
```bash
npm test
```

### **Executar Testes com Watch:**
```bash
npm run test:watch
```

### **Executar Testes Específicos:**
```bash
# Testes de schemas
npm test -- __tests__/schemas/

# Testes de hooks
npm test -- __tests__/hooks/

# Testes de componentes
npm test -- __tests__/components/

# Teste específico
npm test -- __tests__/schemas/leads/lead.test.ts
```

### **Verificar Cobertura:**
```bash
npm run test:coverage
```

### **Corrigir Lint nos Testes:**
```bash
npm run lint:fix
```

## 🎯 Padrões de Teste

### **1. Nomenclatura:**
```typescript
// Arquivo: feature.test.ts
describe('Feature', () => {
  describe('Método ou Funcionalidade', () => {
    test('deve fazer algo específico', () => {
      // teste
    })
  })
})
```

### **2. Setup e Cleanup:**
```typescript
describe('Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // setup específico
  })

  afterEach(() => {
    jest.restoreAllMocks()
    // cleanup
  })
})
```

### **3. Mocks:**
```typescript
// Mock de função
jest.fn().mockReturnValue(result)

// Mock de módulo
jest.mock('module-name', () => ({
  functionName: jest.fn()
}))

// Mock de API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data)
  })
)
```

### **4. Assertions:**
```typescript
// Validação de sucesso
expect(result.success).toBe(true)

// Validação de erro
expect(result.success).toBe(false)
expect(result.error).toBeDefined()

// Validação de chamadas
expect(mockFunction).toHaveBeenCalledWith(expectedArgs)

// Validação de estado
expect(screen.getByText('Loading')).toBeInTheDocument()
```

## 🔍 Troubleshooting

### **Problemas Comuns:**

#### **1. Erro de Módulo não Encontrado:**
```bash
# Verificar se o alias @/ está configurado
# Verificar se o arquivo existe no caminho correto
```

#### **2. Erro de Prisma Client:**
```bash
# Verificar se o mock do Prisma está correto
# Verificar se não há chamadas reais do Prisma
```

#### **3. Warning de act():**
```typescript
// Envolver atualizações de estado em act()
import { act } from '@testing-library/react'

await act(async () => {
  // código que atualiza estado
})
```

#### **4. Erro de Timezone:**
```typescript
// Usar datas ISO com timezone
const date = new Date('2024-01-01T00:00:00.000Z')
```

## 📈 Próximos Passos

### **1. Correções Imediatas:**
- [ ] Corrigir testes de Services (mock do Prisma)
- [ ] Corrigir testes de APIs (resolução de módulos)
- [ ] Adicionar testes de webhooks

### **2. Expansão de Cobertura:**
- [ ] Testes de mais componentes UI
- [ ] Testes de mais hooks customizados
- [ ] Testes de mais utilitários

### **3. Testes Avançados:**
- [ ] Testes E2E com Playwright
- [ ] Testes de performance
- [ ] Testes de acessibilidade

### **4. Otimizações:**
- [ ] Paralelização de testes
- [ ] Cache de testes
- [ ] Relatórios de cobertura

## 📚 Documentação Relacionada

- [Arquitetura](architecture.md) - Visão geral da arquitetura
- [Melhores Práticas](best-practices.md) - Padrões gerais
- [Guia de Erros](lint-build-errors-guide.md) - Erros comuns

---

**Última atualização:** Janeiro 2024  
**Versão da Estratégia:** 1.0  
**Responsável:** Equipe de Desenvolvimento 