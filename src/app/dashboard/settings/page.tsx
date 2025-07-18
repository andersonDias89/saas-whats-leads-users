'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Settings, Save, MessageCircle, Bot, Building, Shield } from 'lucide-react'
import { toast } from 'sonner'

const settingsSchema = z.object({
  companyName: z.string().min(1, 'Nome da empresa é obrigatório'),
  twilioAccountSid: z.string().min(1, 'Account SID é obrigatório'),
  twilioAuthToken: z.string().min(1, 'Auth Token é obrigatório'),
  twilioWhatsappNumber: z.string().min(1, 'Número do WhatsApp é obrigatório'),
  twilioSandboxKeyword: z.string().min(1, 'Palavra-chave do Sandbox é obrigatória'),
  openaiApiKey: z.string().min(1, 'API Key da OpenAI é obrigatória'),
  aiPrompt: z.string().min(1, 'Prompt da IA é obrigatório'),
  autoReply: z.boolean(),
  leadCapture: z.boolean(),
})

type SettingsFormData = z.infer<typeof settingsSchema>

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('empresa')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  })

  const autoReply = watch('autoReply')
  const leadCapture = watch('leadCapture')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
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
  }

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Configurações salvas com sucesso!')
      } else {
        toast.error('Erro ao salvar configurações')
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error('Erro ao salvar configurações')
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
                <div>
                  <Label htmlFor="companyName" className="text-foreground">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    {...register('companyName')}
                    className={errors.companyName ? 'border-destructive' : ''}
                  />
                  {errors.companyName && (
                    <p className="text-sm text-destructive mt-1">{errors.companyName.message}</p>
                  )}
                </div>
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
                <div>
                  <Label htmlFor="twilioAccountSid" className="text-foreground">Account SID</Label>
                  <Input
                    id="twilioAccountSid"
                    {...register('twilioAccountSid')}
                    className={errors.twilioAccountSid ? 'border-destructive' : ''}
                  />
                  {errors.twilioAccountSid && (
                    <p className="text-sm text-destructive mt-1">{errors.twilioAccountSid.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="twilioAuthToken" className="text-foreground">Auth Token</Label>
                  <Input
                    id="twilioAuthToken"
                    type="password"
                    {...register('twilioAuthToken')}
                    className={errors.twilioAuthToken ? 'border-destructive' : ''}
                  />
                  {errors.twilioAuthToken && (
                    <p className="text-sm text-destructive mt-1">{errors.twilioAuthToken.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="twilioWhatsappNumber" className="text-foreground">Número do WhatsApp</Label>
                  <Input
                    id="twilioWhatsappNumber"
                    placeholder="+5511999999999"
                    {...register('twilioWhatsappNumber')}
                    className={errors.twilioWhatsappNumber ? 'border-destructive' : ''}
                  />
                  {errors.twilioWhatsappNumber && (
                    <p className="text-sm text-destructive mt-1">{errors.twilioWhatsappNumber.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="twilioSandboxKeyword" className="text-foreground">Palavra-chave do Sandbox</Label>
                  <Input
                    id="twilioSandboxKeyword"
                    placeholder="join"
                    {...register('twilioSandboxKeyword')}
                    className={errors.twilioSandboxKeyword ? 'border-destructive' : ''}
                  />
                  {errors.twilioSandboxKeyword && (
                    <p className="text-sm text-destructive mt-1">{errors.twilioSandboxKeyword.message}</p>
                  )}
                </div>
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
                <div>
                  <Label htmlFor="openaiApiKey" className="text-foreground">API Key da OpenAI</Label>
                  <Input
                    id="openaiApiKey"
                    type="password"
                    {...register('openaiApiKey')}
                    className={errors.openaiApiKey ? 'border-destructive' : ''}
                  />
                  {errors.openaiApiKey && (
                    <p className="text-sm text-destructive mt-1">{errors.openaiApiKey.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="aiPrompt" className="text-foreground">Prompt da IA</Label>
                  <Textarea
                    id="aiPrompt"
                    rows={4}
                    placeholder="Configure como a IA deve responder às mensagens..."
                    {...register('aiPrompt')}
                    className={errors.aiPrompt ? 'border-destructive' : ''}
                  />
                  {errors.aiPrompt && (
                    <p className="text-sm text-destructive mt-1">{errors.aiPrompt.message}</p>
                  )}
                </div>
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
                    <Label className="text-foreground">Resposta Automática</Label>
                    <p className="text-sm text-muted-foreground">
                      Ativar respostas automáticas da IA
                    </p>
                  </div>
                  <Switch
                    checked={autoReply}
                    onCheckedChange={(checked) => setValue('autoReply', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">Captura de Leads</Label>
                    <p className="text-sm text-muted-foreground">
                      Capturar automaticamente novos leads
                    </p>
                  </div>
                  <Switch
                    checked={leadCapture}
                    onCheckedChange={(checked) => setValue('leadCapture', checked)}
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