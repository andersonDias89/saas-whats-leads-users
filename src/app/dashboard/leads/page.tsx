'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Filter, Users, Phone, Mail, Calendar, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
  source: string
}

const statusOptions = [
  { value: 'new', label: 'Novo', color: 'bg-blue-500' },
  { value: 'contacted', label: 'Contactado', color: 'bg-yellow-500' },
  { value: 'qualified', label: 'Qualificado', color: 'bg-green-500' },
  { value: 'converted', label: 'Convertido', color: 'bg-purple-500' },
  { value: 'lost', label: 'Perdido', color: 'bg-red-500' },
]

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; leadId: string | null; leadName: string }>({
    open: false,
    leadId: null,
    leadName: ''
  })

  useEffect(() => {
    loadLeads()
  }, [])

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

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
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

  const deleteLead = async () => {
    if (!deleteDialog.leadId) return

    try {
      const response = await fetch(`/api/leads/${deleteDialog.leadId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setLeads(leads.filter(lead => lead.id !== deleteDialog.leadId))
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

  const openDeleteDialog = (leadId: string, leadName: string) => {
    console.log('Abrindo modal para deletar:', leadId, leadName)
    setDeleteDialog({
      open: true,
      leadId,
      leadName
    })
  }

  const closeDeleteDialog = () => {
    console.log('Fechando modal de delete')
    setDeleteDialog({
      open: false,
      leadId: null,
      leadName: ''
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status)
    return (
      <Badge className={`${statusConfig?.color} text-primary-foreground`}>
        {statusConfig?.label}
      </Badge>
    )
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground">Gerencie todos os seus leads do WhatsApp</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Lead
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card border-card-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, telefone ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <Card className="bg-card border-card-border">
        <CardHeader>
          <CardTitle className="text-foreground">Todos os Leads ({filteredLeads.length})</CardTitle>
          <CardDescription className="text-muted-foreground">
            Lista de todos os leads capturados através do WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p>Nenhum lead encontrado</p>
              <p className="text-sm">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Configure suas integrações para começar a receber leads'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="border border-border rounded-lg p-4 hover:bg-accent transition-colors">
                  <div className="flex items-center justify-between">
                    <Link href={`/dashboard/leads/${lead.id}`} className="flex-1">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {lead.name?.charAt(0) || lead.phone.charAt(-2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-foreground">{lead.name || 'Nome não informado'}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Phone className="mr-1 h-3 w-3" />
                              {lead.phone}
                            </div>
                            {lead.email && (
                              <div className="flex items-center">
                                <Mail className="mr-1 h-3 w-3" />
                                {lead.email}
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {formatDate(lead.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center space-x-3 ml-4">
                      {getStatusBadge(lead.status)}
                      <Select 
                        value={lead.status} 
                        onValueChange={(value: string) => updateLeadStatus(lead.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(lead.id, lead.name || 'Lead sem nome')}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {lead.notes && (
                    <div className="mt-3 text-sm text-muted-foreground bg-muted p-2 rounded">
                      {lead.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Delete */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!open) closeDeleteDialog()
        }}
        title="Deletar Lead"
        description={`Tem certeza que deseja deletar o lead "${deleteDialog.leadName}"? Esta ação também removerá todas as conversas vinculadas e não pode ser desfeita.`}
        confirmText="Deletar"
        cancelText="Cancelar"
        onConfirm={deleteLead}
        variant="destructive"
      />
    </div>
  )
} 