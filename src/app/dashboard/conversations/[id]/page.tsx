'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ArrowLeft, 
  MessageCircle, 
  User,
  Download,
  Bot,
  User as UserIcon,
  Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface Message {
  id: string
  content: string
  direction: 'inbound' | 'outbound'
  timestamp: string
  messageType: string
  status: string
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
  createdAt: string
  updatedAt: string
  lead?: {
    id: string
    name: string
    status: string
  }
}

const statusOptions = [
  { value: 'active', label: 'Ativa', color: 'bg-green-500' },
  { value: 'closed', label: 'Fechada', color: 'bg-gray-500' },
  { value: 'archived', label: 'Arquivada', color: 'bg-yellow-500' },
]

export default function ConversationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadConversation(params.id as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const loadConversation = useCallback(async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setConversation(data)
      } else {
        toast.error('Conversa não encontrada')
        router.push('/dashboard/conversations')
      }
    } catch (error) {
      console.error('Erro ao carregar conversa:', error)
      toast.error('Erro ao carregar conversa')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const updateConversationStatus = async (newStatus: string) => {
    if (!conversation) return

    try {
      const response = await fetch(`/api/conversations/${conversation.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setConversation({ ...conversation, status: newStatus })
        toast.success('Status atualizado com sucesso')
      } else {
        toast.error('Erro ao atualizar status')
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status')
    }
  }

  const deleteConversation = async () => {
    if (!conversation) return

    try {
      const response = await fetch(`/api/conversations/${conversation.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Conversa deletada com sucesso')
        router.push('/dashboard/conversations')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erro ao deletar conversa')
      }
    } catch (error) {
      console.error('Erro ao deletar conversa:', error)
      toast.error('Erro ao deletar conversa')
    }
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
    } catch {
      return 'Data inválida'
    }
  }

  const formatMessageTime = (date: string | Date) => {
    try {
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) {
        return 'Data inválida'
      }
      return dateObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Data inválida'
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Conversa não encontrada</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/dashboard/conversations" className="hover:text-foreground transition-colors">
          Conversas
        </Link>
        <span>/</span>
        <span className="text-foreground">{conversation.leadName || 'Conversa'}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/conversations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Conversa com {conversation.leadName || 'Lead sem nome'}
            </h1>
            <p className="text-muted-foreground">
              {conversation.messages.length} mensagens • {formatDate(conversation.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={conversation.status} onValueChange={updateConversationStatus}>
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
            onClick={() => setDeleteDialog(true)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Deletar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="bg-card border-card-border h-[600px] flex flex-col">
            <CardHeader className="border-b border-border">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <MessageCircle className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-foreground">{conversation.leadName || 'Lead sem nome'}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {conversation.phoneNumber}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversation.messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p>Nenhuma mensagem ainda</p>
                  <p className="text-sm">As mensagens aparecerão aqui quando chegarem via WhatsApp</p>
                </div>
              ) : (
                conversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex flex-col max-w-xs lg:max-w-md">
                      {/* Header da mensagem */}
                      <div className={`flex items-center space-x-2 mb-1 ${
                        message.direction === 'outbound' ? 'justify-end' : 'justify-start'
                      }`}>
                        <div className="flex items-center space-x-1">
                          {message.direction === 'outbound' ? (
                            <Bot className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <UserIcon className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span className="text-xs text-muted-foreground font-medium">
                            {message.direction === 'outbound' ? 'Agent' : conversation.leadName || 'Lead sem nome'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Conteúdo da mensagem */}
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          message.direction === 'outbound'
                            ? 'bg-muted text-foreground'
                            : 'bg-card border border-border'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center justify-between text-xs mt-1 ${
                          message.direction === 'outbound' ? 'text-muted-foreground' : 'text-muted-foreground'
                        }`}>
                          <span>{formatMessageTime(message.timestamp)}</span>
                          {message.direction === 'outbound' && (
                            <span className="capitalize">{message.status}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Informações da Conversa */}
          <Card className="bg-card border-card-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground">Informações da Conversa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                {getStatusBadge(conversation.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Mensagens</span>
                <span className="text-sm font-medium text-foreground">
                  {conversation.messages.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Criada em</span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate(conversation.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Última mensagem</span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate(conversation.lastMessageTime)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Lead Relacionado */}
          {conversation.lead && (
            <Card className="bg-card border-card-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Lead Relacionado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {conversation.lead.name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{conversation.lead.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {conversation.lead.status}
                    </p>
                  </div>
                </div>
                <div className="pt-1">
                  <Link href={`/dashboard/leads/${conversation.lead.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Lead
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <Card className="bg-card border-card-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground">Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <Button variant="outline" size="sm" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Exportar Conversa
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Confirmação de Delete */}
      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="Deletar Conversa"
        description={`Tem certeza que deseja deletar a conversa com "${conversation?.leadName || 'Lead sem nome'}"? Esta ação não pode ser desfeita.`}
        confirmText="Deletar"
        cancelText="Cancelar"
        onConfirm={deleteConversation}
        variant="destructive"
      />
    </div>
  )
} 