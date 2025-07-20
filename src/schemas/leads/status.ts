import { z } from 'zod'

export const leadStatusSchema = z.enum(['novo', 'qualificado', 'nao_interessado', 'fechado'])

export type LeadStatus = z.infer<typeof leadStatusSchema> 