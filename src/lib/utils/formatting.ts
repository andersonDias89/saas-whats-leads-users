import { formatDate } from './date'

// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

// Format phone number
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

// Format status badge
export const getStatusBadge = (status: string, statusOptions: Array<{ value: string; label: string; color: string }>) => {
  const statusConfig = statusOptions.find(s => s.value === status)
  return {
    label: statusConfig?.label || status,
    color: statusConfig?.color || 'bg-gray-500'
  }
}

// Format relative time
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'agora mesmo'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} min${minutes > 1 ? 's' : ''} atrás`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hora${hours > 1 ? 's' : ''} atrás`
  } else {
    return formatDate(date)
  }
} 