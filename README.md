<<<<<<< HEAD
# TransportLog - Sistema de Gestão de Transportadora

TransportLog é um sistema completo de gestão para empresas de transportadora de cargas. Desenvolvido com Next.js 16 e Supabase, oferece uma solução moderna e intuitiva para controlar fretes, motoristas, veículos, clientes e análises financeiras.

## Features

- 🔐 **Autenticação Segura** - Sistema de login e cadastro com Supabase
- 📊 **Dashboard Inteligente** - Visão geral financeira em tempo real
- 🚚 **Gestão de Fretes** - CRUD completo para fretes com histórico
- 👨‍💼 **Gestão de Motoristas** - Cadastro e controle de motoristas
- 🚛 **Gestão de Veículos** - Frota de veículos com informações detalhadas
- 👥 **Gestão de Clientes** - Cadastro de clientes com contatos
- 💰 **Controle de Despesas** - Rastreamento de custos operacionais
- 📈 **Relatórios Analíticos** - Gráficos e estatísticas de desempenho
- 💳 **Cálculos Automáticos** - Lucro, receita e margem calculados automaticamente

## Stack Tecnológico

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Charts**: Recharts
- **Deployment**: Vercel

## Como Começar

### Pré-requisitos

- Node.js 18+ instalado
- Uma conta Supabase (pode ser criada em https://supabase.com)
- pnpm ou npm

### Instalação

1. Clone o repositório ou baixe via v0

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Adicione suas credenciais Supabase em `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

5. Execute o servidor de desenvolvimento:
```bash
pnpm dev
```

6. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## Estrutura do Projeto

```
app/
├── auth/                 # Páginas de autenticação
│   ├── login/
│   ├── sign-up/
│   ├── callback/
│   └── sign-up-success/
├── dashboard/            # Dashboard principal
├── fretes/              # Gestão de fretes
├── motoristas/          # Gestão de motoristas
├── clientes/            # Gestão de clientes
├── veiculos/            # Gestão de veículos
├── despesas/            # Gestão de despesas
├── relatorios/          # Relatórios e análises
└── layout.tsx           # Layout raiz

components/
├── Navigation.tsx       # Navegação principal
├── dashboard/           # Componentes do dashboard
│   ├── DashboardStats.tsx
│   └── RevenueChart.tsx
├── fretes/              # Componentes de fretes
│   ├── FreteForm.tsx
│   └── FretesList.tsx
└── ui/                  # Componentes shadcn/ui

lib/
├── supabase/
│   ├── client.ts       # Cliente Supabase para browser
│   ├── server.ts       # Cliente Supabase para servidor
│   └── proxy.ts        # Proxy para autenticação

scripts/
└── 001_create_tables.sql  # Script de inicialização do BD

public/                  # Arquivos estáticos
```

## Fluxo de Autenticação

1. Novo usuário acessa `/auth/sign-up`
2. Cria conta com email e senha
3. Confirma email (necessário para RLS)
4. Após confirmação, pode fazer login em `/auth/login`
5. Redirecionado para `/dashboard`

## Banco de Dados

### Tabelas Criadas

- **users** - Usuários (gerenciado por Supabase Auth)
- **motoristas** - Informações dos motoristas
- **clientes** - Dados dos clientes
- **veiculos** - Frota de veículos
- **fretes** - Registros de fretes com valores
- **despesas** - Custos operacionais

Todas as tabelas possuem:
- RLS (Row Level Security) habilitado
- Isolamento por usuário (user_id)
- Políticas de acesso restrito

## Funcionalidades Principais

### Dashboard
- Estatísticas de fretes (total, ativos, entregues)
- Receita, despesas e lucro líquido
- Gráficos de receita vs despesas
- Lucro acumulado nos últimos 30 dias

### Fretes
- Criar novo frete com todos os detalhes
- Atribuir motorista, veículo e cliente
- Rastrear status (ativo, entregue, cancelado)
- Editar e deletar fretes
- Ver histórico completo

### Despesas
- Categorizar despesas (combustível, manutenção, pedágio, etc)
- Associar a veículos específicos
- Resumo por categoria
- Análise de custos

### Relatórios
- Receita total e lucro líquido
- Status de fretes em gráficos
- Desempenho de motoristas
- Ticket médio
- Análise de margens

## Variáveis de Ambiente

```
NEXT_PUBLIC_SUPABASE_URL=          # URL do seu projeto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Chave anônima Supabase
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=  # URL de redirecionamento (dev)
```

## Troubleshooting

### Erro de RLS ao criar conta
- Certifique-se de confirmar o email antes de usar o sistema
- As políticas RLS exigem usuário autenticado

### Dados não aparecem
- Verifique se está logado
- Confirme que as tabelas foram criadas (check no Supabase)
- Verifique as políticas RLS no console Supabase

### Erro de autenticação
- Verifique as credenciais Supabase em `.env.local`
- Confirme que a URL e chave estão corretas

## Deployment

### Vercel
1. Push seu código para um repositório GitHub
2. Conecte o repositório ao Vercel
3. Configure as variáveis de ambiente no Vercel
4. Deploy automático!

## Licença

Este projeto é fornecido como é, para fins educacionais e comerciais.

## Suporte

Para problemas ou dúvidas:
1. Consulte a documentação do Supabase
2. Verifique a documentação do Next.js
3. Abra uma issue no repositório

## Roadmap

- [ ] Integração com APIs de rastreamento
- [ ] Sistema de notificações
- [ ] Integração com sistemas de pagamento
- [ ] App mobile
- [ ] Exportação de relatórios em PDF
- [ ] Sistema de comissões de motoristas

---

**Desenvolvido com ❤️ usando v0 by Vercel**
=======
# sistema-frete
>>>>>>> 611d338c4fb7a4ef4d90b72f76a9a2396c49c2d3
