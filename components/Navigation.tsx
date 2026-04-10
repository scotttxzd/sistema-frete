'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Check if dark mode is set
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      setIsDark(false)
    } else {
      html.classList.add('dark')
      setIsDark(true)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary">Ramalho Transportes</h1>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/dashboard">
              <Button 
                variant={isActive('/dashboard') ? 'default' : 'ghost'}
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/fretes">
              <Button 
                variant={isActive('/fretes') ? 'default' : 'ghost'}
              >
                Fretes
              </Button>
            </Link>
            <Link href="/motoristas">
              <Button 
                variant={isActive('/motoristas') ? 'default' : 'ghost'}
              >
                Motoristas
              </Button>
            </Link>
            <Link href="/veiculos">
              <Button 
                variant={isActive('/veiculos') ? 'default' : 'ghost'}
              >
                Veículos
              </Button>
            </Link>
            <Link href="/clientes">
              <Button 
                variant={isActive('/clientes') ? 'default' : 'ghost'}
              >
                Clientes
              </Button>
            </Link>
            <Link href="/despesas">
              <Button 
                variant={isActive('/despesas') ? 'default' : 'ghost'}
              >
                Despesas
              </Button>
            </Link>
            <Link href="/relatorios">
              <Button 
                variant={isActive('/relatorios') ? 'default' : 'ghost'}
              >
                Relatórios
              </Button>
            </Link>
            <Button 
              onClick={toggleDarkMode}
              variant="ghost"
              size="icon"
              className="ml-2"
              title={isDark ? 'Modo claro' : 'Modo escuro'}
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM5 8a1 1 0 100-2H4a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="ml-2"
            >
              Sair
            </Button>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-foreground hover:text-primary"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {showMenu && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            <Link href="/dashboard" className="block">
              <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
            </Link>
            <Link href="/fretes" className="block">
              <Button variant="ghost" className="w-full justify-start">Fretes</Button>
            </Link>
            <Link href="/motoristas" className="block">
              <Button variant="ghost" className="w-full justify-start">Motoristas</Button>
            </Link>
            <Link href="/veiculos" className="block">
              <Button variant="ghost" className="w-full justify-start">Veículos</Button>
            </Link>
            <Link href="/clientes" className="block">
              <Button variant="ghost" className="w-full justify-start">Clientes</Button>
            </Link>
            <Link href="/despesas" className="block">
              <Button variant="ghost" className="w-full justify-start">Despesas</Button>
            </Link>
            <Link href="/relatorios" className="block">
              <Button variant="ghost" className="w-full justify-start">Relatórios</Button>
            </Link>
            <Button 
              onClick={toggleDarkMode}
              variant="ghost"
              className="w-full justify-start"
            >
              {isDark ? '☀️ Modo claro' : '🌙 Modo escuro'}
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full"
            >
              Sair
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
