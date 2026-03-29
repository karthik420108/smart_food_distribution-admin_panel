import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchPendingKyc, reviewKyc } from '../api/kyc'
import { FileText, User as UserIcon, ShieldCheck } from 'lucide-react'

export default function KycReviews() {
    const [kycRequests, setKycRequests] = useState<{ donors: any[], receivers: any[] }>({ donors: [], receivers: [] })
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'donors' | 'receivers'>('donors')

    useEffect(() => {
        loadKyc()
    }, [])

    const loadKyc = async () => {
        try {
            const { data } = await fetchPendingKyc()
            setKycRequests(data || { donors: [], receivers: [] })
        } catch (error) {
            console.error('Failed to load KYC', error)
        } finally {
            setLoading(false)
        }
    }

    const handleReview = async (id: string, status: 'verified' | 'rejected', user_source: 'donor' | 'receiver') => {
        if (!window.confirm(`Are you sure you want to ${status} this KYC request?`)) return

        try {
            await reviewKyc(id, status, user_source)
            await loadKyc()
        } catch (error) {
            console.error('Failed to review KYC', error)
            alert('Error updating KYC status')
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfcfd]">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-emerald-500 font-black tracking-[0.3em] animate-pulse uppercase text-xs">Verifying_Credentials...</p>
            </div>
        )
    }

    const currentRequests = activeTab === 'donors' ? kycRequests.donors : kycRequests.receivers

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
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verification Authority</span>
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
                                    KYC
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

                    <div className="bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm flex space-x-1">
                        <button
                            onClick={() => setActiveTab('donors')}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'donors' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                        >
                            Donors ({kycRequests.donors.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('receivers')}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'receivers' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                        >
                            NGOs ({kycRequests.receivers.length})
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentRequests.length === 0 ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200"
                        >
                            <ShieldCheck className="mx-auto h-16 w-16 text-emerald-200 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 uppercase">Queue Empty</h3>
                            <p className="text-slate-400 font-medium mt-1">All {activeTab === 'donors' ? 'Donor' : 'NGO'} requests have been processed.</p>
                        </motion.div>
                    ) : (
                        currentRequests.map((req, idx) => (
                            <motion.div
                                key={req.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="wire-card group"
                            >
                                <div className="card-grid" />
                                <div className="p-8 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-500 border border-slate-100 group-hover:scale-110 transition-transform">
                                            <UserIcon className="h-7 w-7" />
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <span className="bg-amber-50 text-amber-600 text-[10px] px-3 py-1 rounded-lg font-black uppercase tracking-widest border border-amber-100">Pending</span>
                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md ${activeTab === 'donors' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}>
                                                {req.platform_role?.replace('_', ' ') || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">{req.full_name}</h3>
                                    <p className="text-sm font-medium text-slate-400 mb-6 truncate">{req.email}</p>

                                    <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 mb-6 font-mono">
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-slate-400 uppercase font-black">Phone_No</span>
                                            <span className="text-slate-700 font-bold">{req.phone || 'N/A_'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-slate-400 uppercase font-black">FSSAI_Lic</span>
                                            <span className="text-slate-700 font-bold">{req.fssai_number || 'N/A_'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-slate-400 uppercase font-black">GST_Cert</span>
                                            <span className="text-slate-700 font-bold">{req.gst_number || 'N/A_'}</span>
                                        </div>
                                    </div>

                                    <div className="flex space-x-3 mb-8">
                                        {req.kyc_document_url && (
                                            <a href={req.kyc_document_url} target="_blank" rel="noreferrer" className="flex-1 text-center py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition flex items-center justify-center shadow-sm">
                                                <FileText className="w-4 h-4 mr-2 text-emerald-500" /> Docs
                                            </a>
                                        )}
                                        {req.selfie_url && (
                                            <a href={req.selfie_url} target="_blank" rel="noreferrer" className="flex-1 text-center py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition flex items-center justify-center shadow-sm">
                                                <UserIcon className="w-4 h-4 mr-2 text-emerald-500" /> Selfie
                                            </a>
                                        )}
                                    </div>

                                    <div className="mt-auto flex space-x-3 pt-6 border-t border-slate-100">
                                        <button
                                            onClick={() => handleReview(req.id, 'verified', req.user_source)}
                                            className="flex-1 bg-emerald-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition flex items-center justify-center shadow-lg shadow-emerald-500/20"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReview(req.id, 'rejected', req.user_source)}
                                            className="flex-1 bg-white text-rose-500 border border-rose-100 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition flex items-center justify-center"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    )
}
