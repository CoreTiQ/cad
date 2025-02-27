import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import axios from 'axios'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'

type SearchFormData = {
  query: string
}

// Definir el tipo para los ciudadanos
type CitizenType = {
  id: string;
  citizenid: string;
  firstname: string;
  lastname: string;
  job: string;
  grade: number;
}

export default function Citizens() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchResults, setSearchResults] = useState<CitizenType[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormData>()

  const onSubmit = async (data: SearchFormData) => {
    if (!data.query.trim()) return
    
    setIsSearching(true)
    
    try {
      const response = await axios.get(`/api/users/search?query=${encodeURIComponent(data.query)}`)
      setSearchResults(response.data)
    } catch (error) {
      console.error('Error searching citizens:', error)
    } finally {
      setIsSearching(false)
    }
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  return (
    <>
      <Head>
        <title>البحث عن مواطن - نظام الشرطة</title>
      </Head>
      <div className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">البحث عن مواطن</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex">
                <div className="relative flex-grow">
                  <input
                    {...register('query', { required: 'الرجاء إدخال معلومات البحث' })}
                    type="text"
                    className="input"
                    placeholder="ابحث برقم الهوية أو الاسم الأول أو الاسم الأخير"
                  />
                  {errors.query && (
                    <p className="mt-2 text-sm text-red-600">{errors.query.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="mr-2 btn btn-primary"
                >
                  {isSearching ? (
                    'جاري البحث...'
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="h-4 w-4 ml-2" />
                      بحث
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">نتائج البحث</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      رقم الهوية
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الاسم
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الوظيفة
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {searchResults.map((citizen) => (
                    <tr key={citizen.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {citizen.citizenid}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {citizen.firstname} {citizen.lastname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {citizen.job} (الرتبة: {citizen.grade})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <button
                          onClick={() => router.push(`/citizens/${citizen.citizenid}`)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        >
                          عرض التفاصيل
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {searchResults.length === 0 && isSearching === false && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
            قم بإجراء البحث للعثور على المواطنين
          </div>
        )}
      </div>
    </>
  )
}