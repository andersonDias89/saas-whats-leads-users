import { z } from 'zod'
import { leadStatusSchema } from './status'

export const importLeadSchema = z.object({
  Nome: z.string().min(1, 'Nome é obrigatório'),
  Telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  Email: z.string().email('Email inválido').optional().or(z.literal('')),
  Status: leadStatusSchema.optional().default('novo'),
  Observações: z.string().optional().or(z.literal(''))
})

export const importLeadsSchema = z.array(importLeadSchema)

export type ImportLeadData = z.infer<typeof importLeadSchema>
export type ImportLeadsData = z.infer<typeof importLeadsSchema>

export interface ImportResult {
  success: number
  errors: string[]
} 