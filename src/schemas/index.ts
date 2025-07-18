import { z } from 'zod'

// Schema para registrar novo usuário
export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  companyName: z.string().min(2, 'Nome da empresa deve ter pelo menos 2 caracteres')
})

// Schema para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
})

// Schema para configurações do usuário
export const userSettingsSchema = z.object({
  companyName: z.string().optional(),
  twilioAccountSid: z.string().optional(),
  twilioAuthToken: z.string().optional(),
  twilioWhatsappNumber: z.string().optional(),
  twilioSandboxKeyword: z.string().optional(),
  openaiApiKey: z.string().optional(),
  aiPrompt: z.string().optional()
})

// Schema para criar/editar lead
export const leadSchema = z.object({
  name: z.string().optional(),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email().optional(),
  status: z.enum(['novo', 'qualificado', 'nao_interessado', 'fechado']),
  notes: z.string().optional(),
  value: z.number().optional()
})

// Schema para enviar mensagem
export const sendMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1, 'Mensagem não pode estar vazia')
})

// Schema para webhook do Twilio
export const twilioWebhookSchema = z.object({
  From: z.string(),
  To: z.string(),
  Body: z.string(),
  MessageSid: z.string(),
  AccountSid: z.string(),
  ProfileName: z.string().optional(),
  WaId: z.string().optional()
})

// Schema para atualizar perfil do usuário
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  companyName: z.string().min(2, 'Nome da empresa deve ter pelo menos 2 caracteres').optional()
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type UserSettingsFormData = z.infer<typeof userSettingsSchema>
export type LeadFormData = z.infer<typeof leadSchema>
export type SendMessageFormData = z.infer<typeof sendMessageSchema>
export type TwilioWebhookData = z.infer<typeof twilioWebhookSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema> 