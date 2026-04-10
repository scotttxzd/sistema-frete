'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Navigation from '@/components/Navigation'
import FreteForm from '@/components/fretes/FreteForm'
import FretesList from '@/components/fretes/FretesList'

export default function FretesPage() {
  const [fretes, setFretes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingFrete, setEditingFrete] = useState<any>(null)
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
      fetchFretes()
    }
  }

  const fetchFretes = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('fretes')
      .select('*')
      .eq('user_id', user.id)
      .order('data_coleta', { ascending: false })

    if (data) {
      setFretes(data)
    }
    setLoading(false)
  }

  const handleAddFrete = async (frete: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('fretes')
      .insert([{ ...frete, user_id: user.id }])

    if (!error) {
      setShowForm(false)
      fetchFretes()
    }
  }

  const handleUpdateFrete = async (id: string, frete: any) => {
    const { error } = await supabase
      .from('fretes')
      .update(frete)
      .eq('id', id)

    if (!error) {
      setEditingFrete(null)
      fetchFretes()
    }
  }

  const handleDeleteFrete = async (id: string) => {
    const { error } = await supabase
      .from('fretes')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchFretes()
    }
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gerenciar Fretes</h1>
            <p className="text-gray-600">Adicione, edite ou remova fretes.</p>
          </div>
          <Button 
            onClick={() => {
              setEditingFrete(null)
              setShowForm(!showForm)
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {showForm ? 'Cancelar' : '+ Novo Frete'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle>{editingFrete ? 'Editar Frete' : 'Novo Frete'}</CardTitle>
            </CardHeader>
            <CardContent>
              <FreteForm 
                onSubmit={editingFrete ? 
                  (frete) => handleUpdateFrete(editingFrete.id, frete) : 
                  handleAddFrete
                }
                initialData={editingFrete}
              />
            </CardContent>
          </Card>
        )}

        <FretesList 
          fretes={fretes}
          onEdit={(frete) => {
            setEditingFrete(frete)
            setShowForm(true)
          }}
          onDelete={handleDeleteFrete}
        />
      </main>
    </div>
  )
}
