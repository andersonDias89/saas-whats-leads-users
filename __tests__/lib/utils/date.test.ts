import { formatDate, formatDateTime, formatMonthShort, formatMonthLong } from '@/lib/utils/date'

describe('Date Utils', () => {
  describe('formatDate', () => {
    test('deve formatar data corretamente', () => {
      const date = new Date('2024-01-15T12:00:00Z')
      const formatted = formatDate(date)
      
      expect(formatted).toBe('15/01/2024')
    })

    test('deve formatar data com zero à esquerda', () => {
      const date = new Date('2024-01-05T12:00:00Z')
      const formatted = formatDate(date)
      
      expect(formatted).toBe('05/01/2024')
    })

    test('deve formatar data de string', () => {
      const dateString = '2024-12-25T12:00:00Z'
      const formatted = formatDate(dateString)
      
      expect(formatted).toBe('25/12/2024')
    })
  })

  describe('formatDateTime', () => {
    test('deve formatar data e hora corretamente', () => {
      const date = new Date('2024-01-15T14:30:00')
      const formatted = formatDateTime(date)
      
      expect(formatted).toMatch(/15\/01\/2024/)
      expect(formatted).toMatch(/14:30/)
    })

    test('deve formatar data e hora de string', () => {
      const dateString = '2024-12-25T09:15:00'
      const formatted = formatDateTime(dateString)
      
      expect(formatted).toMatch(/25\/12\/2024/)
      expect(formatted).toMatch(/09:15/)
    })
  })

  describe('formatMonthShort', () => {
    test('deve formatar mês abreviado', () => {
      const date = new Date('2024-01-15T12:00:00Z')
      const formatted = formatMonthShort(date)
      
      expect(formatted).toBe('JAN.')
    })

    test('deve formatar mês abreviado de string', () => {
      const dateString = '2024-12-25T12:00:00Z'
      const formatted = formatMonthShort(dateString)
      
      expect(formatted).toBe('DEZ.')
    })
  })

  describe('formatMonthLong', () => {
    test('deve formatar mês completo com ano', () => {
      const date = new Date('2024-01-15')
      const formatted = formatMonthLong(date)
      
      expect(formatted).toBe('janeiro de 2024')
    })

    test('deve formatar mês completo de string', () => {
      const dateString = '2024-12-25'
      const formatted = formatMonthLong(dateString)
      
      expect(formatted).toBe('dezembro de 2024')
    })
  })
}) 