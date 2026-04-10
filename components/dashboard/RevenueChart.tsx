'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface ChartData {
  date: string
  receita: number
  despesas: number
  lucro: number
}

export default function RevenueChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      const supabase = createClient()

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Get last 30 days of data
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data: fretes } = await supabase
          .from('fretes')
          .select('data_coleta, valor_frete')
          .eq('user_id', user.id)
          .gte('data_coleta', thirtyDaysAgo.toISOString())

        const { data: despesas } = await supabase
          .from('despesas')
          .select('data, valor')
          .eq('user_id', user.id)
          .gte('data', thirtyDaysAgo.toISOString())

        // Group by date
        const chartDataMap = new Map<string, { receita: number; despesas: number }>()

        fretes?.forEach((frete) => {
          const date = new Date(frete.data_coleta).toLocaleDateString('pt-BR')
          const current = chartDataMap.get(date) || { receita: 0, despesas: 0 }
          current.receita += frete.valor_frete || 0
          chartDataMap.set(date, current)
        })

        despesas?.forEach((despesa) => {
          const date = new Date(despesa.data).toLocaleDateString('pt-BR')
          const current = chartDataMap.get(date) || { receita: 0, despesas: 0 }
          current.despesas += despesa.valor || 0
          chartDataMap.set(date, current)
        })

        const chartData: ChartData[] = Array.from(chartDataMap.entries())
          .map(([date, values]) => ({
            date,
            receita: values.receita,
            despesas: values.despesas,
            lucro: values.receita - values.despesas,
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setData(chartData)
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Carregando gráficos...</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Receita vs Despesas (Últimos 30 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Legend />
              <Bar dataKey="receita" fill="#10b981" name="Receita" />
              <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Lucro Acumulado</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Legend />
              <Line type="monotone" dataKey="lucro" stroke="#3b82f6" strokeWidth={2} name="Lucro" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
