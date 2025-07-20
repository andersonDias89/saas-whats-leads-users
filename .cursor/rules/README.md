# 🎯 Regras do Cursor - Cursor SaaS WhatsApp Leads

Esta pasta contém as regras do Cursor que ajudam a manter a qualidade e consistência do código.

## 📁 Regras Disponíveis

### 1. **project-structure.mdc** (Sempre Aplicada)
- **Propósito:** Estrutura do projeto e convenções
- **Aplicação:** Sempre ativa em todo o projeto
- **Conteúdo:** Estrutura de pastas, regras importantes, documentação

### 2. **architecture-patterns.mdc** (Sempre Aplicada)
- **Propósito:** Arquitetura refatorada e padrões de implementação
- **Aplicação:** Sempre ativa em todo o projeto
- **Conteúdo:** Organização por domínio, services, hooks, schemas, APIs

### 3. **typescript-patterns.mdc** (Arquivos .ts/.tsx)
- **Propósito:** Padrões TypeScript e React
- **Aplicação:** Apenas em arquivos TypeScript/TSX
- **Conteúdo:** Imports/exports, hooks React, tipagem

### 4. **api-patterns.mdc** (APIs)
- **Propósito:** Padrões de API e webhooks
- **Aplicação:** Apenas em arquivos de API (`src/app/api/**/*.ts`)
- **Conteúdo:** Rotas, validação Zod, tratamento de erros, webhook Twilio

### 5. **database-patterns.mdc** (Banco de Dados)
- **Propósito:** Padrões de banco de dados
- **Aplicação:** Arquivos Prisma e APIs
- **Conteúdo:** Status em português, relacionamentos, criação de leads

### 6. **quality-checklist.mdc** (Sempre Aplicada)
- **Propósito:** Checklist de qualidade para commits
- **Aplicação:** Sempre ativa em todo o projeto
- **Conteúdo:** Checklist antes de commitar, erros comuns, comandos úteis

### 7. **testing-patterns.mdc** (Sempre Aplicada)
- **Propósito:** Padrões de teste e configuração Jest
- **Aplicação:** Sempre ativa em todo o projeto
- **Conteúdo:** Estrutura de testes, padrões de nomenclatura, mocks, troubleshooting

### 8. **feature-implementation.mdc** (Manual)
- **Propósito:** Diretrizes para implementação de novas features
- **Aplicação:** Manual - aplicar quando implementar novas features
- **Conteúdo:** Checklist obrigatório, implementação por camadas, fluxo de desenvolvimento

## 🎯 Como Funcionam

### **Regras Sempre Aplicadas:**
- `alwaysApply: true` - Ativas em todo o projeto
- Fornecem contexto geral e checklist de qualidade

### **Regras Específicas:**
- `globs: *.ts,*.tsx` - Aplicadas apenas em arquivos específicos
- Fornecem padrões específicos para cada tipo de arquivo

## 📚 Referências

- [docs/architecture.md](../docs/architecture.md) - Arquitetura refatorada do projeto
- [docs/testing-strategy.md](../docs/testing-strategy.md) - Estratégia de testes implementada
- [docs/best-practices.md](../docs/best-practices.md) - Melhores práticas detalhadas
- [docs/lint-build-errors-guide.md](../docs/lint-build-errors-guide.md) - Erros corrigidos

## 🔄 Manutenção

### **Quando Atualizar:**
- ✅ Novo padrão identificado
- ✅ Mudança na estrutura do projeto
- ✅ Novo erro comum encontrado
- ✅ Atualização de documentação

### **Como Atualizar:**
1. Editar o arquivo `.mdc` correspondente
2. Manter frontmatter correto
3. Testar se a regra funciona como esperado
4. Comunicar mudanças para a equipe

---

**Última atualização:** Janeiro 2024  
**Responsável:** Equipe de Desenvolvimento 