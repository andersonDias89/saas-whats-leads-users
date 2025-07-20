// Status options for leads
export const LEAD_STATUS_OPTIONS = [
  { value: 'novo', label: 'Novo', color: 'bg-blue-500' },
  { value: 'qualificado', label: 'Qualificado', color: 'bg-green-500' },
  { value: 'nao_interessado', label: 'Não Interessado', color: 'bg-red-500' },
  { value: 'fechado', label: 'Fechado', color: 'bg-purple-500' },
]

// Status options for conversations
export const CONVERSATION_STATUS_OPTIONS = [
  { value: 'active', label: 'Ativa', color: 'bg-green-500' },
  { value: 'closed', label: 'Fechada', color: 'bg-gray-500' },
  { value: 'archived', label: 'Arquivada', color: 'bg-yellow-500' },
]

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  ITEMS_PER_PAGE: 10,
  MAX_ITEMS_PER_PAGE: 50,
}

// API endpoints
export const API_ENDPOINTS = {
  LEADS: '/api/leads',
  CONVERSATIONS: '/api/conversations',
  MESSAGES: '/api/messages',
  SETTINGS: '/api/settings',
  USER_SETTINGS: '/api/user/settings',
} 