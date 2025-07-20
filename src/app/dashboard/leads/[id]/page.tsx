'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft, 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  MapPin, 
  MessageCircle,
  Edit,
  Save,
  X
} from 'lucide-react'
import { toast } from 'sonner'

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
  conversation?: {
    id: string
    lastMessage?: string
    lastMessageAt?: string
    messagesCount: number
  }
}

const statusOptions = [
  { value: 'novo', label: 'Novo', color: 'bg-blue-500' },
  { value: 'qualificado', label: 'Qualificado', color: 'bg-green-500' },
  { value: 'nao_interessado', label: 'Não Interessado', color: 'bg-red-500' },
  { value: 'fechado', label: 'Fechado', color: 'bg-purple-500' },
]

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<Lead>>({})

  useEffect(() => {
    if (params.id) {
      loadLead(params.id as string)
    }
  }, [params.id])

  const loadLead = async (leadId: string) => {
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
  }

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

  if (!lead) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Lead não encontrado</p>
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
        <Link href="/dashboard/leads" className="hover:text-foreground transition-colors">
          Leads
        </Link>
        <span>/</span>
        <span className="text-foreground">{lead.name || 'Lead sem nome'}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/leads">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditing ? 'Editando Lead' : lead.name || 'Lead sem nome'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Edite as informações do lead' : 'Detalhes completos do lead'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button onClick={updateLead} size="sm">
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsEditing(false)
                  setEditData(lead)
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-card-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Informações do Lead
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {lead.name?.charAt(0) || lead.phone.charAt(-2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      placeholder="Nome do lead"
                      className="text-lg font-semibold"
                    />
                  ) : (
                    <h2 className="text-xl font-semibold text-foreground">
                      {lead.name || 'Nome não informado'}
                    </h2>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
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
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  {isEditing ? (
                    <Select 
                      value={editData.status || lead.status} 
                      onValueChange={(value) => setEditData({ ...editData, status: value })}
                    >
                      <SelectTrigger className="mt-1">
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
                  ) : (
                    <div className="mt-1">
                      {getStatusBadge(lead.status)}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Observações</label>
                {isEditing ? (
                  <Textarea
                    value={editData.notes || ''}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    placeholder="Adicione observações sobre este lead..."
                    className="mt-1"
                    rows={3}
                  />
                ) : (
                  <div className="mt-1 text-foreground">
                    {lead.notes || 'Nenhuma observação adicionada'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conversa Relacionada */}
          {lead.conversation && (
            <Card className="bg-card border-card-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Conversa Relacionada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {lead.conversation.messagesCount} mensagens
                    </p>
                    {lead.conversation.lastMessage && (
                      <p className="text-sm text-foreground mt-1">
                        Última mensagem: {lead.conversation.lastMessage}
                      </p>
                    )}
                  </div>
                  <Link href={`/dashboard/conversations/${lead.conversation.id}`}>
                    <Button variant="outline" size="sm">
                      Ver Conversa
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-card border-card-border">
            <CardHeader>
              <CardTitle className="text-foreground">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fonte</span>
                <span className="text-sm font-medium text-foreground capitalize">
                  {lead.source}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Criado em</span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate(lead.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Atualizado em</span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate(lead.updatedAt)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 