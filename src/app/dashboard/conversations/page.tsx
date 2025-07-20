'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageCircle, Search, Filter, Phone, Calendar, MessageSquare, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface Message {
  id: string
  content: string
  direction: 'inbound' | 'outbound'
  timestamp: string
}

interface Conversation {
  id: string
  phoneNumber: string
  leadName: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  messages: Message[]
  status: string
}

const statusOptions = [
  { value: 'active', label: 'Ativa', color: 'bg-green-500' },
  { value: 'closed', label: 'Fechada', color: 'bg-gray-500' },
  { value: 'archived', label: 'Arquivada', color: 'bg-yellow-500' },
]

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; conversationId: string | null; leadName: string }>({
    open: false,
    conversationId: null,
    leadName: ''
  })

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      } else {
        toast.error('Erro ao carregar conversas')
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
      toast.error('Erro ao carregar conversas')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteConversation = async () => {
    if (!deleteDialog.conversationId) return

    try {
      const response = await fetch(`/api/conversations/${deleteDialog.conversationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setConversations(conversations.filter(conv => conv.id !== deleteDialog.conversationId))
        toast.success('Conversa deletada com sucesso')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erro ao deletar conversa')
      }
    } catch (error) {
      console.error('Erro ao deletar conversa:', error)
      toast.error('Erro ao deletar conversa')
    }
  }

  const openDeleteDialog = (conversationId: string, leadName: string) => {
    console.log('Abrindo modal para deletar conversa:', conversationId, leadName)
    setDeleteDialog({
      open: true,
      conversationId,
      leadName
    })
  }

  const closeDeleteDialog = () => {
    console.log('Fechando modal de delete conversa')
    setDeleteDialog({
      open: false,
      conversationId: null,
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
    try {
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) {
        return 'Data inválida'
      }
      return dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Erro ao formatar data:', date, error)
      return 'Data inválida'
    }
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

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = 
      (conversation.leadName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      conversation.phoneNumber.includes(searchTerm) ||
      conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || conversation.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Conversas</h1>
          <p className="text-muted-foreground">Gerencie todas as suas conversas do WhatsApp</p>
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
                  placeholder="Buscar por nome, telefone ou mensagem..."
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

      {/* Conversations List */}
      <Card className="bg-card border-card-border">
        <CardHeader>
          <CardTitle className="text-foreground">Todas as Conversas ({filteredConversations.length})</CardTitle>
          <CardDescription className="text-muted-foreground">
            Lista de todas as conversas capturadas através do WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p>Nenhuma conversa encontrada</p>
              <p className="text-sm">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Configure suas integrações para começar a receber conversas'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredConversations.map((conversation) => (
                <div key={conversation.id} className="border border-border rounded-lg p-4 hover:bg-accent transition-colors">
                  <div className="flex items-center justify-between">
                    <Link href={`/dashboard/conversations/${conversation.id}`} className="flex-1">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <MessageCircle className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-foreground">{conversation.leadName || 'Lead sem nome'}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Phone className="mr-1 h-3 w-3" />
                              {conversation.phoneNumber}
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="mr-1 h-3 w-3" />
                              {conversation.messages.length} mensagens
                            </div>
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {formatDate(conversation.lastMessageTime)}
                            </div>
                          </div>
                          {conversation.lastMessage && (
                            <p className="text-sm text-muted-foreground mt-1 truncate max-w-md">
                              {conversation.lastMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center space-x-3 ml-4">
                      {getStatusBadge(conversation.status || 'active')}
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(conversation.id, conversation.leadName || 'Lead sem nome')}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
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
        title="Deletar Conversa"
        description={`Tem certeza que deseja deletar a conversa com "${deleteDialog.leadName}"? Esta ação não pode ser desfeita.`}
        confirmText="Deletar"
        cancelText="Cancelar"
        onConfirm={deleteConversation}
        variant="destructive"
      />
    </div>
  )
} 