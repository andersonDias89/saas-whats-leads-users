import { z } from 'zod'

export const userSettingsSchema = z.object({
  companyName: z.string().optional().or(z.literal('')),
  twilioAccountSid: z.string().optional().or(z.literal('')),
  twilioAuthToken: z.string().optional().or(z.literal('')),
  twilioWhatsappNumber: z.string().optional().or(z.literal('')),
  twilioSandboxKeyword: z.string().optional().or(z.literal('')),
  openaiApiKey: z.string().optional().or(z.literal('')),
  aiPrompt: z.string().optional().or(z.literal(''))
})

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  companyName: z.string().min(2, 'Nome da empresa deve ter pelo menos 2 caracteres').optional()
})

export type UserSettingsFormData = z.infer<typeof userSettingsSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema> 