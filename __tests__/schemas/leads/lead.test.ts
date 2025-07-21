import { leadSchema, createLeadSchema } from '@/schemas/leads'

describe('Lead Schema', () => {
  describe('leadSchema', () => {
    test('deve validar lead completo', () => {
      const validLead = {
        name: 'João Silva',
        phone: '11999999999',
        email: 'joao@email.com',
        status: 'novo',
        notes: 'Cliente interessado'
      }

      const result = leadSchema.safeParse(validLead)
      expect(result.success).toBe(true)
    })

    test('deve validar lead mínimo', () => {
      const minimalLead = {
        phone: '11999999999',
        status: 'qualificado'
      }

      const result = leadSchema.safeParse(minimalLead)
      expect(result.success).toBe(true)
    })

    test('deve rejeitar lead sem telefone', () => {
      const invalidLead = {
        name: 'João Silva',
        status: 'novo'
      }

      const result = leadSchema.safeParse(invalidLead)
      expect(result.success).toBe(false)
    })
  })

  describe('createLeadSchema', () => {
    test('deve validar dados de criação completos', () => {
      const validCreateData = {
        name: 'João Silva',
        phone: '11999999999',
        email: 'joao@email.com',
        status: 'novo',
        notes: 'Cliente interessado',
        source: 'manual'
      }

      const result = createLeadSchema.safeParse(validCreateData)
      expect(result.success).toBe(true)
    })

    test('deve validar dados de criação com source whatsapp', () => {
      const validCreateData = {
        name: 'João Silva',
        phone: '11999999999',
        email: 'joao@email.com',
        status: 'novo',
        notes: 'Cliente interessado',
        source: 'whatsapp'
      }

      const result = createLeadSchema.safeParse(validCreateData)
      expect(result.success).toBe(true)
    })

    test('deve rejeitar dados sem nome obrigatório', () => {
      const invalidCreateData = {
        phone: '11999999999',
        status: 'novo',
        source: 'manual'
      }

      const result = createLeadSchema.safeParse(invalidCreateData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('name'))).toBe(true)
      }
    })

    test('deve rejeitar source inválido', () => {
      const invalidCreateData = {
        name: 'João Silva',
        phone: '11999999999',
        status: 'novo',
        source: 'invalid'
      }

      const result = createLeadSchema.safeParse(invalidCreateData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('source'))).toBe(true)
      }
    })

    test('deve aceitar email vazio', () => {
      const validCreateData = {
        name: 'João Silva',
        phone: '11999999999',
        status: 'novo',
        email: '',
        notes: '',
        source: 'manual'
      }

      const result = createLeadSchema.safeParse(validCreateData)
      expect(result.success).toBe(true)
    })

    test('deve rejeitar email inválido', () => {
      const invalidCreateData = {
        name: 'João Silva',
        phone: '11999999999',
        status: 'novo',
        email: 'email-invalido',
        source: 'manual'
      }

      const result = createLeadSchema.safeParse(invalidCreateData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true)
      }
    })
  })
}) 