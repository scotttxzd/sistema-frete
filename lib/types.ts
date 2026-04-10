// Tipos para o sistema TransportLog

export interface Motorista {
  id: string
  user_id: string
  nome: string
  cpf: string
  cnh: string
  telefone: string
  created_at: string
  updated_at: string
}

export interface Cliente {
  id: string
  user_id: string
  nome: string
  email: string
  telefone: string
  endereco: string
  created_at: string
  updated_at: string
}

export interface Veiculo {
  id: string
  user_id: string
  placa: string
  marca: string
  modelo: string
  ano: number
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Frete {
  id: string
  user_id: string
  motorista_id?: string
  cliente_id?: string
  veiculo_id?: string
  data_coleta: string
  data_entrega: string
  origem: string
  destino: string
  descricao_carga: string
  peso: number
  valor_frete: number
  status: 'ativo' | 'entregue' | 'cancelado'
  created_at: string
  updated_at: string
}

export interface Despesa {
  id: string
  user_id: string
  veiculo_id?: string
  descricao: string
  valor: number
  categoria: 'combustivel' | 'manutencao' | 'pedagio' | 'seguro' | 'outro'
  data: string
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalFretes: number
  fretesAtivos: number
  receita: number
  despesas: number
  lucro: number
}

export interface RelatorioData {
  totalFretes: number
  fretesEntregues: number
  fretesAtivos: number
  fretesCancelados: number
  receitaTotal: number
  despesasTotal: number
  lucroTotal: number
  ticketMedio: number
  statusData: Array<{ name: string; value: number; fill: string }>
  motoristasData: Array<{ nome: string; fretes: number; receita: number }>
}
