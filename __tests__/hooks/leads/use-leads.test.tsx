import { renderHook, act, waitFor } from '@testing-library/react'
import { useLeads } from '@/hooks/leads/use-leads'
import { toast } from 'sonner'

// Mock do toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('useLeads', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
    // Suprimir console.error nos testes
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('loadLeads', () => {
    test('deve carregar leads com sucesso', async () => {
      const mockLeads = [
        { id: '1', name: 'João Silva', status: 'novo' },
        { id: '2', name: 'Maria Santos', status: 'qualificado' }
      ]
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockLeads
      })

      const { result } = renderHook(() => useLeads())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.leads).toEqual(mockLeads)
      expect(global.fetch).toHaveBeenCalledWith('/api/leads')
    })

    test('deve mostrar erro quando API falha', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      const { result } = renderHook(() => useLeads())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(toast.error).toHaveBeenCalledWith('Erro ao carregar leads')
    })

    test('deve mostrar erro quando fetch falha', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useLeads())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(toast.error).toHaveBeenCalledWith('Erro ao carregar leads')
    })
  })

  describe('updateLeadStatus', () => {
    test('deve atualizar status com sucesso', async () => {
      const mockLeads = [
        { id: '1', name: 'João Silva', status: 'novo' }
      ]
      
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockLeads
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        })

      const { result } = renderHook(() => useLeads())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.updateLeadStatus('1', 'qualificado')
      })

      expect(global.fetch).toHaveBeenCalledWith('/api/leads/1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'qualificado' })
      })

      expect(toast.success).toHaveBeenCalledWith('Status atualizado com sucesso')
      expect(result.current.leads[0].status).toBe('qualificado')
    })

    test('deve mostrar erro quando atualização falha', async () => {
      const mockLeads = [
        { id: '1', name: 'João Silva', status: 'novo' }
      ]
      
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockLeads
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500
        })

      const { result } = renderHook(() => useLeads())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.updateLeadStatus('1', 'qualificado')
      })

      expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar status')
    })
  })

  describe('deleteLead', () => {
    test('deve deletar lead com sucesso', async () => {
      const mockLeads = [
        { id: '1', name: 'João Silva', status: 'novo' },
        { id: '2', name: 'Maria Santos', status: 'contactado' }
      ]
      
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockLeads
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'Lead deletado' })
        })

      const { result } = renderHook(() => useLeads())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.deleteLead('1')
      })

      expect(global.fetch).toHaveBeenCalledWith('/api/leads/1', {
        method: 'DELETE'
      })

      expect(toast.success).toHaveBeenCalledWith('Lead deletado com sucesso')
      expect(result.current.leads).toHaveLength(1)
      expect(result.current.leads[0].id).toBe('2')
    })

    test('deve mostrar erro quando deleção falha', async () => {
      const mockLeads = [
        { id: '1', name: 'João Silva', status: 'novo' }
      ]
      
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockLeads
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ message: 'Erro interno' })
        })

      const { result } = renderHook(() => useLeads())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.deleteLead('1')
      })

      expect(toast.error).toHaveBeenCalledWith('Erro interno')
    })

    test('deve mostrar erro genérico quando resposta não tem message', async () => {
      const mockLeads = [
        { id: '1', name: 'João Silva', status: 'novo' }
      ]
      
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockLeads
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({})
        })

      const { result } = renderHook(() => useLeads())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.deleteLead('1')
      })

      expect(toast.error).toHaveBeenCalledWith('Erro ao deletar lead')
    })
  })

  describe('createLead', () => {
    test('deve criar lead com sucesso', async () => {
      const mockLeads = [
        { id: '1', name: 'João Silva', status: 'novo' }
      ]
      
      const newLead = {
        id: '2',
        name: 'Maria Santos',
        phone: '11999999999',
        email: 'maria@email.com',
        status: 'novo',
        source: 'manual'
      }
      
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockLeads
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => newLead
        })

      const { result } = renderHook(() => useLeads())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const createData = {
        name: 'Maria Santos',
        phone: '11999999999',
        email: 'maria@email.com',
        status: 'novo' as const,
        notes: 'Cliente interessado',
        source: 'manual' as const
      }

      await act(async () => {
        await result.current.createLead(createData)
      })

      expect(global.fetch).toHaveBeenCalledWith('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createData)
      })

      expect(toast.success).toHaveBeenCalledWith('Lead criado com sucesso')
      expect(result.current.leads).toHaveLength(2)
      expect(result.current.leads[0]).toEqual(newLead)
    })

    test('deve mostrar erro quando criação falha', async () => {
      const mockLeads = [
        { id: '1', name: 'João Silva', status: 'novo' }
      ]
      
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockLeads
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ message: 'Já existe um lead com este telefone' })
        })

      const { result } = renderHook(() => useLeads())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const createData = {
        name: 'Maria Santos',
        phone: '11999999999',
        email: 'maria@email.com',
        status: 'novo' as const,
        notes: 'Cliente interessado',
        source: 'manual' as const
      }

      await act(async () => {
        await expect(result.current.createLead(createData)).rejects.toThrow('Já existe um lead com este telefone')
      })

      expect(toast.error).toHaveBeenCalledWith('Já existe um lead com este telefone')
    })

    test('deve mostrar erro genérico quando resposta não tem message', async () => {
      const mockLeads = [
        { id: '1', name: 'João Silva', status: 'novo' }
      ]
      
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockLeads
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({})
        })

      const { result } = renderHook(() => useLeads())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const createData = {
        name: 'Maria Santos',
        phone: '11999999999',
        email: 'maria@email.com',
        status: 'novo' as const,
        notes: 'Cliente interessado',
        source: 'manual' as const
      }

      await act(async () => {
        await expect(result.current.createLead(createData)).rejects.toThrow('Erro ao criar lead')
      })

      expect(toast.error).toHaveBeenCalledWith('Erro ao criar lead')
    })
  })

  describe('estado inicial', () => {
    test('deve ter estado inicial correto', () => {
      const { result } = renderHook(() => useLeads())

      expect(result.current.leads).toEqual([])
      expect(result.current.isLoading).toBe(true)
      expect(typeof result.current.loadLeads).toBe('function')
      expect(typeof result.current.createLead).toBe('function')
      expect(typeof result.current.updateLeadStatus).toBe('function')
      expect(typeof result.current.deleteLead).toBe('function')
    })
  })
}) 