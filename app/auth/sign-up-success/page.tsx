'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-blue-900">TransportLog</h1>
            <p className="text-sm text-gray-600 mt-1">Gestão Inteligente de Fretes</p>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-2xl text-center text-green-700">Conta Criada com Sucesso!</CardTitle>
              <CardDescription className="text-center">
                Verifique seu email para confirmar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600 text-center">
                  Enviamos um email de confirmação. Clique no link no email para ativar sua conta e começar a usar o TransportLog.
                </p>
                <Link href="/auth/login" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Ir para Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
