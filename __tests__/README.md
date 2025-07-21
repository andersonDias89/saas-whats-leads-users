# 🧪 Estratégia de Testes - Cursor SaaS WhatsApp Leads

## 📋 Visão Geral

Este documento descreve a estratégia completa de testes implementada no projeto, incluindo configuração, estrutura e exemplos práticos.

## 🎯 Objetivos dos Testes

### **1. Cobertura de Código**
- **Mínimo:** 70% de cobertura
- **Meta:** 80%+ de cobertura
- **Foco:** Lógica de negócio e APIs

### **2. Qualidade do Código**
- Detectar bugs precocemente
- Garantir refatorações seguras
- Documentar comportamento esperado

### **3. Confiança nas Deployments**
- Testes automatizados em CI/CD
- Validação de integrações críticas
- Prevenção de regressões

## 🏗️ Estrutura de Testes

```
__tests__/
├── schemas/                    # Testes de validação Zod
│   ├── leads/
│   │   ├── lead.test.ts       # Schema de leads
│   │   └── status.test.ts     # Schema de status
│   ├── auth/
│   └── conversations/
├── services/                   # Testes da camada de negócio
│   ├── leads/
│   │   └── leads-service.test.ts
│   ├── conversations/
│   └── auth/
├── hooks/                      # Testes de hooks customizados
│   ├── leads/
│   │   └── use-leads.test.tsx
│   └── conversations/
├── api/                        # Testes de APIs
│   ├── leads/
│   │   └── route.test.ts
│   ├── conversations/
│   └── webhook/
├── components/                 # Testes de componentes
│   ├── ui/
│   │   ├── button.test.tsx
│   │   └── input.test.tsx
│   └── dashboard/
├── utils/                      # Testes de utilitários
│   ├── date.test.ts
│   └── formatting.test.ts
├── integration/                # Testes de integração
│   ├── lead-workflow.test.tsx
│   └── auth-flow.test.tsx
└── types/                      # Tipos para testes
    └── jest.d.ts
```

## 🧪 Tipos de Testes

### **1. Testes Unitários**

#### **Schemas (Validação Zod)**
```typescript
// __tests__/schemas/leads/lead.test.ts
describe('Lead Schema', () => {
  test('deve validar lead válido', () => {
    const validLead = {
      name: 'João Silva',
      phone: '11999999999',
      status: 'novo'
    }
    
    const result = leadSchema.safeParse(validLead)
    expect(result.success).toBe(true)
  })
})
```

#### **Services (Camada de Negócio)**
```typescript
// __tests__/services/leads/leads-service.test.ts
describe('LeadsService', () => {
  test('deve retornar leads do usuário', async () => {
    const mockLeads = [{ id: '1', name: 'Lead 1' }]
    ;(prisma.lead.findMany as jest.Mock).mockResolvedValue(mockLeads)
    
    const result = await LeadsService.getLeadsByUserId('user1')
    expect(result).toEqual(mockLeads)
  })
})
```

#### **Hooks Customizados**
```typescript
// __tests__/hooks/leads/use-leads.test.tsx
describe('useLeads', () => {
  test('deve carregar leads com sucesso', async () => {
    const mockLeads = [{ id: '1', name: 'Lead 1' }]
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockLeads
    })

    const { result } = renderHook(() => useLeads())
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(result.current.leads).toEqual(mockLeads)
  })
})
```

### **2. Testes de API**

#### **API Routes**
```typescript
// __tests__/api/leads/route.test.ts
describe('/api/leads', () => {
  test('deve retornar leads do usuário autenticado', async () => {
    const mockSession = { user: { id: 'user1' } }
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
    
    const response = await GET()
    expect(response.status).toBe(200)
  })
})
```

#### **Webhooks**
```typescript
// __tests__/api/conversations/webhook.test.ts
describe('Twilio Webhook', () => {
  test('deve processar mensagem recebida', async () => {
    const formData = new FormData()
    formData.append('From', '5511999999999')
    formData.append('Body', 'Olá')
    
    const request = new NextRequest('http://localhost/api/conversations/webhook', {
      method: 'POST',
      body: formData
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
  })
})
```

### **3. Testes de Componentes**

#### **Componentes UI**
```typescript
// __tests__/components/ui/button.test.tsx
describe('Button Component', () => {
  test('deve renderizar com texto correto', () => {
    render(<Button>Clique aqui</Button>)
    expect(screen.getByRole('button', { name: 'Clique aqui' })).toBeInTheDocument()
  })

  test('deve chamar onClick quando clicado', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Clique aqui</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### **4. Testes de Integração**

#### **Fluxos Completos**
```typescript
// __tests__/integration/lead-workflow.test.tsx
describe('Lead Workflow Integration', () => {
  test('deve criar lead e atualizar status', async () => {
    render(<LeadsPage />)
    
    // Preencher formulário
    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'Novo Lead' }
    })
    
    // Submeter formulário
    fireEvent.click(screen.getByRole('button', { name: 'Criar Lead' }))
    
    // Verificar se lead foi criado
    await waitFor(() => {
      expect(screen.getByText('Novo Lead')).toBeInTheDocument()
    })
  })
})
```

## 🔧 Configuração

### **Jest Configuration**
```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
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

module.exports = createJestConfig(customJestConfig)
```

### **Setup do Jest**
```javascript
// jest.setup.js
import '@testing-library/jest-dom'

// Mocks globais
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    lead: { findMany: jest.fn(), findFirst: jest.fn() },
    conversation: { findMany: jest.fn() },
    message: { findMany: jest.fn() },
  },
}))

global.fetch = jest.fn()
```

## 📊 Scripts de Teste

### **Package.json Scripts**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

### **Comandos Disponíveis**
```bash
npm test              # Executar todos os testes
npm run test:watch    # Executar em modo watch
npm run test:coverage # Executar com relatório de cobertura
npm run test:ci       # Executar para CI/CD
```

## 🎯 Prioridades de Teste

### **ALTA Prioridade**
1. **Schemas Zod** - Validação de dados
2. **Services** - Lógica de negócio
3. **Hooks Customizados** - Estado e lógica
4. **APIs** - Endpoints críticos
5. **Webhooks** - Integrações externas

### **MÉDIA Prioridade**
1. **Componentes UI** - Interface do usuário
2. **Utilitários** - Funções auxiliares
3. **Testes de Integração** - Fluxos completos

### **BAIXA Prioridade**
1. **Testes E2E** - Fluxos end-to-end
2. **Testes de Performance** - Otimizações

## 🚀 Implementação Gradual

### **Fase 1: Base (Semana 1)**
- [x] Configuração do Jest
- [x] Testes de Schemas
- [x] Testes básicos de Services
- [ ] Testes de Hooks principais

### **Fase 2: APIs (Semana 2)**
- [ ] Testes de API Routes
- [ ] Testes de Webhooks
- [ ] Testes de autenticação

### **Fase 3: UI (Semana 3)**
- [ ] Testes de componentes UI
- [ ] Testes de páginas
- [ ] Testes de formulários

### **Fase 4: Integração (Semana 4)**
- [ ] Testes de fluxos completos
- [ ] Testes de integração
- [ ] Otimização de cobertura

## 📈 Métricas de Qualidade

### **Cobertura de Código**
- **Schemas:** 95%+
- **Services:** 90%+
- **Hooks:** 85%+
- **APIs:** 80%+
- **Componentes:** 70%+

### **Performance dos Testes**
- **Tempo total:** < 30 segundos
- **Testes unitários:** < 5 segundos
- **Testes de integração:** < 15 segundos

## 🔍 Boas Práticas

### **1. Nomenclatura**
```typescript
// ✅ Correto
describe('LeadsService', () => {
  test('deve retornar leads do usuário', () => {
    // teste
  })
})

// ❌ Evitar
describe('test', () => {
  it('should work', () => {
    // teste
  })
})
```

### **2. Organização**
```typescript
describe('Component', () => {
  describe('quando renderizado', () => {
    test('deve mostrar conteúdo', () => {
      // teste
    })
  })

  describe('quando clicado', () => {
    test('deve executar ação', () => {
      // teste
    })
  })
})
```

### **3. Mocks**
```typescript
// ✅ Mock específico
jest.mock('@/lib/prisma', () => ({
  prisma: {
    lead: { findMany: jest.fn() }
  }
}))

// ❌ Mock genérico
jest.mock('@/lib/prisma')
```

### **4. Assertions**
```typescript
// ✅ Assertions específicas
expect(result).toEqual(expectedData)
expect(mockFunction).toHaveBeenCalledWith(expectedArgs)

// ❌ Assertions genéricas
expect(result).toBeTruthy()
```

## 🚨 Troubleshooting

### **Erros Comuns**

#### **1. Módulo não encontrado**
```bash
# Solução: Verificar path mapping no jest.config.js
moduleNameMapping: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

#### **2. Mock não funciona**
```typescript
// Solução: Limpar mocks antes de cada teste
beforeEach(() => {
  jest.clearAllMocks()
})
```

#### **3. Teste assíncrono falha**
```typescript
// Solução: Usar waitFor para testes assíncronos
await waitFor(() => {
  expect(element).toBeInTheDocument()
})
```

## 📚 Recursos Adicionais

### **Documentação**
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing](https://nextjs.org/docs/testing)

### **Ferramentas**
- **Jest** - Framework de testes
- **Testing Library** - Utilitários para testes
- **MSW** - Mock Service Worker (para APIs)
- **Playwright** - Testes E2E (futuro)

---

**Última atualização:** Janeiro 2024  
**Versão dos Testes:** 1.0  
**Responsável:** Equipe de Desenvolvimento 