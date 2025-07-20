import { z } from 'zod'

export const twilioWebhookSchema = z.object({
  From: z.string(),
  To: z.string(),
  Body: z.string(),
  MessageSid: z.string(),
  AccountSid: z.string(),
  ProfileName: z.string().optional(),
  WaId: z.string().optional()
})

export type TwilioWebhookData = z.infer<typeof twilioWebhookSchema> 