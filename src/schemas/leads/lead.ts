import { z } from 'zod'
import { leadStatusSchema } from './status'

export const leadSchema = z.object({
  name: z.string().optional(),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email().optional(),
  status: leadStatusSchema,
  notes: z.string().optional()
})

export const createLeadSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  status: leadStatusSchema,
  notes: z.string().optional().or(z.literal('')),
  source: z.enum(['whatsapp', 'manual'])
})

export type LeadFormData = z.infer<typeof leadSchema>
export type CreateLeadData = z.infer<typeof createLeadSchema> 