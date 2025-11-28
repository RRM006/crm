import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useCompany } from '../../context/CompanyContext'
import { dashboardAPI } from '../../services/api'
import {
  Building2,
  Globe,
  Mail,
  Phone,
  CheckSquare,
  Activity,
  ExternalLink,
  Clock
} from 'lucide-react'

const CustomerDashboard = () => {
  const { user } = useAuth()
  const { currentCompany } = useCompany()
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardAPI.getCustomerDashboard()
        if (response.data.success) {
          setDashboardData(response.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const getPriorityColor = (priority) => {
    const colors = {
      URGENT: 'text-red-500 bg-red-100 dark:bg-red-900/30',
      HIGH: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
      MEDIUM: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
      LOW: 'text-green-500 bg-green-100 dark:bg-green-900/30'
    }
    return colors[priority] || colors.MEDIUM
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const company = dashboardData?.company

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl lg:text-3xl font-bold"
        >
          Welcome, {user?.name}! 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-dark-500 mt-1"
        >
          Here's your customer portal for {currentCompany?.name}.
        </motion.p>
      </div>

      {/* Company Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card overflow-hidden"
      >
        {/* Company Header */}
        <div className="relative h-32 bg-gradient-to-br from-primary-500 via-accent-500 to-primary-600">
          <div className="absolute inset-0 bg-black/10" />
        </div>
        
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-dark-800 border-4 border-white dark:border-dark-800 flex items-center justify-center shadow-lg">
              {company?.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full rounded-xl object-cover" />
              ) : (
                <Building2 className="w-12 h-12 text-primary-500" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{company?.name}</h2>
              <span className="badge badge-success mt-1">Customer</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-dark-200 dark:border-dark-800">
            {company?.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-dark-500 hover:text-primary-500 transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span className="truncate">{company.website.replace(/^https?:\/\//, '')}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {company?.email && (
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-3 text-dark-500 hover:text-primary-500 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="truncate">{company.email}</span>
              </a>
            )}
            {company?.phone && (
              <a
                href={`tel:${company.phone}`}
                className="flex items-center gap-3 text-dark-500 hover:text-primary-500 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>{company.phone}</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between p-6 border-b border-dark-200 dark:border-dark-800">
            <h2 className="text-lg font-semibold">My Tasks</h2>
            <Link to="/tasks" className="text-sm text-primary-500 hover:text-primary-600">
              View all
            </Link>
          </div>
          <div className="divide-y divide-dark-100 dark:divide-dark-800">
            {dashboardData?.myTasks?.length > 0 ? (
              dashboardData.myTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getPriorityColor(task.priority)}`}>
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-dark-500 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-dark-500">
                          <Clock className="w-3 h-3" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-dark-500">
                <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No tasks assigned to you</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between p-6 border-b border-dark-200 dark:border-dark-800">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Link to="/activities" className="text-sm text-primary-500 hover:text-primary-600">
              View all
            </Link>
          </div>
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {dashboardData?.recentActivities?.length > 0 ? (
              dashboardData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm">{activity.title}</p>
                    <p className="text-xs text-dark-500">
                      {activity.createdBy?.name} • {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-dark-500 py-8">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            to="/tasks"
            className="flex items-center gap-3 p-4 rounded-xl bg-dark-50 dark:bg-dark-800 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
          >
            <CheckSquare className="w-6 h-6 text-primary-500" />
            <span className="font-medium">My Tasks</span>
          </Link>
          <Link
            to="/notes"
            className="flex items-center gap-3 p-4 rounded-xl bg-dark-50 dark:bg-dark-800 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
          >
            <Activity className="w-6 h-6 text-accent-500" />
            <span className="font-medium">View Notes</span>
          </Link>
          <Link
            to="/activities"
            className="flex items-center gap-3 p-4 rounded-xl bg-dark-50 dark:bg-dark-800 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
          >
            <Clock className="w-6 h-6 text-green-500" />
            <span className="font-medium">Activity Feed</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default CustomerDashboard

