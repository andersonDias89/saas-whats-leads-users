import { Message, Conversation, User } from '@prisma/client'

export type MessageWithConversation = Message & {
  conversation: Conversation
  user: User
}

export type MessageDirection = 'inbound' | 'outbound'

export interface TwilioWebhookPayload {
  From: string
  To: string
  Body: string
  MessageSid: string
  AccountSid: string
  ProfileName?: string
  WaId?: string
} 