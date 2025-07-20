import { User } from '@prisma/client'

export type UserWithConfig = User

export interface UserSettings {
  companyName?: string
  twilioAccountSid?: string
  twilioAuthToken?: string
  twilioWhatsappNumber?: string
  twilioSandboxKeyword?: string
  openaiApiKey?: string
  aiPrompt?: string
} 