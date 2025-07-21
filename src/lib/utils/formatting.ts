import { LEAD_STATUS_OPTIONS } from './constants'

export const getStatusBadge = (status: string, options = LEAD_STATUS_OPTIONS) => {
  const statusOption = options.find(option => option.value === status)
  return {
    label: statusOption?.label || status,
    color: statusOption?.color || 'bg-gray-100 text-gray-800'
  }
}

export const getStatusColor = (status: string) => {
  const statusColors = {
    novo: 'bg-blue-500',
    qualificado: 'bg-green-500',
    nao_interessado: 'bg-red-500',
    fechado: 'bg-gray-500'
  }
  return statusColors[status as keyof typeof statusColors] || 'bg-gray-500'
}

export const getStatusIndicator = (status: string) => {
  const statusColors = {
    novo: 'bg-blue-500',
    qualificado: 'bg-green-500',
    nao_interessado: 'bg-red-500',
    fechado: 'bg-gray-500'
  }
  return statusColors[status as keyof typeof statusColors] || 'bg-gray-500'
}

export const formatPhone = (phone: string) => {
  // Remove prefixo whatsapp: se existir
  const cleanPhone = phone.replace('whatsapp:', '')
  
  // Formata o telefone brasileiro
  if (cleanPhone.length === 11) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`
  }
  
  return cleanPhone
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const formatRelativeTime = (date: Date) => {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) return 'Agora mesmo'
  if (diffInMinutes < 60) return `${diffInMinutes} min atrás`
  if (diffInHours < 24) return `${diffInHours}h atrás`
  if (diffInDays < 7) return `${diffInDays} dias atrás`
  
  return date.toLocaleDateString('pt-BR')
} 