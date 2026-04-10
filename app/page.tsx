'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login by default
    // The middleware will handle auth redirects properly
    router.replace('/auth/login')
  }, [router])

  return null
}
