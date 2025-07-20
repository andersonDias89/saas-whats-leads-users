import { z } from 'zod'
import { leadStatusSchema } from './status'

export const leadSchema = z.object({
  name: z.string().optional(),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email().optional(),
  status: leadStatusSchema,
  notes: z.string().optional(),
  value: z.number().optional()
})

export type LeadFormData = z.infer<typeof leadSchema> 