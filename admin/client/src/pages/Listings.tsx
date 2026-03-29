import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchListings, updateListingStatus } from '../api/listings'
import { Search, Ban, CheckCircle, Clock, X, Utensils, Globe } from 'lucide-react'

export default function Listings() {
    const [listings, setListings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [lightboxImg, setLightboxImg] = useState<string | null>(null)

    useEffect(() => {
        loadListings()
    }, [])

    const loadListings = async () => {
        try {
            const { data } = await fetchListings()
            setListings(data || [])
        } catch (error) {
            console.error('Failed to load listings', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (id: string, status: string) => {
        if (!window.confirm(`Change listing status to ${status}?`)) return

        try {
            await updateListingStatus(id, status)
            await loadListings()
        } catch (error) {
            console.error('Failed to update status', error)
            alert('Error updating status')
        }
    }

    const filteredListings = listings.filter(l => {
        const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.donors?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = statusFilter === 'all' || l.status === statusFilter
        return matchesSearch && matchesFilter
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'available': return <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider border border-emerald-100 flex items-center shadow-sm"><CheckCircle className="w-3 h-3 mr-1.5" /> Available</span>
            case 'claimed': return <span className="bg-blue-50 text-blue-700 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider border border-blue-100 flex items-center shadow-sm"><CheckCircle className="w-3 h-3 mr-1.5" /> Claimed</span>
            case 'expired': return <span className="bg-amber-50 text-amber-700 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider border border-amber-100 flex items-center shadow-sm"><Clock className="w-3 h-3 mr-1.5" /> Expired</span>
            case 'cancelled': return <span className="bg-rose-50 text-rose-700 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider border border-rose-100 flex items-center shadow-sm"><Ban className="w-3 h-3 mr-1.5" /> Cancelled</span>
            default: return <span className="bg-slate-50 text-slate-700 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider border border-slate-100 shadow-sm">{status}</span>
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfcfd]">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-emerald-500 font-black tracking-[0.3em] animate-pulse uppercase text-xs">Scanning_Resources...</p>
            </div>
        )
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-10">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center space-x-2 text-emerald-600 font-bold tracking-widest text-xs uppercase"
                        >
                            <Utensils className="w-4 h-4" />
                            <span>Resource Allocation System</span>
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
                                    Listings
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
                                placeholder="Search resources..."
                                className="pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all w-full sm:w-64 font-medium shadow-sm"
                            />
                        </div>
                        <select
                            className="border border-slate-200 rounded-2xl py-3 px-6 text-[10px] font-black uppercase tracking-widest bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer shadow-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Global_Status</option>
                            <option value="available">Available_</option>
                            <option value="claimed">Claimed_</option>
                            <option value="expired">Expired_</option>
                            <option value="cancelled">Cancelled_</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden relative z-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                    <th className="px-6 py-5">Item Identifier</th>
                                    <th className="px-6 py-5 text-left">Donor Entity</th>
                                    <th className="px-6 py-5 text-left">Quantity_Metrics</th>
                                    <th className="px-6 py-5">System_Status</th>
                                    <th className="px-6 py-5 text-right">Administrative_Ops</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredListings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-black uppercase tracking-[0.2em] text-xs">
                                            No_Active_Resources_Detected
                                        </td>
                                    </tr>
                                ) : (
                                    filteredListings.map((listing, idx) => (
                                        <motion.tr
                                            key={listing.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center space-x-4">
                                                    {listing.images && listing.images.length > 0 ? (
                                                        <div className="relative group/img overflow-hidden rounded-2xl border-2 border-white shadow-md">
                                                            <img
                                                                src={listing.images[0]}
                                                                alt={listing.title}
                                                                className="w-16 h-16 object-cover cursor-pointer group-hover/img:scale-110 transition-transform duration-500"
                                                                onClick={() => setLightboxImg(listing.images[0])}
                                                            />
                                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                                <Globe className="w-5 h-5 text-white animate-pulse" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl border border-slate-100 shadow-inner group-hover:scale-105 transition-transform">
                                                            🍱
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tight">{listing.title}</p>
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-[200px] font-medium">{listing.description}</p>
                                                        <p className="text-[9px] font-black text-emerald-500/60 mt-1 uppercase tracking-widest leading-none">ID: {listing.id.substring(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-black text-slate-700 uppercase tracking-tighter leading-none">{listing.donors?.full_name}</p>
                                                    <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{listing.donors?.user_type || 'DONOR_'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm">
                                                    {listing.quantity} {listing.quantity_unit}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                {getStatusBadge(listing.status)}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                {listing.status === 'available' ? (
                                                    <button
                                                        onClick={() => handleStatusUpdate(listing.id, 'cancelled')}
                                                        className="bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-end ml-auto border border-rose-100 hover:border-rose-500 active:scale-95"
                                                    >
                                                        <Ban className="w-3.5 h-3.5 mr-2" /> Protocol_Void
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Read_Only</span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
                        onClick={() => setLightboxImg(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative max-w-4xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setLightboxImg(null)}
                                className="absolute -top-14 right-0 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20 shadow-2xl group"
                            >
                                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                <img
                                    src={lightboxImg}
                                    alt="Food preview"
                                    className="w-full max-h-[80vh] object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white font-black uppercase tracking-[0.3em] text-xs">Resource_Visual_Verification</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
