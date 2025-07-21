import { leadStatusSchema } from '@/schemas/leads'

describe('Lead Status Schema', () => {
  describe('Validação de status válidos', () => {
    test('deve validar status "novo"', () => {
      const result = leadStatusSchema.safeParse('novo')
      expect(result.success).toBe(true)
    })

    test('deve validar status "qualificado"', () => {
      const result = leadStatusSchema.safeParse('qualificado')
      expect(result.success).toBe(true)
    })

    test('deve validar status "nao_interessado"', () => {
      const result = leadStatusSchema.safeParse('nao_interessado')
      expect(result.success).toBe(true)
    })

    test('deve validar status "fechado"', () => {
      const result = leadStatusSchema.safeParse('fechado')
      expect(result.success).toBe(true)
    })
  })

  describe('Validação de status inválidos', () => {
    test('deve rejeitar status inexistente', () => {
      const result = leadStatusSchema.safeParse('status_invalido')
      expect(result.success).toBe(false)
    })

    test('deve rejeitar status vazio', () => {
      const result = leadStatusSchema.safeParse('')
      expect(result.success).toBe(false)
    })

    test('deve rejeitar status com espaços', () => {
      const result = leadStatusSchema.safeParse(' novo ')
      expect(result.success).toBe(false)
    })

    test('deve rejeitar status em inglês', () => {
      const result = leadStatusSchema.safeParse('new')
      expect(result.success).toBe(false)
    })
  })

  describe('Tipos de dados', () => {
    test('deve aceitar string', () => {
      const result = leadStatusSchema.safeParse('novo')
      expect(result.success).toBe(true)
    })

    test('deve rejeitar número', () => {
      const result = leadStatusSchema.safeParse(1)
      expect(result.success).toBe(false)
    })

    test('deve rejeitar boolean', () => {
      const result = leadStatusSchema.safeParse(true)
      expect(result.success).toBe(false)
    })

    test('deve rejeitar null', () => {
      const result = leadStatusSchema.safeParse(null)
      expect(result.success).toBe(false)
    })

    test('deve rejeitar undefined', () => {
      const result = leadStatusSchema.safeParse(undefined)
      expect(result.success).toBe(false)
    })
  })
}) 