'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Navigation from '@/components/Navigation'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Relatorio {
  totalFretes: number
  fretesEntregues: number
  fretesAtivos: number
  fretesCancelados: number
  receitaTotal: number
  despesasTotal: number
  lucroTotal: number
  ticketMedio: number
  statusData: any[]
  motoristasData: any[]
}

export default function RelatoriosPage() {
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null)
  const [loading, setLoading] = useState(true)
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
      fetchRelatorio()
    }
  }

  const fetchRelatorio = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      // Get all freights
      const { data: fretes } = await supabase
        .from('fretes')
        .select('*')
        .eq('user_id', user.id)

      // Get all expenses
      const { data: despesas } = await supabase
        .from('despesas')
        .select('*')
        .eq('user_id', user.id)

      // Get drivers info
      const { data: motoristas } = await supabase
        .from('motoristas')
        .select('id, nome')
        .eq('user_id', user.id)

      if (fretes && despesas && motoristas) {
        const receitaTotal = fretes.reduce((sum, f) => sum + (f.valor_frete || 0), 0)
        const despesasTotal = despesas.reduce((sum, d) => sum + (d.valor || 0), 0)
        
        const statusCounts = {
          ativo: fretes.filter(f => f.status === 'ativo').length,
          entregue: fretes.filter(f => f.status === 'entregue').length,
          cancelado: fretes.filter(f => f.status === 'cancelado').length,
        }

        const statusData = [
          { name: 'Ativos', value: statusCounts.ativo, fill: '#3b82f6' },
          { name: 'Entregues', value: statusCounts.entregue, fill: '#10b981' },
          { name: 'Cancelados', value: statusCounts.cancelado, fill: '#ef4444' },
        ]

        const motoristasData = motoristas.map(m => ({
          nome: m.nome.split(' ')[0],
          fretes: fretes.filter(f => f.motorista_id === m.id).length,
          receita: fretes
            .filter(f => f.motorista_id === m.id)
            .reduce((sum, f) => sum + (f.valor_frete || 0), 0),
        }))

        setRelatorio({
          totalFretes: fretes.length,
          fretesEntregues: statusCounts.entregue,
          fretesAtivos: statusCounts.ativo,
          fretesCancelados: statusCounts.cancelado,
          receitaTotal,
          despesasTotal,
          lucroTotal: receitaTotal - despesasTotal,
          ticketMedio: fretes.length > 0 ? receitaTotal / fretes.length : 0,
          statusData,
          motoristasData,
        })
      }
    } catch (error) {
      console.error('Error fetching relatorio:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (loading || !relatorio) {
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Relatórios</h1>
          <p className="text-gray-600">Análise detalhada do desempenho da sua transportadora.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Receita Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(relatorio.receitaTotal)}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Despesas Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(relatorio.despesasTotal)}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Lucro Líquido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${relatorio.lucroTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(relatorio.lucroTotal)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Ticket Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(relatorio.ticketMedio)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Status dos Fretes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ativos: {relatorio.fretesAtivos}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(relatorio.fretesAtivos / relatorio.totalFretes) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Entregues: {relatorio.fretesEntregues}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(relatorio.fretesEntregues / relatorio.totalFretes) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cancelados: {relatorio.fretesCancelados}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${(relatorio.fretesCancelados / relatorio.totalFretes) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Distribuição por Status</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={relatorio.statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {relatorio.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Motoristas Chart */}
        {relatorio.motoristasData.length > 0 && (
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Desempenho por Motorista</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={relatorio.motoristasData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="nome" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value) => {
                    if (typeof value === 'number' && value > 1000) {
                      return `R$ ${value.toLocaleString('pt-BR')}`
                    }
                    return value
                  }} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="fretes" fill="#3b82f6" name="Fretes" />
                  <Bar yAxisId="right" dataKey="receita" fill="#10b981" name="Receita" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
