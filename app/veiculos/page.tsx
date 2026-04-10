'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Navigation from '@/components/Navigation'

interface Veiculo {
  id: string
  placa: string
  modelo: string
  marca: string
  ano: number
  ativo: boolean
}

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVeiculo, setEditingVeiculo] = useState<Veiculo | null>(null)
  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    marca: '',
    ano: new Date().getFullYear(),
    ativo: true,
  })
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
      fetchVeiculos()
    }
  }

  const fetchVeiculos = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('veiculos')
      .select('*')
      .eq('user_id', user.id)
      .order('placa')

    if (data) {
      setVeiculos(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (editingVeiculo) {
      const { error } = await supabase
        .from('veiculos')
        .update(formData)
        .eq('id', editingVeiculo.id)
      if (!error) {
        setEditingVeiculo(null)
        setShowForm(false)
        setFormData({ placa: '', modelo: '', marca: '', ano: new Date().getFullYear(), ativo: true })
        fetchVeiculos()
      }
    } else {
      const { error } = await supabase
        .from('veiculos')
        .insert([{ ...formData, user_id: user.id }])
      if (!error) {
        setShowForm(false)
        setFormData({ placa: '', modelo: '', marca: '', ano: new Date().getFullYear(), ativo: true })
        fetchVeiculos()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este veículo?')) {
      const { error } = await supabase
        .from('veiculos')
        .delete()
        .eq('id', id)
      if (!error) {
        fetchVeiculos()
      }
    }
  }

  const handleEdit = (veiculo: Veiculo) => {
    setEditingVeiculo(veiculo)
    setFormData({
      placa: veiculo.placa,
      modelo: veiculo.modelo,
      marca: veiculo.marca,
      ano: veiculo.ano,
      ativo: veiculo.ativo,
    })
    setShowForm(true)
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Veículos</h1>
            <p className="text-gray-600">Gerencie a frota de veículos da sua transportadora.</p>
          </div>
          <Button 
            onClick={() => {
              setEditingVeiculo(null)
              setFormData({ placa: '', modelo: '', marca: '', ano: new Date().getFullYear(), ativo: true })
              setShowForm(!showForm)
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {showForm ? 'Cancelar' : '+ Novo Veículo'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle>{editingVeiculo ? 'Editar Veículo' : 'Novo Veículo'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="placa">Placa</Label>
                    <Input
                      id="placa"
                      value={formData.placa}
                      onChange={(e) => setFormData({...formData, placa: e.target.value.toUpperCase()})}
                      placeholder="ABC-1234"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="marca">Marca</Label>
                    <Input
                      id="marca"
                      value={formData.marca}
                      onChange={(e) => setFormData({...formData, marca: e.target.value})}
                      placeholder="Scania, Volvo, etc."
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input
                      id="modelo"
                      value={formData.modelo}
                      onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                      placeholder="Ex: Scania R440"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ano">Ano</Label>
                    <Input
                      id="ano"
                      type="number"
                      value={formData.ano}
                      onChange={(e) => setFormData({...formData, ano: parseInt(e.target.value)})}
                      min="2000"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="ativo"
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="ativo" className="mb-0">Veículo Ativo</Label>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  {editingVeiculo ? 'Atualizar' : 'Criar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {veiculos.map((veiculo) => (
            <Card key={veiculo.id} className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-blue-600">{veiculo.placa}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Marca</p>
                  <p className="text-sm font-medium text-gray-900">{veiculo.marca}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Modelo</p>
                  <p className="text-sm font-medium text-gray-900">{veiculo.modelo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ano</p>
                  <p className="text-sm font-medium text-gray-900">{veiculo.ano}</p>
                </div>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    veiculo.ativo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {veiculo.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleEdit(veiculo)}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-blue-600"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(veiculo.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600"
                  >
                    Deletar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
