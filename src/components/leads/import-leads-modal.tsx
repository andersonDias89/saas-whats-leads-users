'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { ImportLeadsData, ImportResult } from '@/schemas/leads'

interface ImportLeadsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (data: ImportLeadsData) => Promise<ImportResult>
}

export function ImportLeadsModal({ open, onOpenChange, onImport }: ImportLeadsModalProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
      toast.error('Por favor, selecione um arquivo Excel (.xlsx) ou CSV (.csv)')
      return
    }

    try {
      setIsImporting(true)
      setProgress(0)
      setImportResult(null)

      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Processar arquivo
      const data = await processFile(file)
      
      clearInterval(progressInterval)
      setProgress(100)

      // Importar dados
      const result = await onImport(data)
      setImportResult(result)

      if (result.success > 0) {
        toast.success(`${result.success} leads importados com sucesso!`)
      }

      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} erros encontrados durante a importação`)
      }

    } catch (error) {
      console.error('Erro ao processar arquivo:', error)
      toast.error('Erro ao processar o arquivo. Verifique o formato.')
    } finally {
      setIsImporting(false)
    }
  }

  const processFile = async (file: File): Promise<ImportLeadsData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          const lines = text.split('\n')
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
          
          const data = lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
              const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
              const row: Record<string, string> = {}
              
              headers.forEach((header, index) => {
                row[header] = values[index] || ''
              })
              
              return row as unknown as ImportLeadsData
            })
          
          resolve(data as unknown as ImportLeadsData)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
      reader.readAsText(file)
    })
  }

  const handleClose = () => {
    setProgress(0)
    setImportResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onOpenChange(false)
  }

  const handleDownloadTemplate = () => {
    const csvContent = `Nome,Telefone,Email,Status,Observações
João Silva,11999999999,joao@email.com,novo,Cliente interessado
Maria Santos,11888888888,maria@email.com,qualificado,Prospecto quente
Pedro Oliveira,11777777777,pedro@email.com,novo,Primeiro contato
Ana Costa,11666666666,ana@email.com,nao_interessado,Preço alto
Carlos Lima,11555555555,carlos@email.com,novo,Interessado em demo
Lucia Ferreira,11444444444,lucia@email.com,qualificado,Decisor
Roberto Alves,11333333333,roberto@email.com,novo,Cliente potencial
Fernanda Silva,11222222222,fernanda@email.com,fechado,Venda realizada
Marcos Santos,11111111111,marcos@email.com,novo,Lead frio
Juliana Costa,11000000000,juliana@email.com,qualificado,Interessado
Ricardo Lima,10999999999,ricardo@email.com,novo,Primeiro contato
Patricia Alves,10888888888,patricia@email.com,nao_interessado,Orçamento alto
Thiago Ferreira,10777777777,thiago@email.com,novo,Cliente potencial
Camila Silva,10666666666,camila@email.com,qualificado,Decisor
Gustavo Santos,10555555555,gustavo@email.com,novo,Interessado em demo
Renata Costa,10444444444,renata@email.com,fechado,Venda realizada
Diego Lima,10333333333,diego@email.com,novo,Lead frio
Vanessa Alves,10222222222,vanessa@email.com,qualificado,Prospecto quente
Bruno Ferreira,10111111111,bruno@email.com,novo,Primeiro contato
Amanda Silva,10000000000,amanda@email.com,nao_interessado,Preço alto`

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'template_leads.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Importar Leads em Massa</DialogTitle>
          <DialogDescription>
            Selecione uma planilha Excel (.xlsx) ou CSV (.csv) para importar leads
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Template Download */}
          <div className="flex items-center justify-between p-4 border border-dashed border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Baixar Template</p>
                <p className="text-xs text-muted-foreground">
                  Use nosso template para garantir o formato correto
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              disabled={isImporting}
            >
              Baixar
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Clique para selecionar</span> ou arraste o arquivo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Excel (.xlsx) ou CSV (.csv)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".xlsx,.csv"
                  onChange={handleFileSelect}
                  disabled={isImporting}
                />
              </label>
            </div>
          </div>

          {/* Progress */}
          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Importando leads...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Results */}
          {importResult && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                {importResult.success > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="font-medium">
                  {importResult.success > 0 
                    ? `${importResult.success} leads importados com sucesso!`
                    : 'Nenhum lead foi importado'
                  }
                </span>
              </div>
              
              {importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-destructive">
                    Erros encontrados ({importResult.errors.length}):
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {importResult.errors.slice(0, 5).map((error, index) => (
                      <p key={index} className="text-xs text-muted-foreground">
                        • {error}
                      </p>
                    ))}
                    {importResult.errors.length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        ... e mais {importResult.errors.length - 5} erros
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isImporting}
            >
              {importResult ? 'Fechar' : 'Cancelar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 