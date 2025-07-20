'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Save, MessageCircle, Bot, Building, Shield, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const settingsSchema = z.object({
  companyName: z.string().optional().or(z.literal('')),
  twilioAccountSid: z.string().optional().or(z.literal('')),
  twilioAuthToken: z.string().optional().or(z.literal('')),
  twilioWhatsappNumber: z.string().optional().or(z.literal('')),
  twilioSandboxKeyword: z.string().optional().or(z.literal('')),
  openaiApiKey: z.string().optional().or(z.literal('')),
  aiPrompt: z.string().optional().or(z.literal('')),
})

type SettingsFormData = z.infer<typeof settingsSchema>

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('empresa')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  })



  useEffect(() => {
    loadSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const settings = await response.json()
        Object.keys(settings).forEach((key) => {
          setValue(key as keyof SettingsFormData, settings[key])
        })
      } else {
        toast.error('Erro ao carregar configurações')
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      toast.error('Erro ao carregar configurações')
    } finally {
      setIsLoading(false)
    }
  }, [setValue])

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true)
    setError('')
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        // Tratamento específico de erros
        let errorMessage = 'Erro ao salvar configurações'
        
        if (response.status === 400) {
          errorMessage = result.details || result.message || 'Dados inválidos. Verifique os campos obrigatórios.'
        } else if (response.status === 401) {
          errorMessage = 'Sessão expirada. Faça login novamente.'
        } else if (response.status === 409) {
          errorMessage = result.message || 'Conflito de dados. Verifique as informações.'
        } else if (response.status === 500) {
          errorMessage = result.message || 'Erro interno do servidor. Tente novamente.'
        }
        
        throw new Error(errorMessage)
      }

      toast.success('Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar configurações'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="space-y-4">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Configure suas integrações e personalize sua IA</p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive font-medium">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-background-secondary border border-border">
            <TabsTrigger 
              value="empresa" 
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Empresa</span>
            </TabsTrigger>
            <TabsTrigger 
              value="twilio" 
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Twilio</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ia" 
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">IA</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sistema" 
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Sistema</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Empresa */}
          <TabsContent value="empresa" className="space-y-6">
            <Card className="bg-card border-card-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Informações da Empresa
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Configure as informações básicas da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  label="Nome da Empresa"
                  placeholder="Nome da sua empresa"
                  required
                  error={errors.companyName?.message}
                  {...register('companyName')}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Twilio */}
          <TabsContent value="twilio" className="space-y-6">
            <Card className="bg-card border-card-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Integração Twilio
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Configure sua conta do Twilio para WhatsApp Business API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  label="Account SID"
                  placeholder="AC..."
                  required
                  error={errors.twilioAccountSid?.message}
                  {...register('twilioAccountSid')}
                />

                <FormField
                  label="Auth Token"
                  type="password"
                  placeholder="Digite seu Auth Token"
                  required
                  error={errors.twilioAuthToken?.message}
                  showToggle
                  {...register('twilioAuthToken')}
                />

                <FormField
                  label="Número do WhatsApp"
                  placeholder="+5511999999999"
                  required
                  error={errors.twilioWhatsappNumber?.message}
                  {...register('twilioWhatsappNumber')}
                />

                <FormField
                  label="Palavra-chave do Sandbox"
                  placeholder="join"
                  required
                  error={errors.twilioSandboxKeyword?.message}
                  {...register('twilioSandboxKeyword')}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: IA */}
          <TabsContent value="ia" className="space-y-6">
            <Card className="bg-card border-card-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Bot className="mr-2 h-5 w-5" />
                  Configurações da IA
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Configure a inteligência artificial para respostas automáticas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  label="API Key da OpenAI"
                  type="password"
                  placeholder="sk-..."
                  required
                  error={errors.openaiApiKey?.message}
                  showToggle
                  {...register('openaiApiKey')}
                />

                <FormField
                  label="Prompt da IA"
                  as="textarea"
                  rows={4}
                  placeholder="Configure como a IA deve responder às mensagens..."
                  required
                  error={errors.aiPrompt?.message}
                  {...register('aiPrompt')}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Sistema */}
          <TabsContent value="sistema" className="space-y-6">
            <Card className="bg-card border-card-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Configurações do Sistema
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Configure as funcionalidades automáticas do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-medium text-foreground-secondary">Resposta Automática</span>
                    <p className="text-sm text-muted-foreground">
                      Ativar respostas automáticas da IA
                    </p>
                  </div>
                  <Switch
                    checked={true}
                    onCheckedChange={() => {}}
                    disabled
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-medium text-foreground-secondary">Captura de Leads</span>
                    <p className="text-sm text-muted-foreground">
                      Capturar automaticamente novos leads
                    </p>
                  </div>
                  <Switch
                    checked={true}
                    onCheckedChange={() => {}}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
} 