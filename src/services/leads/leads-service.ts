import { prisma } from '@/lib/prisma'
import { LeadWithConversation } from '@/types/leads'
import { LeadStatus } from '@/schemas/leads'

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