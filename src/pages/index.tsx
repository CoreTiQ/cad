import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Dashboard from '../components/Dashboard'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center">جاري التحميل...</div>
  }

  return (
    <>
      <Head>
        <title>نظام الشرطة - FiveM CAD</title>
        <meta name="description" content="نظام إدارة الشرطة لسيرفرات FiveM" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {session ? (
          <Dashboard />
        ) : (
          <div className="flex h-screen items-center justify-center">
            جاري التوجيه إلى صفحة تسجيل الدخول...
          </div>
        )}
      </main>
    </>
  )
}