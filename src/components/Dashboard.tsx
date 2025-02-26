import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import {
  UserIcon,
  DocumentTextIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline'

type StatsType = {
  totalReports: number
  totalWarrants: number
  totalCitizens: number
  totalVehicles: number
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<StatsType>({
    totalReports: 0,
    totalWarrants: 0,
    totalCitizens: 0,
    totalVehicles: 0
  })
  const [recentReports, setRecentReports] = useState([])
  const [activeWarrants, setActiveWarrants] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [reportsRes, warrantsRes, statsRes] = await Promise.all([
          axios.get('/api/reports?limit=5'),
          axios.get('/api/warrants?status=active&limit=5'),
          axios.get('/api/stats')
        ])

        setRecentReports(reportsRes.data)
        setActiveWarrants(warrantsRes.data)
        setStats(statsRes.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 dark:text-gray-400">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        مرحباً، {session?.user?.name || 'الضابط'}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="البلاغات"
          value={stats.totalReports}
          icon={<DocumentTextIcon className="h-6 w-6 text-blue-500" />}
          bgColor="bg-blue-50 dark:bg-blue-900/30"
          textColor="text-blue-600 dark:text-blue-300"
        />
        <StatCard 
          title="أوامر القبض"
          value={stats.totalWarrants}
          icon={<ClipboardDocumentCheckIcon className="h-6 w-6 text-red-500" />}
          bgColor="bg-red-50 dark:bg-red-900/30"
          textColor="text-red-600 dark:text-red-300"
        />
        <StatCard 
          title="المواطنين"
          value={stats.totalCitizens}
          icon={<UserIcon className="h-6 w-6 text-green-500" />}
          bgColor="bg-green-50 dark:bg-green-900/30"
          textColor="text-green-600 dark:text-green-300"
        />
        <StatCard 
          title="المركبات"
          value={stats.totalVehicles}
          icon={<TruckIcon className="h-6 w-6 text-purple-500" />}
          bgColor="bg-purple-50 dark:bg-purple-900/30"
          textColor="text-purple-600 dark:text-purple-300"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentReportsCard reports={recentReports} />
        <ActiveWarrantsCard warrants={activeWarrants} />
      </div>
    </div>
  )
}

type StatCardProps = {
  title: string
  value: number
  icon: JSX.Element
  bgColor: string
  textColor: string
}

function StatCard({ title, value, icon, bgColor, textColor }: StatCardProps) {
  return (
    <div className={`rounded-lg p-5 ${bgColor}`}>
      <div className="flex justify-between">
        <div>
          <div className={`text-sm font-medium ${textColor}`}>{title}</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
            {value}
          </div>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  )
}

function RecentReportsCard({ reports }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">أحدث البلاغات</h3>
      </div>
      <div className="card-body">
        {reports.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {reports.map((report) => (
              <li key={report.id} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{report.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      المتهم: {report.subject.firstname} {report.subject.lastname}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(report.created_at).toLocaleDateString('ar-SA')}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            لا توجد بلاغات حديثة
          </div>
        )}
      </div>
    </div>
  )
}

function ActiveWarrantsCard({ warrants }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">أوامر القبض النشطة</h3>
      </div>
      <div className="card-body">
        {warrants.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {warrants.map((warrant) => (
              <li key={warrant.id} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{warrant.reason}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      المتهم: {warrant.subject.firstname} {warrant.subject.lastname}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(warrant.created_at).toLocaleDateString('ar-SA')}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            لا توجد أوامر قبض نشطة
          </div>
        )}
      </div>
    </div>
  )
}