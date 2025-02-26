import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type FormData = {
  citizenid: string
  password: string
}

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    
    const result = await signIn('credentials', {
      redirect: false,
      citizenid: data.citizenid,
      password: data.password
    })

    if (result?.error) {
      toast.error('بيانات الدخول غير صحيحة')
      setIsLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <>
      <Head>
        <title>تسجيل الدخول - نظام الشرطة</title>
      </Head>
      <div className="flex min-h-screen flex-col justify-center bg-gray-100 dark:bg-gray-900 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mx-auto w-24 h-24 relative mb-4">
            <Image src="/police-badge.png" alt="Police Badge" fill className="object-contain" />
          </div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            نظام الشرطة - FiveM CAD
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="card">
            <form className="space-y-6 card-body" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="citizenid" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  رقم الهوية
                </label>
                <div className="mt-1">
                  <input
                    {...register('citizenid', { required: 'رقم الهوية مطلوب' })}
                    id="citizenid"
                    name="citizenid"
                    type="text"
                    autoComplete="off"
                    className="input"
                  />
                  {errors.citizenid && (
                    <p className="mt-2 text-sm text-red-600">{errors.citizenid.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  كلمة المرور
                </label>
                <div className="mt-1">
                  <input
                    {...register('password', { required: 'كلمة المرور مطلوبة' })}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="input"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full"
                >
                  {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
