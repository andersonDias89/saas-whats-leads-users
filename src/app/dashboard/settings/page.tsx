'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserSettingsFormData, userSettingsSchema } from '@/schemas'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const { data: session } = useSession()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UserSettingsFormData>({
    resolver: zodResolver(userSettingsSchema),
  })

  // Carregar dados do usuário
  useEffect(() => {
    const loadUserSettings = async () => {
      console.log('🔄 Carregando configurações do usuário...')
      console.log('👤 Sessão:', session)
      
      try {
        const response = await fetch('/api/user/settings')
        console.log('📡 Resposta da API:', response.status, response.statusText)
        
        if (response.ok) {
          const data = await response.json()
          console.log('📝 Dados carregados:', data)
          reset(data)
        } else {
          const error = await response.json()
          console.error('❌ Erro ao carregar configurações:', error)
        }
      } catch (err) {
        console.error('❌ Erro ao carregar configurações:', err)
      } finally {
        setIsLoadingData(false)
      }
    }

    if (session?.user?.id) {
      console.log('✅ Usuário autenticado, carregando configurações...')
      loadUserSettings()
    } else {
      console.log('❌ Usuário não autenticado')
      setIsLoadingData(false)
    }
  }, [session, reset])

  const onSubmit = async (data: UserSettingsFormData) => {
    console.log('🚀 Iniciando salvamento de configurações...')
    console.log('📝 Dados a serem salvos:', data)
    console.log('👤 Sessão atual:', session)
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      console.log('📡 Resposta da API:', response.status, response.statusText)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Configurações salvas com sucesso:', result)
        toast.success('Configurações salvas com sucesso!')
      } else {
        const error = await response.json()
        console.error('❌ Erro ao salvar configurações:', error)
        toast.error(error.message || 'Erro ao salvar configurações')
      }
    } catch (err) {
      console.error('❌ Erro ao salvar configurações:', err)
      toast.error('Erro ao salvar configurações')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Configure suas integrações e personalize sua IA</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="company">Empresa</TabsTrigger>
            <TabsTrigger value="twilio">Twilio</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="prompt">Prompt da IA</TabsTrigger>
          </TabsList>

          {/* Configurações da Empresa */}
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>
                  Configure as informações básicas da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    {...register('companyName')}
                    placeholder="Sua Empresa Ltda"
                    className={errors.companyName ? 'border-red-500' : ''}
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-500 mt-1">{errors.companyName.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações do Twilio */}
          <TabsContent value="twilio">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Twilio</CardTitle>
                <CardDescription>
                  Configure sua conta do Twilio para conectar com o WhatsApp Business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="twilioAccountSid">Account SID</Label>
                  <Input
                    id="twilioAccountSid"
                    {...register('twilioAccountSid')}
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className={errors.twilioAccountSid ? 'border-red-500' : ''}
                  />
                  {errors.twilioAccountSid && (
                    <p className="text-sm text-red-500 mt-1">{errors.twilioAccountSid.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="twilioAuthToken">Auth Token</Label>
                  <Input
                    id="twilioAuthToken"
                    type="password"
                    {...register('twilioAuthToken')}
                    placeholder="••••••••••••••••••••••••••••••••"
                    className={errors.twilioAuthToken ? 'border-red-500' : ''}
                  />
                  {errors.twilioAuthToken && (
                    <p className="text-sm text-red-500 mt-1">{errors.twilioAuthToken.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="twilioWhatsappNumber">Número do WhatsApp</Label>
                  <Input
                    id="twilioWhatsappNumber"
                    {...register('twilioWhatsappNumber')}
                    placeholder="whatsapp:+5511999999999"
                    className={errors.twilioWhatsappNumber ? 'border-red-500' : ''}
                  />
                  {errors.twilioWhatsappNumber && (
                    <p className="text-sm text-red-500 mt-1">{errors.twilioWhatsappNumber.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="twilioSandboxKeyword">Sandbox Keyword (Opcional)</Label>
                  <Input
                    id="twilioSandboxKeyword"
                    {...register('twilioSandboxKeyword')}
                    placeholder="join your-sandbox-keyword"
                    className={errors.twilioSandboxKeyword ? 'border-red-500' : ''}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Usado apenas para ambiente de teste do Twilio
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações da OpenAI */}
          <TabsContent value="openai">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da OpenAI</CardTitle>
                <CardDescription>
                  Configure sua API Key da OpenAI para respostas automáticas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="openaiApiKey">API Key da OpenAI</Label>
                  <Input
                    id="openaiApiKey"
                    type="password"
                    {...register('openaiApiKey')}
                    placeholder="sk-••••••••••••••••••••••••••••••••••••••••••••••••"
                    className={errors.openaiApiKey ? 'border-red-500' : ''}
                  />
                  {errors.openaiApiKey && (
                    <p className="text-sm text-red-500 mt-1">{errors.openaiApiKey.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Você pode obter sua API Key em: <a href="https://platform.openai.com/api-keys" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">platform.openai.com</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações do Prompt */}
          <TabsContent value="prompt">
            <Card>
              <CardHeader>
                <CardTitle>Prompt Personalizado da IA</CardTitle>
                <CardDescription>
                  Defina como a IA deve responder seus clientes no WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="aiPrompt">Prompt da IA</Label>
                  <Textarea
                    id="aiPrompt"
                    {...register('aiPrompt')}
                    placeholder="Você é um assistente virtual especializado em vendas. Seja sempre educado, profissional e ajude o cliente com suas dúvidas sobre nossos produtos/serviços..."
                    rows={10}
                    className={errors.aiPrompt ? 'border-red-500' : ''}
                  />
                  {errors.aiPrompt && (
                    <p className="text-sm text-red-500 mt-1">{errors.aiPrompt.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Seja específico sobre o tom, comportamento e informações que a IA deve usar nas respostas.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Dicas para um bom prompt:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Defina o papel da IA (vendedor, atendente, consultor)</li>
                    <li>• Inclua informações sobre sua empresa e produtos</li>
                    <li>• Estabeleça o tom de comunicação desejado</li>
                    <li>• Defina quando a IA deve transferir para um humano</li>
                    <li>• Inclua exemplos de respostas quando possível</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botão de salvar */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </form>
    </div>
  )
} 