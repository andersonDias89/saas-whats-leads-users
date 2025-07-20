import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  companyName: z.string().min(2, 'Nome da empresa deve ter pelo menos 2 caracteres')
})

export type RegisterFormData = z.infer<typeof registerSchema> 