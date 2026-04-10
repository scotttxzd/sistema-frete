# Guia do Usuário - TransportLog

Bem-vindo ao TransportLog! Este guia detalha como usar todas as funcionalidades do sistema.

## Primeiros Passos

### 1. Criar Conta

1. Acesse a página de Sign Up
2. Preencha os campos:
   - **Nome da Empresa:** Nome da sua transportadora
   - **Email:** Seu email corporativo
   - **Senha:** Mínimo 6 caracteres (use caracteres especiais para segurança)
3. Clique "Criar Conta"
4. Confirme seu email (verifique a caixa de entrada)
5. Volte e faça login

### 2. Dashboard - Sua Visão Geral

O Dashboard é sua central de comando. Aqui você vê:

- **Total de Fretes:** Todos os fretes cadastrados
- **Fretes Ativos:** Fretes em andamento
- **Receita Total:** Dinheiro arrecadado com fretes
- **Despesas:** Total gasto em manutenção, combustível, etc.
- **Lucro Líquido:** Receita - Despesas
- **Gráficos:** Visualização de receita vs despesas dos últimos 30 dias

**Dica:** Acesse o Dashboard diariamente para acompanhar seu negócio!

## Gerenciando Motoristas

### Adicionar Novo Motorista

1. Vá para "Motoristas" no menu
2. Clique "+ Novo Motorista"
3. Preencha:
   - **Nome completo:** Nome do motorista
   - **CPF:** Número do CPF
   - **CNH:** Número da Carteira Nacional de Habilitação
   - **Telefone:** Número para contato
4. Clique "Criar"

### Editar Motorista

1. Encontre o motorista na lista
2. Clique "Editar"
3. Altere os dados necessários
4. Clique "Atualizar"

### Deletar Motorista

1. Na lista de motoristas, clique "Deletar"
2. Confirme a ação

**⚠️ Aviso:** Motoristas com fretes associados não podem ser deletados facilmente. Altere o status para inativo em vez disso.

## Gerenciando Clientes

### Adicionar Novo Cliente

1. Vá para "Clientes"
2. Clique "+ Novo Cliente"
3. Preencha:
   - **Nome:** Nome da empresa ou pessoa
   - **Email:** Email para contato
   - **Telefone:** Número de telefone
   - **Endereço:** Endereço completo
4. Clique "Criar"

### Organizar Clientes

- Clientes aparecem em ordem alfabética por padrão
- Use o nome para localizar rapidamente
- Mantenha dados atualizados para melhor comunicação

## Gerenciando Veículos

### Adicionar Veículo

1. Vá para "Veículos"
2. Clique "+ Novo Veículo"
3. Preencha:
   - **Placa:** Placa do veículo (será formatada em maiúscula)
   - **Marca:** Scania, Volvo, Mercedes, etc.
   - **Modelo:** Modelo específico
   - **Ano:** Ano de fabricação
   - **Veículo Ativo:** Marque para veículos em operação
4. Clique "Criar"

### Marcar Veículo como Inativo

Se um veículo não está em operação:
1. Clique "Editar" no veículo
2. Desmarque "Veículo Ativo"
3. Clique "Atualizar"

**Benefício:** Veículos inativos não aparecem em novos fretes, mantendo listas limpas.

## Criando e Gerenciando Fretes

### Criar Novo Frete

1. Vá para "Fretes"
2. Clique "+ Novo Frete"
3. Preencha:
   - **Data de Coleta:** Quando o frete será coletado
   - **Data de Entrega:** Quando deve ser entregue
   - **Origem:** Cidade/local de saída
   - **Destino:** Cidade/local de chegada
   - **Descrição da Carga:** O que será transportado
   - **Peso (kg):** Peso aproximado
   - **Valor do Frete (R$):** Quanto será cobrado
   - **Motorista:** Selecione quem fará o frete
   - **Veículo:** Selecione qual carro será usado
   - **Cliente:** Quem contratou o frete
4. Clique "Criar Frete"

### Acompanhar Fretes

- **Tabela de Fretes:** Mostra data, rota, valor e status
- **Filtrar por Status:** Ativo, Entregue ou Cancelado
- **Editar:** Clique para alterar informações
- **Deletar:** Remove o frete do sistema

### Status dos Fretes

| Status | Significado | Ação |
|--------|-------------|------|
| **Ativo** | Em andamento | Acompanhe a entrega |
| **Entregue** | Completado | Conta para receita |
| **Cancelado** | Não realizado | Não conta para receita |

## Controle de Despesas

### Adicionar Despesa

1. Vá para "Despesas"
2. Clique "+ Nova Despesa"
3. Preencha:
   - **Descrição:** O que foi gasto (ex: "Combustível - Viagem SP")
   - **Valor (R$):** Quanto gastou
   - **Categoria:** Combustível, Manutenção, Pedágio, Seguro, Outro
   - **Data:** Quando ocorreu o gasto
   - **Veículo (Opcional):** Se foi específico de um carro
4. Clique "Criar"

### Categorias de Despesa

- **Combustível:** Diesel, gasolina, etc.
- **Manutenção:** Óleo, peças, consertos
- **Pedágio:** Portagens e taxas de estrada
- **Seguro:** Seguro do veículo
- **Outro:** Despesas diversas

**Dica:** Categorizar corretamente ajuda na análise financeira!

## Visualizando Relatórios

### Dashboard de Relatórios

Acesse "Relatórios" para ver:

1. **Cards de Resumo**
   - Receita Total: Dinheiro arrecadado
   - Despesas Total: Dinheiro gasto
   - Lucro Líquido: Receita - Despesas
   - Ticket Médio: Valor médio por frete

2. **Gráfico de Status**
   - Quantos fretes ativos, entregues, cancelados
   - Visualização em barras

3. **Gráfico de Pizza**
   - Distribuição percentual de status
   - Cores diferenciadas

4. **Desempenho por Motorista**
   - Quantidade de fretes por motorista
   - Receita gerada por cada um
   - Identifique os melhores desempenhos

### Usar Relatórios para Decisões

- **Receita caindo?** Veja quais rotas são mais lucrativas
- **Motorista com baixo desempenho?** Ofereça treinamento
- **Despesas altas?** Analise a categoria mais cara
- **Ticket médio baixo?** Considere aumentar preços

## Dashboard Financeiro

### Entendendo os Números

O Dashboard mostra 5 números-chave:

1. **Total de Fretes:** Quantas entregas foram feitas (útil para KPIs)
2. **Fretes Ativos:** Trabalhos em andamento
3. **Receita Total:** Dinheiro que entrou
4. **Despesas:** Dinheiro que saiu
5. **Lucro Líquido:** Lucro real = Receita - Despesas

### Gráficos do Dashboard

- **Gráfico de Barras:** Mostra receita e despesas por dia
- **Gráfico de Linha:** Mostra acumulado de lucro ao longo do tempo

**Análise:** Se a linha está subindo, seu negócio está crescendo! Se cai, analise as causas.

## Dicas e Truques

### Organização

- Adicione todos os motoristas e veículos antes de criar fretes
- Use nomes consistentes (ex: "São Paulo" e não "SP")
- Atualize status de fretes regularmente

### Maximizar Lucro

1. Analise qual rota gera mais receita
2. Identifique despesas que podem ser reduzidas
3. Acompanhe o desempenho de cada motorista
4. Calcule o custo por km para cada frete

### Segurança

- Nunca compartilhe sua senha
- Use email corporativo (mais seguro)
- Confirme sempre seu email
- Altere senha periodicamente

### Performance

- Fretes passados podem ser deletados para clareza
- Mantenha lista de clientes/motoristas atualizada
- Revise despesas mensalmente

## Troubleshooting

### Não consigo ver meus fretes

**Solução:**
1. Verifique se está logado (veja nome no menu)
2. Confirme que adicionou motoristas/clientes primeiro
3. Tente atualizar a página (F5)

### Dados não salvam

**Solução:**
1. Verifique conexão com internet
2. Confirme email na conta
3. Limpe cache do navegador
4. Tente novamente após aguardar

### Frete não aparece

**Possível Causa:** Dados vazios ou inválidos

**Solução:**
1. Preencha todos os campos obrigatórios
2. Verifique datas (coleta antes de entrega)
3. Certifique-se que motorista/veículo estão cadastrados

### Relatórios vazios

**Causa:** Sem fretes ou despesas registradas

**Solução:**
1. Crie alguns fretes de teste
2. Adicione algumas despesas
3. Aguarde alguns minutos para calcular
4. Recarregue a página

## Suporte

Se tiver dúvidas ou encontrar problemas:

1. Verifique a seção FAQ deste guia
2. Consulte a documentação em SETUP.md
3. Verifique sua conexão com internet
4. Limpe cookies/cache do navegador

## Checklist Diário

Use este checklist para máxima eficiência:

- [ ] Checou o Dashboard?
- [ ] Atualizou status dos fretes ativos?
- [ ] Registrou todas as despesas do dia?
- [ ] Confirmou entrega de algum frete?
- [ ] Verificou desempenho de motoristas?

## Metas Recomendadas

### Primeira Semana
- [ ] Cadastrar 5 motoristas
- [ ] Cadastrar 10 clientes
- [ ] Cadastrar 5 veículos
- [ ] Criar 10 fretes de teste

### Primeiro Mês
- [ ] 30+ fretes registrados
- [ ] Acompanhamento diário de despesas
- [ ] Análise do relatório mensal
- [ ] Identificar rota mais lucrativa

---

**Dúvidas? Consulte SETUP.md ou ARCHITECTURE.md para informações técnicas.**

**Desenvolvido com ❤️ usando v0 by Vercel**
