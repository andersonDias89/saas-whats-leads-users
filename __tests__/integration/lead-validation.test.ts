import { leadSchema, leadStatusSchema } from '@/schemas/leads'

describe('Lead Validation Integration', () => {
  describe('Fluxo completo de validação', () => {
    test('deve validar lead completo com todos os campos', () => {
      const completeLead = {
        name: 'João Silva',
        phone: '11999999999',
        email: 'joao@email.com',
        status: 'novo',
        notes: 'Cliente interessado em produto premium'
      }

      const result = leadSchema.safeParse(completeLead)
      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.name).toBe('João Silva')
        expect(result.data.phone).toBe('11999999999')
        expect(result.data.email).toBe('joao@email.com')
        expect(result.data.status).toBe('novo')
        expect(result.data.notes).toBe('Cliente interessado em produto premium')
      }
    })

    test('deve validar lead mínimo obrigatório', () => {
      const minimalLead = {
        phone: '11999999999',
        status: 'qualificado'
      }

      const result = leadSchema.safeParse(minimalLead)
      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.phone).toBe('11999999999')
        expect(result.data.status).toBe('qualificado')
        expect(result.data.name).toBeUndefined()
        expect(result.data.email).toBeUndefined()
        expect(result.data.notes).toBeUndefined()
      }
    })

    test('deve rejeitar lead sem campos obrigatórios', () => {
      const invalidLead = {
        name: 'João Silva'
        // Faltando phone e status
      }

      const result = leadSchema.safeParse(invalidLead)
      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues).toHaveLength(2) // phone e status obrigatórios
        expect(result.error.issues.some(issue => issue.path.includes('phone'))).toBe(true)
        expect(result.error.issues.some(issue => issue.path.includes('status'))).toBe(true)
      }
    })
  })

  describe('Validação de status em contexto', () => {
    test('deve aceitar todos os status válidos em leads', () => {
      const statuses = ['novo', 'qualificado', 'nao_interessado', 'fechado']

      statuses.forEach(status => {
        const lead = {
          phone: '11999999999',
          status
        }

        const result = leadSchema.safeParse(lead)
        expect(result.success).toBe(true)
      })
    })

    test('deve rejeitar status inválido em leads', () => {
      const invalidStatuses = ['contactado', 'convertido', 'pending', '']

      invalidStatuses.forEach(status => {
        const lead = {
          phone: '11999999999',
          status
        }

        const result = leadSchema.safeParse(lead)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('Validação de telefone em contexto', () => {
    test('deve aceitar formatos de telefone válidos', () => {
      const validPhones = [
        '11999999999',
        '11888888888',
        '(11) 99999-9999',
        '11 99999 9999'
      ]

      validPhones.forEach(phone => {
        const lead = {
          phone,
          status: 'novo'
        }

        const result = leadSchema.safeParse(lead)
        expect(result.success).toBe(true)
      })
    })

    test('deve rejeitar formatos de telefone inválidos', () => {
      const invalidPhones = [
        '123', // muito curto
        'abc', // não numérico
        ''     // vazio
      ]

      invalidPhones.forEach(phone => {
        const lead = {
          phone,
          status: 'novo'
        }

        const result = leadSchema.safeParse(lead)
        expect(result.success).toBe(false)
      })
    })

    test('deve aceitar telefones longos (schema atual não valida tamanho máximo)', () => {
      const longPhones = [
        '999999999999999999',
        '119999999999999999'
      ]

      longPhones.forEach(phone => {
        const lead = {
          phone,
          status: 'novo'
        }

        const result = leadSchema.safeParse(lead)
        // O schema atual não valida tamanho máximo
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Validação de email em contexto', () => {
    test('deve aceitar emails válidos', () => {
      const validEmails = [
        'joao@email.com',
        'maria.silva@empresa.com.br',
        'test+tag@domain.org'
      ]

      validEmails.forEach(email => {
        const lead = {
          phone: '11999999999',
          email,
          status: 'novo'
        }

        const result = leadSchema.safeParse(lead)
        expect(result.success).toBe(true)
      })
    })

    test('deve rejeitar emails inválidos', () => {
      const invalidEmails = [
        'email-invalido',
        '@domain.com',
        'user@',
        'user.domain.com'
      ]

      invalidEmails.forEach(email => {
        const lead = {
          phone: '11999999999',
          email,
          status: 'novo'
        }

        const result = leadSchema.safeParse(lead)
        expect(result.success).toBe(false)
      })
    })
  })
}) 