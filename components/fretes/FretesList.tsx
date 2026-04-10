'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Frete {
  id: string
  data_coleta: string
  origem: string
  destino: string
  valor_frete: number
  status: string
}

interface FretesListProps {
  fretes: Frete[]
  onEdit: (frete: Frete) => void
  onDelete: (id: string) => void
}

export default function FretesList({ fretes, onEdit, onDelete }: FretesListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-blue-100 text-blue-800'
      case 'entregue':
        return 'bg-green-100 text-green-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (fretes.length === 0) {
    return (
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="pt-8">
          <div className="text-center text-gray-500">
            <p>Nenhum frete cadastrado ainda.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Data</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rota</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Valor</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {fretes.map((frete) => (
            <tr key={frete.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">
                {formatDate(frete.data_coleta)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {frete.origem} → {frete.destino}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {formatCurrency(frete.valor_frete)}
              </td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(frete.status)}`}>
                  {frete.status.charAt(0).toUpperCase() + frete.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm space-x-2">
                <Button
                  onClick={() => onEdit(frete)}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Editar
                </Button>
                <Button
                  onClick={() => {
                    if (window.confirm('Tem certeza que deseja deletar este frete?')) {
                      onDelete(frete.id)
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Deletar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
