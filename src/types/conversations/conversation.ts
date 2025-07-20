import { Conversation, Message, Lead, User } from '@prisma/client'

export type ConversationWithMessages = Conversation & {
  messages: Message[]
  leads: Lead[]
  user: User
}

export type ConversationWithUser = Conversation & {
  user: User
}

export type ConversationStatus = 'active' | 'closed' | 'archived' 