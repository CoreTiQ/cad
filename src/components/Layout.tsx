import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {session && <Navbar />}
      <div className="flex">
        {session && <Sidebar />}
        <main className={`flex-1 p-4 ${session ? 'mr-64' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
