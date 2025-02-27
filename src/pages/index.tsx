// import { useState, useEffect } from 'react'
// import { useSession } from 'next-auth/react'
// import { useRouter } from 'next/router'
// import Head from 'next/head'
// import Link from 'next/link'
// import axios from 'axios'
// import { PlusIcon } from '@heroicons/react/24/outline'

// // Define el tipo para las órdenes de arresto
// type WarrantType = {
//   id: number;
//   reason: string;
//   description: string;
//   subject: {
//     firstname: string;
//     lastname: string;
//   };
//   officer: {
//     firstname: string;
//     lastname: string;
//   };
//   created_at: string;
//   expires_at: string | null;
//   status: string;
// };

// export default function Warrants() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
//   const [warrants, setWarrants] = useState<WarrantType[]>([])
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const fetchWarrants = async () => {
//       try {
//         const response = await axios.get('/api/warrants')
//         setWarrants(response.data)
//       } catch (error) {
//         console.error('Error fetching warrants:', error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchWarrants()
//   }, [])

//   if (status === 'unauthenticated') {
//     router.push('/login')
//     return null
//   }

//   return (
//     <>
//       <Head>
//         <title>أوامر القبض - نظام الشرطة</title>
//       </Head>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">أوامر القبض</h1>
//           <Link href="/warrants/new" className="btn btn-primary">
//             <PlusIcon className="h-5 w-5 ml-2" />
//             إضافة أمر قبض جديد
//           </Link>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="text-gray-500 dark:text-gray-400">جاري التحميل...</div>
//           </div>
//         ) : warrants.length > 0 ? (
//           <div className="card">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                 <thead className="bg-gray-50 dark:bg-gray-700">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       السبب
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       المتهم
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       الضابط
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       تاريخ الإصدار
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       تاريخ الانتهاء
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       الحالة
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       الإجراءات
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                   {warrants.map((warrant) => (
//                     <tr key={warrant.id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
//                         {warrant.reason}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                         {warrant.subject.firstname} {warrant.subject.lastname}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                         {warrant.officer.firstname} {warrant.officer.lastname}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                         {new Date(warrant.created_at).toLocaleDateString('ar-SA')}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                         {warrant.expires_at ? new Date(warrant.expires_at).toLocaleDateString('ar-SA') : 'غير محدد'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           warrant.status === 'active' 
//                             ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
//                             : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
//                         }`}>
//                           {warrant.status === 'active' ? 'نشط' : 'منتهي'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                         <Link href={`/warrants/${warrant.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
//                           عرض التفاصيل
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
//             لا توجد أوامر قبض متاحة. قم بإنشاء أمر قبض جديد.
//           </div>
//         )}
//       </div>
//     </>
//   )
// }