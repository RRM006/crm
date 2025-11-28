import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { customersAPI } from '../../services/api'
import toast from 'react-hot-toast'
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Target,
  UserCircle,
  CheckSquare,
  FileText,
  Activity,
  Pencil,
  Trash2
} from 'lucide-react'

const CustomerDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchCustomer()
  }, [id])

  const fetchCustomer = async () => {
    try {
      const response = await customersAPI.getOne(id)
      if (response.data.success) {
        setCustomer(response.data.data.customer)
      }
    } catch (error) {
      toast.error('Failed to fetch customer')
      navigate('/customers')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return
    try {
      await customersAPI.delete(id)
      toast.success('Customer deleted successfully')
      navigate('/customers')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete customer')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'badge-success',
      INACTIVE: 'badge-danger',
      PENDING: 'badge-warning',
      CHURNED: 'badge-danger'
    }
    return colors[status] || 'badge-info'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!customer) return null

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserCircle },
    { id: 'leads', label: `Leads (${customer.leads?.length || 0})`, icon: Target },
    { id: 'contacts', label: `Contacts (${customer.contacts?.length || 0})`, icon: UserCircle },
    { id: 'tasks', label: `Tasks (${customer.tasks?.length || 0})`, icon: CheckSquare },
    { id: 'notes', label: `Notes (${customer.customerNotes?.length || 0})`, icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/customers')}
        className="flex items-center gap-2 text-dark-500 hover:text-dark-700 dark:hover:text-dark-300"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Customers
      </button>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden"
      >
        <div className="relative h-32 bg-gradient-to-br from-primary-500 via-accent-500 to-primary-600" />
        
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-dark-800 border-4 border-white dark:border-dark-800 flex items-center justify-center text-3xl font-bold shadow-lg">
              {customer.avatar ? (
                <img src={customer.avatar} alt={customer.name} className="w-full h-full rounded-xl object-cover" />
              ) : (
                <span className="text-primary-500">{customer.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold">{customer.name}</h1>
                <span className={`badge ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </div>
              {customer.company && (
                <p className="text-dark-500 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  {customer.company}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary">
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-dark-200 dark:border-dark-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-xs text-dark-500">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-dark-500">Phone</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-dark-500">Total Spent</p>
                <p className="font-medium">${customer.totalSpent?.toLocaleString() || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-dark-500">Customer Since</p>
                <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Customer Overview</h2>
            {customer.notes && (
              <div>
                <h3 className="text-sm font-medium text-dark-500 mb-2">Notes</h3>
                <p className="text-dark-700 dark:text-dark-300">{customer.notes}</p>
              </div>
            )}
            {customer.address && (
              <div>
                <h3 className="text-sm font-medium text-dark-500 mb-2">Address</h3>
                <p className="text-dark-700 dark:text-dark-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {[customer.address, customer.city, customer.country].filter(Boolean).join(', ')}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Leads</h2>
              <Link to="/leads" className="text-sm text-primary-500">View All</Link>
            </div>
            {customer.leads?.length > 0 ? (
              <div className="divide-y divide-dark-100 dark:divide-dark-800">
                {customer.leads.map((lead) => (
                  <Link
                    key={lead.id}
                    to={`/leads/${lead.id}`}
                    className="flex items-center gap-4 py-4 hover:bg-dark-50 dark:hover:bg-dark-800 -mx-4 px-4"
                  >
                    <Target className="w-5 h-5 text-primary-500" />
                    <div className="flex-1">
                      <p className="font-medium">{lead.title}</p>
                      <p className="text-sm text-dark-500">${lead.value?.toLocaleString() || 0}</p>
                    </div>
                    <span className="badge badge-info">{lead.status}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-dark-500">No leads for this customer</p>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Contacts</h2>
            {customer.contacts?.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {customer.contacts.map((contact) => (
                  <div key={contact.id} className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800">
                    <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                    <p className="text-sm text-dark-500">{contact.email}</p>
                    {contact.jobTitle && (
                      <p className="text-sm text-dark-500">{contact.jobTitle}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-dark-500">No contacts for this customer</p>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Tasks</h2>
            {customer.tasks?.length > 0 ? (
              <div className="divide-y divide-dark-100 dark:divide-dark-800">
                {customer.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-4 py-4">
                    <CheckSquare className="w-5 h-5 text-amber-500" />
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      {task.dueDate && (
                        <p className="text-sm text-dark-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span className="badge badge-warning">{task.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-dark-500">No tasks for this customer</p>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Notes</h2>
            {customer.customerNotes?.length > 0 ? (
              <div className="space-y-4">
                {customer.customerNotes.map((note) => (
                  <div key={note.id} className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800">
                    <p className="text-dark-700 dark:text-dark-300">{note.content}</p>
                    <p className="text-xs text-dark-500 mt-2">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-dark-500">No notes for this customer</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default CustomerDetail

