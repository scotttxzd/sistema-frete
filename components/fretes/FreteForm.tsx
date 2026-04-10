'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

interface FreteFormProps {
  onSubmit: (frete: any) => void
  initialData?: any
}

export default function FreteForm({ onSubmit, initialData }: FreteFormProps) {
  const [motoristas, setMotoristas] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [veiculos, setVeiculos] = useState<any[]>([])
  const [formData, setFormData] = useState(initialData || {
    data_coleta: '',
    data_entrega: '',
    origem: '',
    destino: '',
    descricao_carga: '',
    peso: 0,
    valor_frete: 0,
    motorista_id: '',
    cliente_id: '',
    veiculo_id: '',
    status: 'ativo',
  })

  useEffect(() => {
    fetchMotoristas()
    fetchClientes()
    fetchVeiculos()
  }, [])

  const fetchMotoristas = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('motoristas')
      .select('id, nome')
      .eq('user_id', user.id)

    if (data) setMotoristas(data)
  }

  const fetchClientes = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('clientes')
      .select('id, nome')
      .eq('user_id', user.id)

    if (data) setClientes(data)
  }

  const fetchVeiculos = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('veiculos')
      .select('id, placa')
      .eq('user_id', user.id)

    if (data) setVeiculos(data)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['peso', 'valor_frete'].includes(name) ? parseFloat(value) || 0 : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="data_coleta">Data de Coleta</Label>
          <Input
            id="data_coleta"
            type="datetime-local"
            name="data_coleta"
            value={formData.data_coleta}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="data_entrega">Data de Entrega</Label>
          <Input
            id="data_entrega"
            type="datetime-local"
            name="data_entrega"
            value={formData.data_entrega}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="origem">Origem</Label>
          <Input
            id="origem"
            name="origem"
            value={formData.origem}
            onChange={handleChange}
            placeholder="Cidade de saída"
            required
          />
        </div>
        <div>
          <Label htmlFor="destino">Destino</Label>
          <Input
            id="destino"
            name="destino"
            value={formData.destino}
            onChange={handleChange}
            placeholder="Cidade de chegada"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="descricao_carga">Descrição da Carga</Label>
        <textarea
          id="descricao_carga"
          name="descricao_carga"
          value={formData.descricao_carga}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="peso">Peso (kg)</Label>
          <Input
            id="peso"
            type="number"
            step="0.01"
            name="peso"
            value={formData.peso}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="valor_frete">Valor do Frete (R$)</Label>
          <Input
            id="valor_frete"
            type="number"
            step="0.01"
            name="valor_frete"
            value={formData.valor_frete}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="motorista_id">Motorista</Label>
          <select
            id="motorista_id"
            name="motorista_id"
            value={formData.motorista_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione um motorista</option>
            {motoristas.map(m => (
              <option key={m.id} value={m.id}>{m.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="veiculo_id">Veículo</Label>
          <select
            id="veiculo_id"
            name="veiculo_id"
            value={formData.veiculo_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione um veículo</option>
            {veiculos.map(v => (
              <option key={v.id} value={v.id}>{v.placa}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cliente_id">Cliente</Label>
          <select
            id="cliente_id"
            name="cliente_id"
            value={formData.cliente_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione um cliente</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="ativo">Ativo</option>
          <option value="entregue">Entregue</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        {initialData ? 'Atualizar Frete' : 'Criar Frete'}
      </Button>
    </form>
  )
}
