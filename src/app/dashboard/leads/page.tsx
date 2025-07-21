'use client'

import { useState } from 'react'
import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Filter, Users, Phone, Mail, Calendar, Trash2, Edit3, MessageSquare, Upload } from 'lucide-react'
import Link from 'next/link'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Pagination } from '@/components/ui/pagination'
import { CreateLeadModal, ImportLeadsModal } from '@/components/leads'
import { useLeads } from '@/hooks/leads'
import { LEAD_STATUS_OPTIONS, PAGINATION_DEFAULTS } from '@/lib/utils/constants'
import { formatDate } from '@/lib/utils/date'
import { getStatusColor, getStatusIndicator, formatPhone } from '@/lib/utils/formatting'
import { LeadStatus, CreateLeadData, ImportLeadsData } from '@/schemas/leads'

export default function LeadsPage() {
  const { leads, isLoading, createLead, importLeads, updateLeadStatus, deleteLead } = useLeads()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(PAGINATION_DEFAULTS.ITEMS_PER_PAGE)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; leadId: string | null; leadName: string }>({
    open: false,
    leadId: null,
    leadName: ''
  })

  // Resetar página quando filtros mudarem
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, itemsPerPage])

  const handleCreateLead = async (data: CreateLeadData) => {
    await createLead(data)
    setCreateModalOpen(false)
  }

  const handleImportLeads = async (data: ImportLeadsData) => {
    return await importLeads(data)
  }

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    await updateLeadStatus(leadId, newStatus)
  }

  const handleDeleteLead = async () => {
    if (deleteDialog.leadId) {
      await deleteLead(deleteDialog.leadId)
      setDeleteDialog({ open: false, leadId: null, leadName: '' })
    }
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      leadId: null,
      leadName: ''
    })
  }

  const getStatusBadgeComponent = (status: string) => {
    const statusColor = getStatusIndicator(status)
    return (
      <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
    )
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
      (lead.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calcular paginação
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex)

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground">Gerencie todos os seus leads do WhatsApp</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setImportModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Lead
          </Button>
        </div>
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
                  {LEAD_STATUS_OPTIONS.map((status) => (
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
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground">Todos os Leads ({filteredLeads.length})</CardTitle>
          <CardDescription className="text-muted-foreground">
            Lista de todos os leads capturados através do WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
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
            <>
              {/* Área de dados - expande conforme paginação */}
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {paginatedLeads.map((lead) => (
                    <div key={lead.id} className="border border-border rounded-lg p-4 hover:bg-accent transition-colors">
                      <div className="flex items-center justify-between">
                        <Link href={`/dashboard/leads/${lead.id}`} className="flex-1">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src="" />
                              <AvatarFallback className={`text-white ${getStatusColor(lead.status)}`}>
                                {lead.name?.charAt(0) || lead.phone.charAt(-2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-foreground">{lead.name || 'Sem nome'}</h3>
                                {getStatusBadgeComponent(lead.status)}
                                {lead.source === 'whatsapp' ? (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    WhatsApp
                                  </div>
                                ) : (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Edit3 className="h-3 w-3 mr-1" />
                                    Manual
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                <div className="flex items-center">
                                  <Phone className="mr-1 h-3 w-3" />
                                  {formatPhone(lead.phone)}
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
                              {lead.notes && (
                                <p className="text-xs text-muted-foreground mt-1">{lead.notes}</p>
                              )}
                            </div>
                          </div>
                        </Link>
                        <div className="flex items-center space-x-3 ml-4">
                          <div className="flex items-center space-x-2">
                            <Select value={lead.status} onValueChange={(value) => handleStatusChange(lead.id, value as LeadStatus)}>
                              <SelectTrigger className="w-40 min-w-0 text-sm">
                                <SelectValue className="truncate" />
                              </SelectTrigger>
                              <SelectContent className="min-w-0">
                                {LEAD_STATUS_OPTIONS.map((status) => (
                                  <SelectItem key={status.value} value={status.value} className="whitespace-nowrap">
                                    {status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteDialog({ open: true, leadId: lead.id, leadName: lead.name || 'este lead' })}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Paginação */}
              <div className="border-t border-border bg-card">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredLeads.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de Criação de Lead */}
      <CreateLeadModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateLead}
      />

      {/* Modal de Importação de Leads */}
      <ImportLeadsModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onImport={handleImportLeads}
      />

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
        onConfirm={handleDeleteLead}
        variant="destructive"
      />
    </div>
  )
} 