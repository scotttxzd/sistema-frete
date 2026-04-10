-- Sistema de Gestão de Transportadora de Cargas
-- Tabelas principais: fretes, motoristas, clientes, despesas

-- Tabela de motoristas
CREATE TABLE IF NOT EXISTS motoristas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  telefone VARCHAR(20),
  cnh VARCHAR(20),
  categoria_cnh VARCHAR(5),
  vencimento_cnh DATE,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'ferias')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  cnpj VARCHAR(18) UNIQUE,
  cpf VARCHAR(14),
  tipo VARCHAR(10) DEFAULT 'pj' CHECK (tipo IN ('pf', 'pj')),
  email VARCHAR(255),
  telefone VARCHAR(20),
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(10),
  observacoes TEXT,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de veículos
CREATE TABLE IF NOT EXISTS veiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  placa VARCHAR(10) NOT NULL,
  modelo VARCHAR(100),
  marca VARCHAR(50),
  ano INTEGER,
  tipo VARCHAR(50),
  capacidade_kg DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'em_viagem', 'manutencao')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de fretes
CREATE TABLE IF NOT EXISTS fretes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  numero_frete VARCHAR(50) NOT NULL,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  motorista_id UUID REFERENCES motoristas(id) ON DELETE SET NULL,
  veiculo_id UUID REFERENCES veiculos(id) ON DELETE SET NULL,
  
  -- Origem e Destino
  origem_cidade VARCHAR(100) NOT NULL,
  origem_estado VARCHAR(2) NOT NULL,
  origem_endereco TEXT,
  destino_cidade VARCHAR(100) NOT NULL,
  destino_estado VARCHAR(2) NOT NULL,
  destino_endereco TEXT,
  
  -- Datas
  data_coleta DATE,
  data_entrega DATE,
  data_previsao_entrega DATE,
  
  -- Carga
  descricao_carga TEXT,
  peso_kg DECIMAL(10,2),
  volume_m3 DECIMAL(10,2),
  
  -- Valores
  valor_frete DECIMAL(12,2) NOT NULL DEFAULT 0,
  valor_combustivel DECIMAL(12,2) DEFAULT 0,
  valor_pedagio DECIMAL(12,2) DEFAULT 0,
  valor_manutencao DECIMAL(12,2) DEFAULT 0,
  valor_diarias DECIMAL(12,2) DEFAULT 0,
  valor_outros_custos DECIMAL(12,2) DEFAULT 0,
  
  -- Calculados
  custo_total DECIMAL(12,2) GENERATED ALWAYS AS (
    COALESCE(valor_combustivel, 0) + 
    COALESCE(valor_pedagio, 0) + 
    COALESCE(valor_manutencao, 0) + 
    COALESCE(valor_diarias, 0) + 
    COALESCE(valor_outros_custos, 0)
  ) STORED,
  lucro_bruto DECIMAL(12,2) GENERATED ALWAYS AS (
    COALESCE(valor_frete, 0) - (
      COALESCE(valor_combustivel, 0) + 
      COALESCE(valor_pedagio, 0) + 
      COALESCE(valor_manutencao, 0) + 
      COALESCE(valor_diarias, 0) + 
      COALESCE(valor_outros_custos, 0)
    )
  ) STORED,
  
  -- Status e observações
  status VARCHAR(30) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'entregue', 'cancelado')),
  observacoes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de despesas extras (custos fixos mensais, etc)
CREATE TABLE IF NOT EXISTS despesas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  frete_id UUID REFERENCES fretes(id) ON DELETE SET NULL,
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('combustivel', 'pedagio', 'manutencao', 'seguro', 'ipva', 'multa', 'salario', 'outros')),
  descricao TEXT NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  data_despesa DATE NOT NULL,
  data_pagamento DATE,
  pago BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE motoristas ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE veiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE fretes ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para motoristas
CREATE POLICY "motoristas_select" ON motoristas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "motoristas_insert" ON motoristas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "motoristas_update" ON motoristas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "motoristas_delete" ON motoristas FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para clientes
CREATE POLICY "clientes_select" ON clientes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "clientes_insert" ON clientes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "clientes_update" ON clientes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "clientes_delete" ON clientes FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para veiculos
CREATE POLICY "veiculos_select" ON veiculos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "veiculos_insert" ON veiculos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "veiculos_update" ON veiculos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "veiculos_delete" ON veiculos FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para fretes
CREATE POLICY "fretes_select" ON fretes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "fretes_insert" ON fretes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fretes_update" ON fretes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "fretes_delete" ON fretes FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para despesas
CREATE POLICY "despesas_select" ON despesas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "despesas_insert" ON despesas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "despesas_update" ON despesas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "despesas_delete" ON despesas FOR DELETE USING (auth.uid() = user_id);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_fretes_user_id ON fretes(user_id);
CREATE INDEX IF NOT EXISTS idx_fretes_status ON fretes(status);
CREATE INDEX IF NOT EXISTS idx_fretes_data_coleta ON fretes(data_coleta);
CREATE INDEX IF NOT EXISTS idx_motoristas_user_id ON motoristas(user_id);
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_despesas_user_id ON despesas(user_id);
CREATE INDEX IF NOT EXISTS idx_despesas_data ON despesas(data_despesa);
