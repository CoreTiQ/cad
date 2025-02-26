import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import {
  ClipboardDocumentListIcon,
  UserIcon,
  DocumentTextIcon,
  TruckIcon,
  MagnifyingGlassIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline'

export default function Sidebar() {
  const router = useRouter()
  const { data: session } = useSession()
  
  const isActive = (path: string) => {
    return router.pathname === path
  }

  const navigationItems = [
    { name: 'لوحة التحكم', href: '/', icon: ClipboardDocumentListIcon },
    { name: 'البحث عن مواطن', href: '/citizens', icon: UserIcon },
    { name: 'البلاغات', href: '/reports', icon: DocumentTextIcon },
    { name: 'أوامر القبض', href: '/warrants', icon: ClipboardDocumentCheckIcon },
    { name: 'البحث عن مركبة', href: '/vehicles', icon: TruckIcon },
    { name: 'المخالفات', href: '/charges', icon: DocumentDuplicateIcon }
  ]

  return (
    <div className="h-screen w-64 fixed right-0 bg-white dark:bg-gray-800 shadow-md">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          قائمة التنقل
        </h2>
      </div>
      <nav className="mt-5 px-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="ml-3 h-6 w-6 flex-shrink-0" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}