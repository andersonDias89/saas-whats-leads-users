import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { LeadWithConversation } from '@/types/leads'
import { LeadStatus } from '@/schemas/leads'

export function useLeads() {
  const [leads, setLeads] = useState<LeadWithConversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadLeads = async () => {
    try {
      const response = await fetch('/api/leads')
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      } else {
        toast.error('Erro ao carregar leads')
      }
    } catch (error) {
      console.error('Erro ao carregar leads:', error)
      toast.error('Erro ao carregar leads')
    } finally {
      setIsLoading(false)
    }
  }

  const updateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setLeads(leads.map(lead => 
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        ))
        toast.success('Status atualizado com sucesso')
      } else {
        toast.error('Erro ao atualizar status')
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status')
    }
  }

  const deleteLead = async (leadId: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setLeads(leads.filter(lead => lead.id !== leadId))
        toast.success('Lead deletado com sucesso')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erro ao deletar lead')
      }
    } catch (error) {
      console.error('Erro ao deletar lead:', error)
      toast.error('Erro ao deletar lead')
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  return {
    leads,
    isLoading,
    loadLeads,
    updateLeadStatus,
    deleteLead
  }
} 