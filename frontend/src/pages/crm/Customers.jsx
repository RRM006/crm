import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { customersAPI } from '../../services/api'
import toast from 'react-hot-toast'
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Building,
  X,
  Loader2
} from 'lucide-react'

const Customers = () => {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'ACTIVE'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [pagination.page, searchQuery, statusFilter])

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        status: statusFilter
      })
      if (response.data.success) {
        setCustomers(response.data.data.customers)
        setPagination(prev => ({ ...prev, ...response.data.data.pagination }))
      }
    } catch (error) {
      toast.error('Failed to fetch customers')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingCustomer) {
        await customersAPI.update(editingCustomer.id, formData)
        toast.success('Customer updated successfully')
      } else {
        await customersAPI.create(formData)
        toast.success('Customer created successfully')
      }
      setShowModal(false)
      setEditingCustomer(null)
      setFormData({ name: '', email: '', phone: '', company: '', status: 'ACTIVE' })
      fetchCustomers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save customer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      company: customer.company || '',
      status: customer.status
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return
    try {
      await customersAPI.delete(id)
      toast.success('Customer deleted successfully')
      fetchCustomers()
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Customers</h1>
          <p className="text-dark-500">Manage your customer relationships</p>
        </div>
        <button
          onClick={() => {
            setEditingCustomer(null)
            setFormData({ name: '', email: '', phone: '', company: '', status: 'ACTIVE' })
            setShowModal(true)
          }}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers..."
              className="input pl-12"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-full sm:w-48"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
            <option value="CHURNED">Churned</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : customers.length > 0 ? (
          <>
            <div className="table-container border-0">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar avatar-sm">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            {customer.phone && (
                              <p className="text-xs text-dark-500">{customer.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-dark-500">{customer.email}</td>
                      <td className="text-dark-500">{customer.company || '-'}</td>
                      <td>
                        <span className={`badge ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="text-dark-500">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/customers/${customer.id}`)}
                            className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-dark-400" />
                          </button>
                          <button
                            onClick={() => handleEdit(customer)}
                            className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4 text-dark-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-dark-200 dark:border-dark-800">
                <p className="text-sm text-dark-500">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="btn btn-secondary"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="btn btn-secondary"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Users className="w-16 h-16 mx-auto mb-4 text-dark-300" />
            <h3 className="text-lg font-semibold mb-2">No customers found</h3>
            <p className="text-dark-500 mb-6">Get started by adding your first customer</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5" />
              Add Customer
            </button>
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-dark-900 rounded-2xl shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-dark-200 dark:border-dark-800">
                <h2 className="text-xl font-semibold">
                  {editingCustomer ? 'Edit Customer' : 'Add Customer'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="label">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="input"
                    placeholder="Customer name"
                  />
                </div>

                <div>
                  <label className="label">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="input"
                    placeholder="customer@example.com"
                  />
                </div>

                <div>
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="input"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="label">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="input"
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <label className="label">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="input"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING">Pending</option>
                    <option value="CHURNED">Churned</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : editingCustomer ? (
                      'Update Customer'
                    ) : (
                      'Add Customer'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Customers

