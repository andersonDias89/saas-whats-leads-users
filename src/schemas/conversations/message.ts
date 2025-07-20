import { z } from 'zod'

export const sendMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1, 'Mensagem não pode estar vazia')
})

export type SendMessageFormData = z.infer<typeof sendMessageSchema> 