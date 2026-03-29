import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchUsers as fetchUsersApi, fetchUserStats as fetchUserStatsApi, updateUserStatus as updateUserStatusApi } from '../api/users'
import {
  Users,
  UserPlus,
  UserCheck,
  Clock,
  Search,
  ArrowRight,
  X,
  Mail,
  Shield,
  ShieldAlert,
  Calendar,
  Phone
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  user_type: 'donor' | 'receiver' | 'unassigned'
  role: string
  status: 'active' | 'inactive' | 'pending' | 'verified' | 'pending_profile' | 'pending_kyc'
  created_at: string
  last_login?: string
  total_donations?: number
  total_claims?: number
  phone?: string
  extra?: string
  fssai_number?: string
  gst_number?: string
}

interface UserStats {
  donors: {
    total: number
    active: number
    recent: number
  }
  receivers: {
    total: number
    active: number
    pending: number
    recent: number
  }
  ngos: {
    total: number
    active: number
    pending: number
  }
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'donor' | 'ngo_admin' | 'ngo_volunteer'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
    fetchUserStats()
  }, [filter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await fetchUsersApi(filter)
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      const data = await fetchUserStatsApi()
      setUserStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleUserAction = async (userId: string, action: string, reason?: string) => {
    try {
      await updateUserStatusApi(userId, action, reason)
      fetchUsers()
      fetchUserStats()
    } catch (error) {
      console.error('Error performing user action:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
      case 'verified':
        return {
          color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
          icon: <Shield className="w-3.5 h-3.5 mr-1.5" />
        }
      case 'inactive':
        return {
          color: 'text-rose-700 bg-rose-50 border-rose-100',
          icon: <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
        }
      case 'pending':
        return {
          color: 'text-amber-700 bg-amber-50 border-amber-100',
          icon: <Clock className="w-3.5 h-3.5 mr-1.5" />
        }
      default:
        return {
          color: 'text-slate-600 bg-slate-50 border-slate-100',
          icon: <Shield className="w-3.5 h-3.5 mr-1.5" />
        }
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-4 md:p-8 font-['Inter'] relative overflow-x-hidden transition-colors duration-300">
      <style>{`
        .dashboard-bg {
          position: fixed;
          inset: 0;
          background-image: linear-gradient(rgba(0, 0, 0, 0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 0, 0, 0.015) 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: -1;
        }

        .wire-card {
          position: relative;
          background: white;
          border-radius: 1.5rem;
          overflow: hidden;
          z-index: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .wire-card::before {
          content: '';
          position: absolute;
          inset: -150%;
          background-image: conic-gradient(transparent 0deg, transparent 160deg, #10b981 180deg, #06b6d4 200deg, transparent 220deg);
          animation: rotate-wire 4s linear infinite;
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -2;
        }

        .wire-card:hover::before { opacity: 1; }
        
        .wire-card::after {
          content: '';
          position: absolute;
          inset: 1px;
          background: white;
          border-radius: calc(1.5rem - 1px);
          z-index: -1;
        }

        .wire-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.15);
        }

        .card-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: -1;
        }
        .wire-card:hover .card-grid { opacity: 1; }

        @keyframes rotate-wire { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="dashboard-bg" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-8 relative">
        {/* Header with Title and Search/Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-10">
          <div className="space-y-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-2 text-emerald-600 font-bold tracking-widest text-xs uppercase"
            >
              <Users className="w-4 h-4" />
              <span>Identity Management System</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase flex items-baseline">
              <motion.span
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8 }}
              >
                Admin_
              </motion.span>
              <span className="relative inline-flex items-center text-emerald-500 ml-3">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.6, duration: 0.8, ease: "circOut" }}
                  className="absolute bottom-1 left-0 h-3 bg-emerald-100 -z-10"
                />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="relative z-10"
                >
                  Users
                </motion.span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-1 left-0 w-full h-[4px] bg-emerald-500 origin-left shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                />
              </span>
            </h1>
          </div>

          <div className="flex flex-col sm:row gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search database..."
                className="pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all w-full sm:w-64 font-medium shadow-sm"
              />
            </div>
            <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === 'all' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('donor')}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === 'donor' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                Donor
              </button>
              <button
                onClick={() => setFilter('ngo_admin')}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === 'ngo_admin' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                NGO Admin
              </button>
              <button
                onClick={() => setFilter('ngo_volunteer')}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === 'ngo_volunteer' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                NGO Volunteer
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {userStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="wire-card p-6">
              <div className="card-grid" />
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex items-center space-x-1 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  <UserPlus className="w-3 h-3" />
                  <span>+{userStats.donors.recent} new</span>
                </div>
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Donors</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{userStats.donors.total}</p>
            </div>

            <div className="wire-card p-6">
              <div className="card-grid" />
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Active Donors</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{userStats.donors.active}</p>
            </div>

            <div className="wire-card p-6">
              <div className="card-grid" />
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total NGOs</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{userStats.ngos.total}</p>
            </div>

            <div className="wire-card p-6">
              <div className="card-grid" />
              <div className="flex items-center justify-between mb-4">
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Pending NGOs</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{userStats.ngos.pending}</p>
            </div>
          </div>
        )}

        {/* Users Table Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden relative z-0">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <div className="relative">
                <div className="absolute inset-0 blur-lg bg-blue-500/20 rounded-full animate-pulse"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 relative z-10"></div>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">Syncing user database...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="px-6 py-4">User Identity</th>
                    <th className="px-6 py-4 text-left">Platform Role</th>
                    <th className="px-6 py-4 text-left">Org / Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center text-slate-400 font-medium">
                        No users found matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const status = getStatusInfo(user.status)
                      return (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-white shadow-inner">
                                {user.name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900 leading-none">{user.name}</p>
                                <p className="text-xs text-slate-500 mt-1 flex items-center">
                                  <Mail className="w-3 h-3 mr-1" /> {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider w-fit inline-flex items-center ${user.role?.toLowerCase().includes('ngo') ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                              {user.role || (user.user_type === 'donor' ? 'Donor' : 'User')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                                {user.user_type}
                              </span>
                              {user.extra && user.extra !== 'N/A' && (
                                <span className="text-[10px] font-medium text-slate-600 uppercase tracking-tight pl-1 font-bold">
                                  {user.extra}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center w-fit border ${status.color}`}>
                              {status.icon}
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-all font-bold flex items-center space-x-1"
                                title="View Details"
                              >
                                <span className="text-xs uppercase tracking-wider">Details</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modern Centered Modal - Glassmorphism */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedUser(null)}
          ></div>

          <div className="relative bg-white/95 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-200 slide-in-from-bottom-4">
            {/* Modal Header */}
            <div className="bg-slate-900 p-8 text-white relative">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-blue-500 flex items-center justify-center text-white text-4xl font-black shadow-xl mb-4 transform -rotate-3 hover:rotate-0 transition-transform cursor-default">
                  {selectedUser.name?.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{selectedUser.name}</h3>
                <div className="flex items-center mt-2 text-blue-200 text-sm">
                  <span className="uppercase tracking-widest font-bold text-[10px] px-2 py-0.5 bg-blue-400/30 rounded-md mr-2">{selectedUser.user_type}</span>
                  <span className="opacity-70">{selectedUser.email}</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8 mt-2">
                <div className="col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Organization / Type</span>
                      <p className="text-sm font-bold text-slate-900 uppercase">{(selectedUser.extra || 'Individual').replace('_', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Platform Role</span>
                      <p className="text-sm font-bold text-blue-600 uppercase">{selectedUser.user_type}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                    <div className="flex">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center border ${getStatusInfo(selectedUser.status).color}`}>
                        {getStatusInfo(selectedUser.status).icon}
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">FSSAI Number</span>
                    <div className="flex items-center text-slate-900 text-sm font-semibold">
                      {selectedUser.fssai_number || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Signed Up</span>
                    <div className="flex items-center text-slate-900 text-sm font-semibold">
                      <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                      {new Date(selectedUser.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-right">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone Number</span>
                    <div className="flex items-center justify-end text-slate-900 text-sm font-semibold">
                      <Phone className="w-4 h-4 mr-2 text-slate-400" />
                      {selectedUser.phone || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">GST Number</span>
                    <div className="flex items-center justify-end text-slate-900 text-sm font-semibold">
                      {selectedUser.gst_number || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total {selectedUser.user_type === 'donor' ? 'Donations' : 'Claims'}</span>
                    <p className="text-xl font-black text-slate-900">
                      {selectedUser.user_type === 'donor' ? selectedUser.total_donations || 0 : selectedUser.total_claims || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Administrative Actions */}
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider text-center mb-1">Administrator Controls</p>
                <div className="grid grid-cols-2 gap-3">
                  {selectedUser.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUserAction(selectedUser.id, 'active', 'Approved after verification')}
                        className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center"
                      >
                        <UserCheck className="w-4 h-4 mr-2" /> Approve
                      </button>
                      <button
                        onClick={() => handleUserAction(selectedUser.id, 'inactive', 'Rejected by moderator')}
                        className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all flex items-center justify-center"
                      >
                        <X className="w-4 h-4 mr-2" /> Reject
                      </button>
                    </>
                  )}
                  {['active', 'verified'].includes(selectedUser.status) && (
                    <button
                      onClick={() => handleUserAction(selectedUser.id, 'inactive', 'Manually deactivated')}
                      className="col-span-2 py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-sm font-bold rounded-xl transition-all flex items-center justify-center"
                    >
                      <ShieldAlert className="w-4 h-4 mr-2" /> Deactivate Account
                    </button>
                  )}
                  {selectedUser.status === 'inactive' && (
                    <button
                      onClick={() => handleUserAction(selectedUser.id, 'active', 'Reactivated by admin')}
                      className="col-span-2 py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 text-sm font-bold rounded-xl transition-all flex items-center justify-center"
                    >
                      <UserCheck className="w-4 h-4 mr-2" /> Reactivate Account
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
