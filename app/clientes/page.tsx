'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Navigation from '@/components/Navigation'

interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  endereco: string
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
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
      fetchClientes()
    }
  }

  const fetchClientes = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('clientes')
      .select('*')
      .eq('user_id', user.id)
      .order('nome')

    if (data) {
      setClientes(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (editingCliente) {
      const { error } = await supabase
        .from('clientes')
        .update(formData)
        .eq('id', editingCliente.id)
      if (!error) {
        setEditingCliente(null)
        setShowForm(false)
        setFormData({ nome: '', email: '', telefone: '', endereco: '' })
        fetchClientes()
      }
    } else {
      const { error } = await supabase
        .from('clientes')
        .insert([{ ...formData, user_id: user.id }])
      if (!error) {
        setShowForm(false)
        setFormData({ nome: '', email: '', telefone: '', endereco: '' })
        fetchClientes()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)
      if (!error) {
        fetchClientes()
      }
    }
  }

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Clientes</h1>
            <p className="text-gray-600">Gerencie seus clientes e suas informações de contato.</p>
          </div>
          <Button 
            onClick={() => {
              setEditingCliente(null)
              setFormData({ nome: '', email: '', telefone: '', endereco: '' })
              setShowForm(!showForm)
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {showForm ? 'Cancelar' : '+ Novo Cliente'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle>{editingCliente ? 'Editar Cliente' : 'Novo Cliente'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                <input
                  type="text"
                  placeholder="Endereço"
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  {editingCliente ? 'Atualizar' : 'Criar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientes.map((cliente) => (
            <Card key={cliente.id} className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">{cliente.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{cliente.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="text-sm font-medium text-gray-900">{cliente.telefone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Endereço</p>
                  <p className="text-sm font-medium text-gray-900">{cliente.endereco}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleEdit(cliente)}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-blue-600"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(cliente.id)}
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
