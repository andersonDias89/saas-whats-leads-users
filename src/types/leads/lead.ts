import { Lead, Conversation } from '@prisma/client'

export type LeadWithConversation = Lead & {
  conversation: Conversation | null
  user: {
    id: string
    name: string | null
    email: string
  }
}

export type LeadStatus = 'novo' | 'qualificado' | 'nao_interessado' | 'fechado' 