'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Stats {
  totalFretes: number
  fretesAtivos: number
  receita: number
  despesas: number
  lucro: number
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalFretes: 0,
    fretesAtivos: 0,
    receita: 0,
    despesas: 0,
    lucro: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Get total freights
        const { data: fretes, error: fretesError } = await supabase
          .from('fretes')
          .select('*')
          .eq('user_id', user.id)

        // Get active freights
        const { data: ativosData, error: ativosError } = await supabase
          .from('fretes')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'ativo')

        // Get expenses
        const { data: despesasData, error: despesasError } = await supabase
          .from('despesas')
          .select('valor')
          .eq('user_id', user.id)

        if (fretes && ativosData && despesasData) {
          const totalReceita = fretes.reduce((sum, frete) => sum + (frete.valor_frete || 0), 0)
          const totalDespesas = despesasData.reduce((sum, d) => sum + (d.valor || 0), 0)
          
          setStats({
            totalFretes: fretes.length,
            fretesAtivos: ativosData.length,
            receita: totalReceita,
            despesas: totalDespesas,
            lucro: totalReceita - totalDespesas,
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Carregando dados...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Total de Fretes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{stats.totalFretes}</p>
        </CardContent>
      </Card>

      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Fretes Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">{stats.fretesAtivos}</p>
        </CardContent>
      </Card>

      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Receita Total</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.receita)}</p>
        </CardContent>
      </Card>

      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.despesas)}</p>
        </CardContent>
      </Card>

      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Lucro Líquido</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${stats.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(stats.lucro)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
