# Guia de Setup - TransportLog

Este guia detalha como configurar o TransportLog localmente ou em produção.

## Pré-requisitos

- Node.js 18.17.0 ou superior
- npm, yarn, pnpm ou bun
- Conta Supabase (grátis em https://supabase.com)
- Conta Vercel para deployment (opcional, grátis em https://vercel.com)

## Instalação Local

### 1. Clonar o Repositório

```bash
git clone <seu-repositorio>
cd transportlog
```

### 2. Instalar Dependências

Com pnpm (recomendado):
```bash
pnpm install
```

Ou com npm:
```bash
npm install
```

### 3. Configurar Supabase

#### 3.1 Criar Projeto Supabase
1. Acesse https://supabase.com
2. Clique em "New Project"
3. Selecione uma organização ou crie uma
4. Preencha:
   - Project Name: `transportlog` (ou seu nome preferido)
   - Database Password: (guarde com segurança)
   - Region: Escolha a mais próxima do seu servidor
5. Clique "Create new project" e espere a inicialização

#### 3.2 Copiar Credenciais
1. Na página do projeto, vá para "Settings" → "API"
2. Copie:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** (NEXT_PUBLIC_SUPABASE_ANON_KEY)

#### 3.3 Criar Arquivo de Variáveis de Ambiente

Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu-anon-key-aqui
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### 4. Executar Migrations do Banco

#### 4.1 Via Console Supabase (Recomendado)

1. Acesse seu projeto no Supabase
2. Vá para "SQL Editor" → "New Query"
3. Copie todo o conteúdo de `scripts/001_create_tables.sql`
4. Cole no SQL Editor
5. Clique "Run" para executar

#### 4.2 Via Script Local (Alternativa)

```bash
# Se tiver permissões (não recomendado para segurança)
psql postgresql://seu_usuario@seu_host:5432/seu_banco < scripts/001_create_tables.sql
```

### 5. Iniciar Servidor de Desenvolvimento

```bash
pnpm dev
```

Acesse http://localhost:3000

## Primeiro Acesso

1. Acesse a página de Sign Up: http://localhost:3000/auth/sign-up
2. Preencha:
   - Nome da Empresa
   - Email
   - Senha
3. Confirme seu email (verifique sua caixa de entrada)
4. Faça login com suas credenciais
5. Pronto! Você está no dashboard

## Configuração de Tabelas e RLS

As tabelas são criadas automaticamente pelo script SQL. Todas as tabelas incluem:

- **Row Level Security (RLS)** habilitado
- **Isolamento por usuário** - cada usuário só vê seus dados
- **Timestamps** - created_at e updated_at automáticos

### Tabelas Criadas

| Tabela | Descrição |
|--------|-----------|
| motoristas | Dados dos motoristas |
| clientes | Informações dos clientes |
| veiculos | Frota de veículos |
| fretes | Registros de fretes |
| despesas | Custos operacionais |

## Deployment no Vercel

### 1. Preparar Repositório GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Conectar ao Vercel

1. Acesse https://vercel.com/new
2. Conecte seu repositório GitHub
3. Selecione o repositório `transportlog`
4. Clique "Import"

### 3. Configurar Variáveis de Ambiente

No Vercel, em "Environment Variables", adicione:
```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu-anon-key-aqui
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://seu-dominio.vercel.app/auth/callback
```

### 4. Deploy

Clique "Deploy" e aguarde a conclusão.

## Troubleshooting

### Erro: "NEXT_PUBLIC_SUPABASE_URL is not defined"

**Solução:** Verifique se o arquivo `.env.local` existe e contém as variáveis corretas.

```bash
# Verificar se arquivo existe
ls -la .env.local

# Verificar conteúdo
cat .env.local
```

### Erro: "Row-level security violation"

**Causa:** Usuário não confirmou email ou políticas RLS incorretas.

**Solução:**
1. Confirme seu email no Supabase
2. Verifique as RLS policies em Settings → Authentication → Policies

### Erro: "No user session"

**Causa:** Token expirado ou não autenticado.

**Solução:**
```bash
# Limpar localStorage e cache
# No navegador, abra DevTools (F12)
# Vá para Application → Storage → Local Storage
# Limpe todos os dados
# Recarregue a página
```

### Banco não criou as tabelas

**Verificar no Supabase:**
1. Vá para "SQL Editor"
2. Clique em "New Query"
3. Digite: `SELECT * FROM motoristas;`
4. Se receber erro, as tabelas não foram criadas

**Solução:** Execute novamente o script SQL em `scripts/001_create_tables.sql`

### Página em branco ou erro 500

**Solução:**
1. Abra o DevTools (F12)
2. Vá para "Console"
3. Verifique se há erros
4. Verifique se a URL do Supabase está correta

## Desenvolvimento

### Estrutura de Pastas

```
app/              - Rotas e páginas Next.js
components/       - Componentes React
lib/              - Funções utilitárias e clients
public/           - Arquivos estáticos
scripts/          - Scripts SQL e automação
```

### Convenções de Código

- **Componentes:** PascalCase (ex: `DashboardStats.tsx`)
- **Funções:** camelCase (ex: `fetchFretes()`)
- **Variáveis:** camelCase
- **Constantes:** UPPER_CASE

### Adicionando Novas Páginas

1. Crie pasta em `app/nova-pagina/`
2. Crie arquivo `page.tsx`
3. Adicione link em `components/Navigation.tsx`
4. Implemente componentes em `components/nova-pagina/`

### Adicionando Novas Tabelas

1. Crie a tabela no Supabase SQL Editor
2. Habilite RLS
3. Crie políticas de acesso
4. Adicione tipos em `lib/types.ts`
5. Crie componentes para CRUD

## Performance

### Otimizações Implementadas

- Server-Side Rendering (SSR) quando necessário
- Client-Side Caching com SWR
- Lazy Loading de imagens
- Code Splitting automático
- Compression de assets

### Melhorias Recomendadas

- Implementar paginação nas tabelas
- Adicionar cache de dashboard
- Otimizar queries SQL
- Implementar rate limiting

## Segurança

### Práticas Implementadas

- RLS (Row Level Security) obrigatório
- Hash de senhas com bcrypt
- HTTP-only cookies para sessão
- CSRF protection automática
- SQL injection prevention com queries parametrizadas

### Checklist de Segurança

- [ ] Mudar senha padrão do banco
- [ ] Habilitar 2FA no Supabase
- [ ] Configurar backup automático
- [ ] Revisar RLS policies
- [ ] Monitorar acessos ao banco

## Suporte

- Documentação Supabase: https://supabase.com/docs
- Documentação Next.js: https://nextjs.org/docs
- Documentação Recharts: https://recharts.org
- Documentação shadcn/ui: https://ui.shadcn.com

---

**Desenvolvido com ❤️ usando v0 by Vercel**
