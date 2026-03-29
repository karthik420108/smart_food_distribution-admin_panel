import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchLogs } from '../api/logs'
import { Search, Clock, ShieldCheck, Database } from 'lucide-react'

export default function ActivityLogs() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadLogs()
    }, [])

    const loadLogs = async () => {
        try {
            const { data } = await fetchLogs()
            setLogs(data || [])
        } catch (error) {
            console.error('Failed to load logs', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredLogs = logs.filter(l =>
        l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.target_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.target_id?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfcfd]">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-emerald-500 font-black tracking-[0.3em] animate-pulse uppercase text-xs">Accessing_Audit_Chain...</p>
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
                            <Database className="w-4 h-4" />
                            <span>System Ledger Records</span>
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
                                    Logs
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
                                placeholder="Search audit trail..."
                                className="pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all w-full sm:w-64 font-medium shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden relative z-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                    <th className="px-6 py-5">Timestamp</th>
                                    <th className="px-6 py-5 text-left">Admin Identity</th>
                                    <th className="px-6 py-5 text-left">Internal Action</th>
                                    <th className="px-6 py-5 text-left">Resource Type</th>
                                    <th className="px-6 py-5">Reference ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-medium font-black uppercase tracking-[0.2em] text-xs">
                                            No Records Detected
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log, idx) => (
                                        <motion.tr
                                            key={log.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td className="px-6 py-5 text-[11px] font-black text-slate-400 whitespace-nowrap flex items-center mt-1">
                                                <Clock className="w-3.5 h-3.5 mr-2 text-emerald-500/50" />
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center">
                                                    <div className="p-1.5 bg-slate-900 text-white rounded-lg mr-3">
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                                        {log.admin_email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="bg-white border border-slate-200 text-slate-900 font-black text-[10px] px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm">
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-100">
                                                    {log.target_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 font-mono text-[10px] text-slate-400 font-bold group-hover:text-slate-600 transition-colors">
                                                {log.target_id || 'SYSTEM_NODE'}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
