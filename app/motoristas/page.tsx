'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Navigation from '@/components/Navigation'

interface Motorista {
  id: string
  nome: string
  cpf: string
  cnh: string
  telefone: string
  veiculo_id?: string
}

export default function MotoristaPage() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMotorista, setEditingMotorista] = useState<Motorista | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cnh: '',
    telefone: '',
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
      fetchMotoristas()
    }
  }

  const fetchMotoristas = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('motoristas')
      .select('*')
      .eq('user_id', user.id)
      .order('nome')

    if (data) {
      setMotoristas(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (editingMotorista) {
      const { error } = await supabase
        .from('motoristas')
        .update(formData)
        .eq('id', editingMotorista.id)
      if (!error) {
        setEditingMotorista(null)
        setShowForm(false)
        setFormData({ nome: '', cpf: '', cnh: '', telefone: '' })
        fetchMotoristas()
      }
    } else {
      const { error } = await supabase
        .from('motoristas')
        .insert([{ ...formData, user_id: user.id }])
      if (!error) {
        setShowForm(false)
        setFormData({ nome: '', cpf: '', cnh: '', telefone: '' })
        fetchMotoristas()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este motorista?')) {
      const { error } = await supabase
        .from('motoristas')
        .delete()
        .eq('id', id)
      if (!error) {
        fetchMotoristas()
      }
    }
  }

  const handleEdit = (motorista: Motorista) => {
    setEditingMotorista(motorista)
    setFormData({
      nome: motorista.nome,
      cpf: motorista.cpf,
      cnh: motorista.cnh,
      telefone: motorista.telefone,
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Motoristas</h1>
            <p className="text-gray-600">Gerencie seus motoristas e suas informações.</p>
          </div>
          <Button 
            onClick={() => {
              setEditingMotorista(null)
              setFormData({ nome: '', cpf: '', cnh: '', telefone: '' })
              setShowForm(!showForm)
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {showForm ? 'Cancelar' : '+ Novo Motorista'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle>{editingMotorista ? 'Editar Motorista' : 'Novo Motorista'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="text"
                    placeholder="CPF"
                    value={formData.cpf}
                    onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="CNH"
                    value={formData.cnh}
                    onChange={(e) => setFormData({...formData, cnh: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  {editingMotorista ? 'Atualizar' : 'Criar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {motoristas.map((motorista) => (
            <Card key={motorista.id} className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">{motorista.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">CPF</p>
                  <p className="text-sm font-medium text-gray-900">{motorista.cpf}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CNH</p>
                  <p className="text-sm font-medium text-gray-900">{motorista.cnh}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="text-sm font-medium text-gray-900">{motorista.telefone}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleEdit(motorista)}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-blue-600"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(motorista.id)}
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
