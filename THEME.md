# Tema e Branding - Ramalho Transportes

## Modo Escuro Implementado

O sistema agora funciona em **Modo Escuro** por padrão, oferecendo uma experiência visual moderna e confortável para os olhos.

### Características do Tema:

- **Background Escuro**: Fundo escuro (tema dark do Tailwind)
- **Texto Clara**: Texto branco/claro para boa legibilidade
- **Cores Primárias**: Azul e variações de cyan para destaque
- **Toggle Rápido**: Botão na barra de navegação para alternar entre modo claro/escuro
- **Persistência**: O estado preferido é mantido na sessão

## Nome da Empresa

Todas as referências foram atualizadas de **"TransportLog"** para **"Ramalho Transportes"**:

- ✅ Título da página (metadata)
- ✅ Logo na barra de navegação
- ✅ Descrição SEO

## Variáveis de Tema CSS

O sistema usa variáveis CSS customizadas em `app/globals.css`:

```css
/* Modo Claro */
:root {
  --background: branco
  --foreground: preto
  --primary: azul
}

/* Modo Escuro */
.dark {
  --background: cinza escuro
  --foreground: branco
  --primary: azul claro
}
```

## Como Usar o Toggle

1. Clique no ícone de lua/sol na barra de navegação (canto superior direito)
2. A página alterna instantaneamente entre claro e escuro
3. No menu mobile, use a opção "Modo claro" ou "Modo escuro"

## Componentes Temáticos

Todos os componentes shadcn/ui se adaptam automaticamente ao tema:

- **Cards**: Mudam background e borda
- **Botões**: Cores se ajustam
- **Inputs**: Texto e background ajustados
- **Charts**: Cores dos gráficos otimizadas para cada tema

## Customizações Futuras

Para alterar o branding:

1. Edite `NAVIGATION.TSX` para mudar o nome da empresa
2. Edite `app/layout.tsx` para mudar o metadata/title
3. Edite `app/globals.css` para mudar as cores do tema
