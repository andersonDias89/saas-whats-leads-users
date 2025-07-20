"use client"

import React from 'react'
import { Input } from './input'
import { FormField } from './form-field'
import { Mail, Lock, User, Phone, Key } from 'lucide-react'

export function InputExamples() {
  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const [apiKeyVisible, setApiKeyVisible] = React.useState(false)

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-foreground">Exemplos de Inputs</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs Básicos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Inputs Básicos</h3>
          
          <Input 
            placeholder="Input padrão"
            size="default"
          />
          
          <Input 
            placeholder="Input pequeno"
            size="sm"
          />
          
          <Input 
            placeholder="Input grande"
            size="lg"
          />
        </div>

        {/* Inputs com Ícones */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Inputs com Ícones</h3>
          
          <Input 
            placeholder="Digite seu email"
            leftIcon={<Mail className="h-4 w-4" />}
          />
          
          <Input 
            placeholder="Digite seu nome"
            leftIcon={<User className="h-4 w-4" />}
          />
          
          <Input 
            placeholder="Digite seu telefone"
            leftIcon={<Phone className="h-4 w-4" />}
          />
        </div>

        {/* Inputs de Senha */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Inputs de Senha</h3>
          
          <Input 
            type="password"
            placeholder="Digite sua senha"
            leftIcon={<Lock className="h-4 w-4" />}
          />
          
          <Input 
            type="password"
            placeholder="Senha com toggle controlado"
            isVisible={passwordVisible}
            onToggleVisibility={setPasswordVisible}
            leftIcon={<Lock className="h-4 w-4" />}
          />
        </div>

        {/* Inputs Sensíveis */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Dados Sensíveis</h3>
          
          <Input 
            type="password"
            placeholder="sk-..."
            leftIcon={<Key className="h-4 w-4" />}
            showToggle
          />
          
          <Input 
            type="password"
            placeholder="AC..."
            leftIcon={<Key className="h-4 w-4" />}
            isVisible={apiKeyVisible}
            onToggleVisibility={setApiKeyVisible}
          />
        </div>

        {/* Estados de Validação */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Estados de Validação</h3>
          
          <Input 
            placeholder="Input com erro"
            error={true}
          />
          
          <Input 
            placeholder="Input com sucesso"
            success={true}
          />
        </div>

        {/* FormField Examples */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">FormField Examples</h3>
          
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            leftIcon={<Mail className="h-4 w-4" />}
            required
          />
          
          <FormField
            label="Senha"
            name="password"
            type="password"
            placeholder="Digite sua senha"
            leftIcon={<Lock className="h-4 w-4" />}
            required
            showToggle
          />
          
          <FormField
            label="API Key"
            name="apiKey"
            type="password"
            placeholder="sk-..."
            leftIcon={<Key className="h-4 w-4" />}
            required
            showToggle
            helperText="Sua chave da OpenAI para IA"
          />
        </div>
      </div>
    </div>
  )
} 