'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Navigation from '@/components/Navigation'

interface Despesa {
  id: string
  descricao: string
  valor: number
  categoria: string
  data: string
  veiculo_id?: string
}

export default function DespesasPage() {
  const [despesas, setDespesas] = useState<Despesa[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDespesa, setEditingDespesa] = useState<Despesa | null>(null)
  const [formData, setFormData] = useState({
    descricao: '',
    valor: 0,
    categoria: 'combustivel',
    data: new Date().toISOString().split('T')[0],
    veiculo_id: '',
  })
  const [vehicles, setVehicles] = useState<any[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    } else {
      fetchDespesas()
      fetchVehicles()
    }
  }

  const fetchVehicles = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('veiculos')
      .select('id, placa')
      .eq('user_id', user.id)

    if (data) {
      setVehicles(data)
    }
  }

  const fetchDespesas = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('despesas')
      .select('*')
      .eq('user_id', user.id)
      .order('data', { ascending: false })

    if (data) {
      setDespesas(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (editingDespesa) {
      const { error } = await supabase
        .from('despesas')
        .update(formData)
        .eq('id', editingDespesa.id)
      if (!error) {
        setEditingDespesa(null)
        setShowForm(false)
        setFormData({ descricao: '', valor: 0, categoria: 'combustivel', data: new Date().toISOString().split('T')[0], veiculo_id: '' })
        fetchDespesas()
      }
    } else {
      const { error } = await supabase
        .from('despesas')
        .insert([{ ...formData, user_id: user.id }])
      if (!error) {
        setShowForm(false)
        setFormData({ descricao: '', valor: 0, categoria: 'combustivel', data: new Date().toISOString().split('T')[0], veiculo_id: '' })
        fetchDespesas()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta despesa?')) {
      const { error } = await supabase
        .from('despesas')
        .delete()
        .eq('id', id)
      if (!error) {
        fetchDespesas()
      }
    }
  }

  const handleEdit = (despesa: Despesa) => {
    setEditingDespesa(despesa)
    setFormData({
      descricao: despesa.descricao,
      valor: despesa.valor,
      categoria: despesa.categoria,
      data: despesa.data.split('T')[0],
      veiculo_id: despesa.veiculo_id || '',
    })
    setShowForm(true)
  }

  const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0)

  const despesasPorCategoria = despesas.reduce((acc, d) => {
    acc[d.categoria] = (acc[d.categoria] || 0) + d.valor
    return acc
  }, {} as Record<string, number>)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Despesas</h1>
            <p className="text-gray-600">Gerencie os custos operacionais da sua transportadora.</p>
          </div>
          <Button 
            onClick={() => {
              setEditingDespesa(null)
              setFormData({ descricao: '', valor: 0, categoria: 'combustivel', data: new Date().toISOString().split('T')[0], veiculo_id: '' })
              setShowForm(!showForm)
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {showForm ? 'Cancelar' : '+ Nova Despesa'}
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{formatCurrency(totalDespesas)}</p>
            </CardContent>
          </Card>

          {Object.entries(despesasPorCategoria).map(([categoria, valor]) => (
            <Card key={categoria} className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 capitalize">{categoria}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(valor as number)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {showForm && (
          <Card className="mb-8 bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle>{editingDespesa ? 'Editar Despesa' : 'Nova Despesa'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    placeholder="Ex: Combustível, Manutenção, etc."
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="valor">Valor (R$)</Label>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      value={formData.valor}
                      onChange={(e) => setFormData({...formData, valor: parseFloat(e.target.value) || 0})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <select
                      id="categoria"
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="combustivel">Combustível</option>
                      <option value="manutencao">Manutenção</option>
                      <option value="pedagio">Pedágio</option>
                      <option value="seguro">Seguro</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="data">Data</Label>
                    <Input
                      id="data"
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({...formData, data: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="veiculo">Veículo (Opcional)</Label>
                  <select
                    id="veiculo"
                    value={formData.veiculo_id}
                    onChange={(e) => setFormData({...formData, veiculo_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecione um veículo</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.placa}</option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  {editingDespesa ? 'Atualizar' : 'Criar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          {despesas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma despesa cadastrada ainda.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Data</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Descrição</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Categoria</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Valor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {despesas.map((despesa) => (
                  <tr key={despesa.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(despesa.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{despesa.descricao}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{despesa.categoria}</td>
                    <td className="px-6 py-4 text-sm font-medium text-red-600">{formatCurrency(despesa.valor)}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Button
                        onClick={() => handleEdit(despesa)}
                        variant="outline"
                        size="sm"
                        className="text-blue-600"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDelete(despesa.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        Deletar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
