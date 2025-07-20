import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  test('deve renderizar com texto correto', () => {
    render(<Button>Clique aqui</Button>)
    
    expect(screen.getByRole('button', { name: 'Clique aqui' })).toBeInTheDocument()
  })

  test('deve chamar onClick quando clicado', () => {
    const handleClick = jest.fn()
    
    render(<Button onClick={handleClick}>Clique aqui</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('deve aplicar variantes corretamente', () => {
    render(<Button variant="destructive">Deletar</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })

  test('deve aplicar tamanhos corretamente', () => {
    render(<Button size="sm">Pequeno</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-8')
  })

  test('deve estar desabilitado quando disabled', () => {
    render(<Button disabled>Desabilitado</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  test('deve não chamar onClick quando desabilitado', () => {
    const handleClick = jest.fn()
    
    render(<Button disabled onClick={handleClick}>Desabilitado</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  test('deve renderizar como link quando asChild', () => {
    render(
      <Button asChild>
        <a href="/test">Link</a>
      </Button>
    )
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  test('deve aplicar classes customizadas', () => {
    render(<Button className="custom-class">Custom</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })
}) 