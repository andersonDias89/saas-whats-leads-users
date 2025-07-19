# Sistema de Design - WhatsLeads

## Visão Geral

Este documento descreve o sistema de design implementado para o WhatsLeads, seguindo as referências visuais fornecidas e padrões modernos de UI/UX.

## Paleta de Cores

### Cores Principais
- **Primary**: `#00D4AA` (Verde principal)
- **Primary Foreground**: `#FFFFFF` (Branco)
- **Primary Muted**: `#00D4AA` com 10% de opacidade

### Backgrounds
- **Background**: `#1a1a1a` (Background principal)
- **Background Secondary**: `#2a2a2a` (Background secundário)
- **Background Tertiary**: `#1f1f1f` (Background terciário)
- **Background Elevated**: `#333333` (Background elevado)

### Foregrounds
- **Foreground**: `#FFFFFF` (Texto principal)
- **Foreground Secondary**: `#CCCCCC` (Texto secundário)
- **Foreground Muted**: `#999999` (Texto muted)
- **Foreground Subtle**: `#666666` (Texto sutil)

### Cards
- **Card**: `#2a2a2a` (Background dos cards)
- **Card Foreground**: `#FFFFFF`
- **Card Border**: `#333333` (Borda dos cards)

### Bordas
- **Border**: `#333333` (Bordas principais)
- **Border Secondary**: `#262626` (Bordas secundárias)
- **Border Subtle**: `#1f1f1f` (Bordas sutis)

### Estados
- **Success**: `#22C55E` (Verde sucesso)
- **Warning**: `#F59E0B` (Amarelo warning)
- **Destructive**: `#EF4444` (Vermelho erro)

## Tipografia

### Família de Fontes
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Tamanhos
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)
- **5xl**: 3rem (48px)
- **6xl**: 3.75rem (60px)

### Pesos
- **normal**: 400
- **medium**: 500
- **semibold**: 600
- **bold**: 700

### Line Heights
- **tight**: 1.25
- **normal**: 1.5
- **relaxed**: 1.75

## Espaçamentos

### Sistema de Spacing
- **0**: 0
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)
- **20**: 5rem (80px)
- **24**: 6rem (96px)

## Border Radius

### Valores
- **none**: 0
- **sm**: 0.125rem (2px)
- **base**: 0.25rem (4px)
- **md**: 0.375rem (6px)
- **lg**: 0.5rem (8px)
- **xl**: 0.75rem (12px)
- **2xl**: 1rem (16px)
- **3xl**: 1.5rem (24px)
- **full**: 9999px

## Sombras

### Sistema de Shadows
- **sm**: Sombra pequena
- **base**: Sombra base
- **md**: Sombra média
- **lg**: Sombra grande
- **xl**: Sombra extra grande
- **2xl**: Sombra dupla extra grande
- **inner**: Sombra interna

## Breakpoints

### Responsividade
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Animações

### Transições
- **fast**: 150ms ease-in-out
- **normal**: 250ms ease-in-out
- **slow**: 350ms ease-in-out

### Animações Customizadas
- **fadeIn**: Fade in suave
- **slideUp**: Slide up com fade
- **scaleIn**: Scale in com fade
- **skeleton-loading**: Animação de skeleton

## Componentes

### Button
```tsx
<Button variant="default" size="lg">
  Get Started
</Button>
```

**Variantes:**
- `default`: Botão primário verde
- `destructive`: Botão vermelho para ações destrutivas
- `outline`: Botão com borda
- `secondary`: Botão secundário
- `ghost`: Botão transparente
- `link`: Botão como link
- `gradient`: Botão com gradiente

**Tamanhos:**
- `sm`: Pequeno
- `default`: Padrão
- `lg`: Grande
- `xl`: Extra grande
- `icon`: Para ícones

### Card
```tsx
<Card className="bg-card border-card-border">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Badge
```tsx
<Badge variant="success">Success</Badge>
```

**Variantes:**
- `default`: Verde primário
- `secondary`: Cinza
- `destructive`: Vermelho
- `outline`: Com borda
- `success`: Verde sucesso
- `warning`: Amarelo warning

### Input
```tsx
<Input placeholder="Enter your email" />
```

### Avatar
```tsx
<Avatar>
  <AvatarImage src="/user.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

## Layout

### Dashboard Layout
- **Sidebar**: 256px de largura fixa
- **Main Content**: Flexível com scroll
- **Header**: Breadcrumb e título
- **Grid System**: Responsivo com gap de 24px

### Landing Page Layout
- **Header**: Navegação fixa
- **Hero Section**: Centralizado com CTAs
- **Features**: Grid responsivo
- **Footer**: 4 colunas com links

## Estados de Interação

### Hover
- Botões: Escala sutil (scale-95)
- Cards: Sombra aumentada
- Links: Mudança de cor

### Focus
- Ring verde com offset
- Outline visível para acessibilidade

### Active
- Botões: Escala reduzida
- Feedback visual imediato

### Loading
- Skeleton animations
- Spinner com cor primária
- Estados desabilitados

## Acessibilidade

### Contraste
- Todos os textos têm contraste adequado
- Cores de foco bem definidas
- Estados de erro claros

### Navegação
- Suporte completo a teclado
- Focus visible em todos os elementos
- Skip links implementados

### Screen Readers
- Labels apropriados
- ARIA attributes quando necessário
- Textos alternativos para ícones

## Performance

### Otimizações
- CSS custom properties para temas
- Animações otimizadas com transform
- Lazy loading de componentes
- Font display swap

### Bundle Size
- Componentes tree-shakeable
- Ícones importados individualmente
- CSS purged automaticamente

## Responsividade

### Mobile First
- Design mobile-first implementado
- Breakpoints bem definidos
- Touch targets adequados (44px mínimo)

### Tablet
- Layout adaptativo
- Grid system flexível
- Navegação otimizada

### Desktop
- Layout completo
- Hover states
- Sidebar sempre visível

## Temas

### Dark Mode (Padrão)
- Implementado como tema padrão
- Cores otimizadas para baixa luminosidade
- Contraste adequado

### Light Mode (Preparado)
- Sistema preparado para light mode
- Variáveis CSS organizadas
- Transições suaves entre temas

## Utilitários

### Classes CSS
- `.glass`: Efeito glassmorphism
- `.gradient-primary`: Gradiente verde
- `.gradient-background`: Gradiente de background
- `.animate-fade-in`: Animação fade in
- `.animate-slide-up`: Animação slide up
- `.animate-scale-in`: Animação scale in
- `.skeleton`: Animação de loading

## Guia de Uso

### Instalação
```bash
npm install
npm run dev
```

### Estrutura de Arquivos
```
src/
├── app/
│   ├── globals.css          # Variáveis CSS e estilos globais
│   ├── layout.tsx           # Layout principal
│   └── dashboard/
│       ├── layout.tsx       # Layout do dashboard
│       └── page.tsx         # Página principal
├── components/
│   ├── ui/                  # Componentes base
│   ├── dashboard/           # Componentes do dashboard
│   └── landing/             # Componentes da landing
└── lib/
    └── utils.ts             # Utilitários
```

### Customização
1. Modifique as variáveis CSS em `globals.css`
2. Atualize os componentes em `components/ui/`
3. Ajuste os layouts conforme necessário
4. Teste em diferentes breakpoints

## Checklist de Qualidade

- [x] Todas as cores em variáveis CSS
- [x] Tipografia padronizada
- [x] Componentes responsivos
- [x] Animações suaves
- [x] Estados de interação definidos
- [x] Acessibilidade implementada
- [x] Performance otimizada
- [x] Consistência visual total
- [x] Zero erros no console
- [x] Responsividade funcionando
- [x] Navegação funcionando
- [x] Estados de loading/error funcionando
- [x] Formulários funcionando

## Conclusão

O sistema de design implementado segue fielmente as referências visuais fornecidas, oferecendo uma experiência moderna, acessível e performática. Todos os componentes estão padronizados e prontos para uso em produção. 