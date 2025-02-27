import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import axios from 'axios'

export default function Charges() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [charges, setCharges] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCharges = async () => {
      try {
        const response = await axios.get('/api/charges')
        setCharges(response.data)
      } catch (error) {
        console.error('Error fetching charges:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCharges()
  }, [])

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  return (
    <>
      <Head>
        <title>المخالفات - نظام الشرطة</title>
      </Head>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">قائمة المخالفات</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500 dark:text-gray-400">جاري التحميل...</div>
          </div>
        ) : charges.length > 0 ? (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      المخالفة
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الوصف
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الغرامة
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      مدة السجن
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {charges.map((charge) => (
                    <tr key={charge.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {charge.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {charge.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        ${charge.fine}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {charge.jail_time} دقيقة
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
            لا توجد مخالفات متاحة.
          </div>
        )}
      </div>
    </>
  )
}