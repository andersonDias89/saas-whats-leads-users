import { prisma } from '@/lib/prisma'
import { LeadWithConversation } from '@/types/leads'
import { LeadStatus } from '@/schemas/leads'
import { CreateLeadData } from '@/schemas/leads'
import { ImportLeadsData, ImportResult } from '@/schemas/leads'

export class LeadsService {
  static async getLeadsByUserId(userId: string): Promise<LeadWithConversation[]> {
    return prisma.lead.findMany({
      where: { userId },
      include: {
        conversation: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  static async createLead(userId: string, data: CreateLeadData) {
    // Verificar se já existe um lead com o mesmo telefone para este usuário
    const existingLead = await prisma.lead.findFirst({
      where: {
        userId,
        phone: data.phone
      }
    })

    if (existingLead) {
      throw new Error('Já existe um lead com este telefone')
    }

    return prisma.lead.create({
      data: {
        userId,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        status: data.status,
        notes: data.notes || null,
        source: data.source
      },
      include: {
        conversation: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  static async importLeads(userId: string, data: ImportLeadsData): Promise<ImportResult> {
    const result: ImportResult = {
      success: 0,
      errors: []
    }

    // Processar cada lead em uma transação
    for (let i = 0; i < data.length; i++) {
      const leadData = data[i]
      
      try {
        // Verificar se já existe um lead com o mesmo telefone
        const existingLead = await prisma.lead.findFirst({
          where: {
            userId,
            phone: leadData.Telefone
          }
        })

        if (existingLead) {
          result.errors.push(`Linha ${i + 2}: Já existe um lead com o telefone ${leadData.Telefone}`)
          continue
        }

        // Criar o lead
        await prisma.lead.create({
          data: {
            userId,
            name: leadData.Nome,
            phone: leadData.Telefone,
            email: leadData.Email || null,
            status: leadData.Status || 'novo',
            notes: leadData.Observações || null,
            source: 'manual'
          }
        })

        result.success++
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
        result.errors.push(`Linha ${i + 2}: ${errorMessage}`)
      }
    }

    return result
  }

  static async getLeadById(leadId: string, userId: string) {
    return prisma.lead.findFirst({
      where: {
        id: leadId,
        userId
      },
      include: {
        conversation: {
          select: {
            id: true,
            lastMessage: true,
            lastMessageAt: true,
            messages: {
              select: { id: true }
            }
          }
        }
      }
    })
  }

  static async updateLead(leadId: string, userId: string, data: {
    name?: string
    email?: string
    status?: LeadStatus
    notes?: string
  }) {
    // Verificar se o lead pertence ao usuário
    const existingLead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        userId
      }
    })

    if (!existingLead) {
      throw new Error('Lead não encontrado')
    }

    return prisma.lead.update({
      where: { id: leadId },
      data,
      include: {
        conversation: {
          select: {
            id: true,
            lastMessage: true,
            lastMessageAt: true,
            messages: {
              select: { id: true }
            }
          }
        }
      }
    })
  }

  static async deleteLead(leadId: string, userId: string) {
    const existingLead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        userId
      },
      include: {
        conversation: {
          include: {
            messages: true
          }
        }
      }
    })

    if (!existingLead) {
      throw new Error('Lead não encontrado')
    }

    // Exclusão em cascata usando transação
    await prisma.$transaction(async (tx) => {
      if (existingLead.conversation) {
        await tx.message.deleteMany({
          where: { conversationId: existingLead.conversation.id }
        })
        
        await tx.conversation.delete({
          where: { id: existingLead.conversation.id }
        })
      }
      
      await tx.lead.delete({
        where: { id: leadId }
      })
    })

    return { message: 'Lead e conversas vinculadas deletados com sucesso' }
  }
} 