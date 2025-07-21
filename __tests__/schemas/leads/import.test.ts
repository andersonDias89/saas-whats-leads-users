import { importLeadSchema, importLeadsSchema } from '@/schemas/leads'

describe('Import Lead Schema', () => {
  describe('importLeadSchema', () => {
    test('deve validar dados de importação completos', () => {
      const validData = {
        Nome: 'João Silva',
        Telefone: '11999999999',
        Email: 'joao@email.com',
        Status: 'novo',
        Observações: 'Cliente interessado'
      }

      const result = importLeadSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    test('deve validar dados mínimos', () => {
      const minimalData = {
        Nome: 'João Silva',
        Telefone: '11999999999'
      }

      const result = importLeadSchema.safeParse(minimalData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.Status).toBe('novo') // default value
        expect(result.data.Email).toBe('')
        expect(result.data.Observações).toBe('')
      }
    })

    test('deve rejeitar dados sem nome obrigatório', () => {
      const invalidData = {
        Telefone: '11999999999',
        Status: 'novo'
      }

      const result = importLeadSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('Nome'))).toBe(true)
      }
    })

    test('deve rejeitar dados sem telefone obrigatório', () => {
      const invalidData = {
        Nome: 'João Silva',
        Status: 'novo'
      }

      const result = importLeadSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('Telefone'))).toBe(true)
      }
    })

    test('deve aceitar email vazio', () => {
      const validData = {
        Nome: 'João Silva',
        Telefone: '11999999999',
        Email: '',
        Status: 'qualificado',
        Observações: ''
      }

      const result = importLeadSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    test('deve rejeitar email inválido', () => {
      const invalidData = {
        Nome: 'João Silva',
        Telefone: '11999999999',
        Email: 'email-invalido',
        Status: 'novo'
      }

      const result = importLeadSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('Email'))).toBe(true)
      }
    })

    test('deve aceitar todos os status válidos', () => {
      const statuses = ['novo', 'qualificado', 'nao_interessado', 'fechado']
      
      statuses.forEach(status => {
        const data = {
          Nome: 'João Silva',
          Telefone: '11999999999',
          Status: status
        }

        const result = importLeadSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    test('deve rejeitar status inválido', () => {
      const invalidData = {
        Nome: 'João Silva',
        Telefone: '11999999999',
        Status: 'status_invalido'
      }

      const result = importLeadSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('Status'))).toBe(true)
      }
    })
  })

  describe('importLeadsSchema', () => {
    test('deve validar array de leads válidos', () => {
      const validData = [
        {
          Nome: 'João Silva',
          Telefone: '11999999999',
          Email: 'joao@email.com',
          Status: 'novo',
          Observações: 'Cliente interessado'
        },
        {
          Nome: 'Maria Santos',
          Telefone: '11888888888',
          Status: 'qualificado'
        }
      ]

      const result = importLeadsSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    test('deve rejeitar array vazio', () => {
      const result = importLeadsSchema.safeParse([])
      expect(result.success).toBe(false)
    })

    test('deve rejeitar array com dados inválidos', () => {
      const invalidData = [
        {
          Nome: 'João Silva',
          Telefone: '11999999999',
          Status: 'novo'
        },
        {
          Nome: 'Maria Santos',
          // Telefone faltando
          Status: 'qualificado'
        }
      ]

      const result = importLeadsSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        // Verificar se há erro no segundo item (índice 1)
        expect(result.error.issues.some(issue => 
          issue.path.includes('1') || issue.path.includes('Telefone')
        )).toBe(true)
      }
    })
  })
}) 