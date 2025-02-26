import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <>
      <Head>
        <title>FiveM Police CAD System</title>
        <meta name="description" content="FiveM Police CAD System for QBCore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {session ? (
          <Dashboard />
        ) : (
          <div className="flex h-screen items-center justify-center">
            Redirecting to login...
          </div>
        )}
      </main>
    </>
  )
}