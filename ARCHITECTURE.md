# Arquitetura - TransportLog

## Visão Geral

TransportLog é uma aplicação full-stack construída com:
- **Frontend:** Next.js 16 App Router + React 19
- **Backend:** Vercel Edge Functions + Supabase
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Authentication
- **Styling:** Tailwind CSS v4 + shadcn/ui

## Stack de Tecnologia

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19.2
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui
- **Charts:** Recharts
- **State Management:** React Hooks + SWR

### Backend
- **Runtime:** Node.js 18+
- **API:** Route Handlers (Next.js API Routes)
- **Database:** Supabase (PostgreSQL 15)
- **Auth:** Supabase Auth (JWT)
- **ORM:** Query direto com @supabase/supabase-js

### Deployment
- **Hosting:** Vercel
- **Database:** Supabase Cloud
- **Storage:** Supabase Storage (futura)
- **CDN:** Vercel Edge Network

## Arquitetura de Pastas

```
transportlog/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout raiz
│   ├── page.tsx                 # Página inicial (redireciona)
│   ├── auth/
│   │   ├── login/page.tsx       # Página de login
│   │   ├── sign-up/page.tsx     # Página de cadastro
│   │   ├── callback/route.ts    # Callback de autenticação
│   │   └── sign-up-success/page.tsx
│   ├── dashboard/
│   │   └── page.tsx             # Dashboard principal
│   ├── fretes/
│   │   └── page.tsx             # Gestão de fretes
│   ├── motoristas/
│   │   └── page.tsx             # Gestão de motoristas
│   ├── clientes/
│   │   └── page.tsx             # Gestão de clientes
│   ├── veiculos/
│   │   └── page.tsx             # Gestão de veículos
│   ├── despesas/
│   │   └── page.tsx             # Gestão de despesas
│   └── relatorios/
│       └── page.tsx             # Relatórios e analytics
├── components/                   # Componentes React reutilizáveis
│   ├── Navigation.tsx           # Navegação principal
│   ├── dashboard/
│   │   ├── DashboardStats.tsx   # Cards de estatísticas
│   │   └── RevenueChart.tsx     # Gráficos de receita
│   ├── fretes/
│   │   ├── FreteForm.tsx        # Formulário de fretes
│   │   └── FretesList.tsx       # Lista de fretes
│   └── ui/                      # shadcn/ui components (gerado)
├── lib/                         # Lógica compartilhada
│   ├── supabase/
│   │   ├── client.ts           # Cliente para browser
│   │   ├── server.ts           # Cliente para servidor
│   │   └── proxy.ts            # Proxy para autenticação
│   ├── types.ts                # Tipos TypeScript
│   └── utils.ts                # Funções utilitárias
├── scripts/
│   └── 001_create_tables.sql   # Script de inicialização do BD
├── public/                      # Arquivos estáticos
├── middleware.ts               # Middleware de autenticação
├── next.config.mjs            # Configuração Next.js
├── tsconfig.json              # Configuração TypeScript
├── package.json               # Dependências
└── README.md                  # Documentação
```

## Fluxo de Dados

### Autenticação

```
┌─────────────────────────────────────────────────────────┐
│                   Fluxo de Autenticação                 │
└─────────────────────────────────────────────────────────┘

1. Novo Usuário
   └─> Sign Up Page
       └─> createClient().auth.signUp()
           └─> Supabase envia email de confirmação
               └─> Usuário confirma email
                   └─> Conta ativada com user_id

2. Login
   └─> Login Page
       └─> createClient().auth.signInWithPassword()
           └─> Supabase gera JWT token
               └─> Token armazenado em cookie HTTP-only
                   └─> Middleware valida em cada request

3. Logout
   └─> Navigation component
       └─> supabase.auth.signOut()
           └─> Cookie removido
               └─> Redireciona para login
```

### Busca de Dados

```
┌──────────────────────────────────────────────────────┐
│           Fluxo de Busca de Dados                    │
└──────────────────────────────────────────────────────┘

1. Componente Monta
   └─> useEffect(() => { fetchData() }, [])
       └─> getUser() valida autenticação
           └─> supabase.from('table').select()
               └─> RLS filtra por user_id
                   └─> Dados retornam apenas do usuário
                       └─> setData() atualiza estado

2. RLS Protection
   ├─> User autenticado?
   │   └─ Não → Erro 403
   │   └─ Sim → Continuar
   ├─> Belongs to user_id?
   │   └─ Não → Filtra resultado
   │   └─ Sim → Retorna completo
```

### Ciclo de Vida de uma Página

```
┌──────────────────────────────────────────────────┐
│    Ciclo de Vida - Página de Fretes             │
└──────────────────────────────────────────────────┘

1. Carregamento
   └─> page.tsx (Client Component 'use client')
       └─> useEffect(() => { checkAuth() })
           └─> getUser() → validar sessão
           └─> fetchFretes() → buscar dados

2. Renderização
   └─> Mostra loading spinner
   └─> Layout renderizado
   └─> Navigation renderizado
   └─> FretesList renderizado
       └─> Mapeia sobre array de fretes
       └─> Renderiza linhas da tabela

3. Interação
   └─> Clique em "Novo Frete"
       └─> setShowForm(true)
       └─> Renderiza FreteForm
           └─> Carrega motoristas e clientes
           └─> Usuário preenche dados
           └─> onSubmit()
               └─> supabase.from('fretes').insert()
               └─> RLS valida user_id
               └─> fetchFretes() atualiza lista

4. Atualização
   └─> supabase.from('fretes').update()
   └─> Valida proprietário com RLS
   └─> Lista se atualiza
```

## Modelo de Dados

### Diagrama ER (Entidade-Relacionamento)

```
┌─────────────────────────────────────────────────────────┐
│                  Diagrama de Tabelas                     │
└─────────────────────────────────────────────────────────┘

auth.users (Supabase)
├── id (UUID)
├── email
├── raw_user_meta_data (company_name)
└── ...

motoristas
├── id (UUID) ← user_id
├── user_id ↦ auth.users.id
├── nome
├── cpf
├── cnh
└── telefone

clientes
├── id (UUID)
├── user_id ↦ auth.users.id
├── nome
├── email
├── telefone
└── endereco

veiculos
├── id (UUID)
├── user_id ↦ auth.users.id
├── placa
├── marca
├── modelo
├── ano
└── ativo

fretes
├── id (UUID)
├── user_id ↦ auth.users.id
├── motorista_id ↦ motoristas.id
├── cliente_id ↦ clientes.id
├── veiculo_id ↦ veiculos.id
├── data_coleta
├── data_entrega
├── origem
├── destino
├── descricao_carga
├── peso
├── valor_frete
└── status

despesas
├── id (UUID)
├── user_id ↦ auth.users.id
├── veiculo_id ↦ veiculos.id
├── descricao
├── valor
├── categoria
└── data
```

## Segurança

### Row Level Security (RLS)

Todas as tabelas possuem RLS habilitado:

```sql
ALTER TABLE motoristas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_motoristas"
  ON motoristas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "insert_own_motoristas"
  ON motoristas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_motoristas"
  ON motoristas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "delete_own_motoristas"
  ON motoristas FOR DELETE
  USING (auth.uid() = user_id);
```

**Benefício:** Cada usuário só pode acessar seus próprios dados, mesmo que obtive acesso à chave API.

### Fluxo de Autenticação Seguro

1. **Signup:** Email + senha → Supabase hash com bcrypt
2. **Session:** JWT token em HTTP-only cookie (não acessível por JS)
3. **Refresh:** Token automaticamente renovado pelo middleware
4. **CORS:** Configurado para aceitar apenas origem autorizada
5. **RLS:** Cada query já filtra por user_id

## Performance

### Otimizações Implementadas

| Técnica | Implementação | Benefício |
|---------|--------------|-----------|
| **Code Splitting** | Next.js automático | Menor JS inicial |
| **Image Optimization** | next/image | Reduz tamanho imagens |
| **Lazy Loading** | Dynamic imports | Carrega sob demanda |
| **Caching** | Supabase cache headers | Reduz requisiçoes |
| **Minification** | Terser (automático) | JS/CSS menor |
| **Compression** | Gzip (automático) | Menos banda |

### Recomendações de Melhoria

1. Implementar **Pagination** nas tabelas grandes
2. Usar **Indexes** no banco para queries frequentes
3. Adicionar **Database Connection Pooling**
4. Implementar **Incremental Static Regeneration** (ISR)
5. Usar **Service Workers** para offline mode

## Escalabilidade

### Horizontal Scaling

- **Frontend:** Vercel distribui automaticamente
- **Backend:** Supabase escala automaticamente
- **Database:** PostgreSQL com auto-scaling

### Limites

- **Supabase Free Tier:** 500k Storage, 1GB DB, 2GB Bandwidth
- **Recomendado para:** até 5,000 usuários ativos
- **Para mais:** Upgrade para Pro (Supabase) + Vercel Pro

## Deploy Pipeline

```
┌────────────────────────────────────────────┐
│         Git Push ao main branch            │
└────────────────┬───────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────┐
│     Vercel detecta push automático         │
└────────────────┬───────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────┐
│  1. Install dependências (pnpm)            │
│  2. Type check (tsc)                       │
│  3. Build Next.js (next build)             │
│  4. Run tests (se configurado)             │
└────────────────┬───────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────┐
│     Deploy para Vercel Edge Network        │
└────────────────┬───────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────┐
│   URL gerada: https://seu-app.vercel.app  │
└────────────────────────────────────────────┘
```

## Monitoramento

### Recomendado para Produção

1. **Error Tracking:** Sentry, LogRocket
2. **Analytics:** Vercel Analytics, Mixpanel
3. **Performance:** Web Vitals (Vercel)
4. **Database:** Supabase dashboard
5. **Uptime:** UptimeRobot, PagerDuty

## Melhorias Futuras

1. **GraphQL API** - Alternativa REST
2. **Real-time Updates** - WebSockets para live data
3. **Mobile App** - React Native ou Flutter
4. **API Public** - Para integrações terceiros
5. **Automation** - Webhooks e automações
6. **Payments** - Integração Stripe/PagSeguro
7. **SMS Alerts** - Notificações push
8. **Offline Mode** - PWA com Service Workers

---

**Desenvolvido com ❤️ usando v0 by Vercel**
