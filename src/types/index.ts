import { User, Conversation, Message, Lead } from '@prisma/client'

export type UserWithConfig = User

export type ConversationWithMessages = Conversation & {
  messages: Message[]
  leads: Lead[]
  user: User
}

export type ConversationWithUser = Conversation & {
  user: User
}

export type MessageWithConversation = Message & {
  conversation: Conversation
  user: User
}

export type LeadWithConversation = Lead & {
  conversation: Conversation | null
  user: User
}

export type LeadStatus = 'novo' | 'qualificado' | 'nao_interessado' | 'fechado'

export type MessageDirection = 'inbound' | 'outbound'

export type ConversationStatus = 'active' | 'closed' | 'archived'

export interface TwilioWebhookPayload {
  From: string
  To: string
  Body: string
  MessageSid: string
  AccountSid: string
  ProfileName?: string
  WaId?: string
}

export interface UserSettings {
  companyName?: string
  twilioAccountSid?: string
  twilioAuthToken?: string
  twilioWhatsappNumber?: string
  twilioSandboxKeyword?: string
  openaiApiKey?: string
  aiPrompt?: string
}

export interface DashboardStats {
  totalLeads: number
  newLeads: number
  qualifiedLeads: number
  totalConversations: number
  activeConversations: number
  messagesThisMonth: number
} 