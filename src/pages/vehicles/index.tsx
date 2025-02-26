import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import axios from 'axios'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'

type SearchFormData = {
  plate: string
}

export default function Vehicles() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [vehicleData, setVehicleData] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormData>()

  const onSubmit = async (data: SearchFormData) => {
    if (!data.plate.trim()) return
    
    setIsSearching(true)
    setError('')
    
    try {
      const response = await axios.get(`/api/vehicles/search?plate=${encodeURIComponent(data.plate)}`)
      setVehicleData(response.data)
    } catch (error) {
      console.error('Error searching vehicle:', error)
      if (error.response?.status === 404) {
        setError('لم يتم العثور على مركبة بهذا الرقم')
      } else {
        setError('حدث خطأ أثناء البحث')
      }
      setVehicleData(null)
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
        <title>البحث عن مركبة - نظام الشرطة</title>
      </Head>
      <div className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">البحث عن مركبة</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex">
                <div className="relative flex-grow">
                  <input
                    {...register('plate', { required: 'الرجاء إدخال رقم اللوحة' })}
                    type="text"
                    className="input"
                    placeholder="أدخل رقم لوحة المركبة"
                  />
                  {errors.plate && (
                    <p className="mt-2 text-sm text-red-600">{errors.plate.message}</p>
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

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {vehicleData && (
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">معلومات المركبة</h3>
              </div>
              <div className="card-body">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">الحالة</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {vehicleData.vehicle.state === 0 ? 'في المرآب' : vehicleData.vehicle.state === 1 ? 'خارج المرآب' : 'غير معروف'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">الوقود</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{vehicleData.vehicle.fuel}%</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">حالة المحرك</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{vehicleData.vehicle.engine / 10}%</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">حالة الهيكل</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{vehicleData.vehicle.body / 10}%</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">معلومات المالك</h3>
              </div>
              <div className="card-body">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">رقم الهوية</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{vehicleData.owner.citizenid}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">الاسم الكامل</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{vehicleData.owner.firstname} {vehicleData.owner.lastname}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {!vehicleData && !error && !isSearching && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
            قم بإدخال رقم لوحة للبحث عن مركبة
          </div>
        )}
      </div>
    </>
  )
}