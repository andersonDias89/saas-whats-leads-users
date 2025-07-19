'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function TestDataPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testData, setTestData] = useState<any>(null)

  const checkData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test-data')
      if (response.ok) {
        const data = await response.json()
        setTestData(data)
        console.log('📊 Dados de teste:', data)
        toast.success('Dados carregados com sucesso')
      } else {
        toast.error('Erro ao carregar dados')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  const fixLeads = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test-data/fix-leads', {
        method: 'POST'
      })
      if (response.ok) {
        const data = await response.json()
        console.log('🔧 Leads corrigidos:', data)
        toast.success(`Leads corrigidos: ${data.updatedLeads}`)
        // Recarregar dados
        await checkData()
      } else {
        toast.error('Erro ao corrigir leads')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao corrigir leads')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teste de Dados</h1>
        <div className="space-x-2">
          <Button onClick={checkData} disabled={isLoading}>
            {isLoading ? 'Carregando...' : 'Verificar Dados'}
          </Button>
          <Button onClick={fixLeads} disabled={isLoading} variant="outline">
            {isLoading ? 'Corrigindo...' : 'Corrigir Leads'}
          </Button>
        </div>
      </div>

      {testData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversas</CardTitle>
              <CardDescription>Total: {testData.totalConversations}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {testData.conversations.map((conv: any) => (
                  <div key={conv.id} className="p-2 border rounded">
                    <p><strong>ID:</strong> {conv.id}</p>
                    <p><strong>Telefone:</strong> {conv.phoneNumber}</p>
                    <p><strong>Contact Name:</strong> {conv.contactName || 'N/A'}</p>
                    <p><strong>Última Mensagem:</strong> {conv.lastMessage || 'N/A'}</p>
                    <p><strong>Leads:</strong> {conv.leads.length}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leads</CardTitle>
              <CardDescription>Total: {testData.totalLeads}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {testData.leads.map((lead: any) => (
                  <div key={lead.id} className="p-2 border rounded">
                    <p><strong>ID:</strong> {lead.id}</p>
                    <p><strong>Nome:</strong> {lead.name || 'SEM NOME'}</p>
                    <p><strong>Telefone:</strong> {lead.phone}</p>
                    <p><strong>Status:</strong> {lead.status}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 