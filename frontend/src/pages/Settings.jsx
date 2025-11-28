import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useCompany } from '../context/CompanyContext'
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Bell,
  Shield,
  Building2,
  Users,
  Trash2,
  LogOut
} from 'lucide-react'
import toast from 'react-hot-toast'

const Settings = () => {
  const { theme, toggleTheme } = useTheme()
  const { currentCompany, currentRole, leaveCompany } = useCompany()
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false
  })

  const handleLeaveCompany = async () => {
    if (!window.confirm(`Are you sure you want to leave ${currentCompany?.name}?`)) return
    const result = await leaveCompany(currentCompany?.id)
    if (!result.success) {
      toast.error(result.error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Settings</h1>
        <p className="text-dark-500">Manage your account and preferences</p>
      </div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dark Mode</p>
            <p className="text-sm text-dark-500">Toggle between light and dark themes</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              theme === 'dark' ? 'bg-primary-500' : 'bg-dark-300'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                theme === 'dark' ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-dark-500">Receive updates via email</p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                notifications.email ? 'bg-primary-500' : 'bg-dark-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  notifications.email ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-dark-500">Receive push notifications</p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                notifications.push ? 'bg-primary-500' : 'bg-dark-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  notifications.push ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Company Settings */}
      {currentCompany && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Company: {currentCompany.name}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-50 dark:bg-dark-800">
              <div>
                <p className="font-medium">Your Role</p>
                <p className="text-sm text-dark-500">{currentRole}</p>
              </div>
              <span className={`badge ${
                currentRole === 'ADMIN' ? 'badge-danger' :
                currentRole === 'STAFF' ? 'badge-primary' :
                'badge-success'
              }`}>
                {currentRole}
              </span>
            </div>

            {currentRole !== 'ADMIN' && (
              <button
                onClick={handleLeaveCompany}
                className="btn btn-danger w-full"
              >
                <LogOut className="w-5 h-5" />
                Leave Company
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security
        </h2>
        <div className="space-y-4">
          <button className="w-full text-left p-4 rounded-xl bg-dark-50 dark:bg-dark-800 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors">
            <p className="font-medium">Change Password</p>
            <p className="text-sm text-dark-500">Update your password regularly</p>
          </button>
          <button className="w-full text-left p-4 rounded-xl bg-dark-50 dark:bg-dark-800 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors">
            <p className="font-medium">Two-Factor Authentication</p>
            <p className="text-sm text-dark-500">Add an extra layer of security</p>
          </button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6 border-red-200 dark:border-red-900"
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-500">
          <Trash2 className="w-5 h-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-dark-500 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="btn btn-danger">
          Delete Account
        </button>
      </motion.div>
    </div>
  )
}

export default Settings

