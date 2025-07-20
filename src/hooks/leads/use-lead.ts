import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LeadWithConversation } from '@/types/leads'


export function useLead() {
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<LeadWithConversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<LeadWithConversation>>({})

  const loadLead = useCallback(async (leadId: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`)
      if (response.ok) {
        const data = await response.json()
        setLead(data)
        setEditData(data)
      } else {
        toast.error('Lead não encontrado')
        router.push('/dashboard/leads')
      }
    } catch (error) {
      console.error('Erro ao carregar lead:', error)
      toast.error('Erro ao carregar lead')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const updateLead = async () => {
    if (!lead) return

    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      if (response.ok) {
        const updatedLead = await response.json()
        setLead(updatedLead)
        setIsEditing(false)
        toast.success('Lead atualizado com sucesso')
      } else {
        toast.error('Erro ao atualizar lead')
      }
    } catch (error) {
      console.error('Erro ao atualizar lead:', error)
      toast.error('Erro ao atualizar lead')
    }
  }

  const deleteLead = async () => {
    if (!lead) return

    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Lead deletado com sucesso')
        router.push('/dashboard/leads')
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
    if (params.id) {
      loadLead(params.id as string)
    }
  }, [params.id, loadLead])

  return {
    lead,
    isLoading,
    isEditing,
    editData,
    setIsEditing,
    setEditData,
    updateLead,
    deleteLead
  }
} 