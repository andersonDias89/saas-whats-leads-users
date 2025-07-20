# 📚 Documentação do Projeto

Esta pasta contém toda a documentação técnica do projeto **Cursor SaaS WhatsApp Leads**.

## 📁 Estrutura da Documentação

```
docs/
├── README.md                    # Este arquivo - Visão geral
├── architecture.md              # Arquitetura refatorada do projeto
├── testing-strategy.md          # Estratégia e configuração de testes
├── lint-build-errors-guide.md   # Guia de erros corrigidos
└── best-practices.md           # Melhores práticas do projeto
```

## 📖 Documentos Disponíveis

### 1. **architecture.md**
- **Propósito:** Documentar a arquitetura refatorada do projeto
- **Conteúdo:**
  - Estrutura de pastas por domínio
  - Padrões de implementação (Services, Hooks, Schemas)
  - Fluxo de dados
  - Checklist de implementação
  - Benefícios da arquitetura
- **Útil para:** Desenvolvedores novos e implementação de features

### 2. **testing-strategy.md**
- **Propósito:** Documentar a estratégia de testes implementada
- **Conteúdo:**
  - Configuração do Jest e Testing Library
  - Estrutura de testes por tipo
  - Padrões de teste e mocks
  - Cobertura atual e próximos passos
  - Troubleshooting comum
- **Útil para:** Desenvolvedores novos e manutenção de testes

### 3. **best-practices.md**
- **Propósito:** Estabelecer padrões e melhores práticas
- **Conteúdo:**
  - Estrutura do projeto
  - Padrões de código
  - Configurações de desenvolvimento
  - Fluxo de trabalho
- **Útil para:** Manter consistência no projeto

### 4. **lint-build-errors-guide.md**
- **Propósito:** Registrar erros de lint e build corrigidos
- **Conteúdo:** 
  - Lista detalhada de erros encontrados
  - Soluções aplicadas
  - Como prevenir recorrência
  - Configurações recomendadas
- **Útil para:** Desenvolvedores novos e revisão de código

## 🎯 Como Usar Esta Documentação

### **Para Desenvolvedores Novos:**
1. Leia `architecture.md` primeiro (entenda a estrutura)
2. Leia `testing-strategy.md` (entenda como testar)
3. Leia `best-practices.md` (padrões gerais)
4. Consulte `lint-build-errors-guide.md` quando encontrar erros
5. Use os checklists antes de commitar

### **Para Revisão de Código:**
1. Use o checklist de qualidade em `best-practices.md`
2. Verifique se não há erros documentados em `lint-build-errors-guide.md`
3. Confirme se os padrões estão sendo seguidos

### **Para Debugging:**
1. Consulte a seção de debugging em `best-practices.md`
2. Verifique se o erro já foi documentado em `lint-build-errors-guide.md`
3. Use os comandos úteis listados

## 🔄 Manutenção da Documentação

### **Quando Atualizar:**
- ✅ Novo erro de lint/build corrigido
- ✅ Nova melhor prática identificada
- ✅ Mudança na estrutura do projeto
- ✅ Nova configuração importante

### **Como Atualizar:**
1. Adicionar entrada no histórico de correções
2. Atualizar versão do documento
3. Comunicar mudanças para a equipe

## 📞 Suporte

Se encontrar erros não documentados ou tiver sugestões:
1. Verifique se já existe documentação
2. Adicione nova entrada se necessário
3. Mantenha a documentação atualizada

---

**Última atualização:** Janeiro 2024  
**Responsável:** Equipe de Desenvolvimento 