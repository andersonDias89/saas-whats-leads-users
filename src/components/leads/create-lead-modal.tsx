'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { CreateLeadData, createLeadSchema } from '@/schemas/leads'
import { LEAD_STATUS_OPTIONS } from '@/lib/utils/constants'
import { User, Phone, Mail, FileText } from 'lucide-react'

interface CreateLeadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateLeadData) => Promise<void>
}

export function CreateLeadModal({ open, onOpenChange, onSubmit }: CreateLeadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch
  } = useForm<CreateLeadData>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      status: 'novo',
      notes: '',
      source: 'manual'
    }
  })

  const handleFormSubmit = async (data: CreateLeadData) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      handleClose()
    } catch {
      // Erro já tratado no hook
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Lead</DialogTitle>
          <DialogDescription>
            Preencha as informações do lead para adicioná-lo ao seu sistema
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="block">
              Nome *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register('name')}
                id="name"
                placeholder="Nome completo"
                className="pl-10"
              />
            </div>
            {errors.name?.message && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="block">
              Telefone *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register('phone')}
                id="phone"
                placeholder="(11) 99999-9999"
                className="pl-10"
              />
            </div>
            {errors.phone?.message && (
              <p className="text-sm text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="block">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                className="pl-10"
              />
            </div>
            {errors.email?.message && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="block">
              Status
            </Label>
            <Select
              value={watch('status')}
              onValueChange={(value: string) => setValue('status', value as 'novo' | 'qualificado' | 'nao_interessado' | 'fechado')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {LEAD_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status?.message && (
              <p className="text-sm text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="block">
              Observações
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                {...register('notes')}
                id="notes"
                placeholder="Observações sobre o lead..."
                className="pl-10 min-h-[80px]"
              />
            </div>
            {errors.notes?.message && (
              <p className="text-sm text-destructive">
                {errors.notes.message}
              </p>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Criando...' : 'Criar Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 