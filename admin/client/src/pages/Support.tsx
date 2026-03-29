import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Search, Filter, CheckCircle, Clock, AlertCircle, LifeBuoy } from 'lucide-react'

const mockTickets = [
    { id: 'T-1001', user: 'Green Hotel', subject: 'Login issue with donor app', status: 'open', priority: 'high', date: '2 hours ago' },
    { id: 'T-1002', user: 'Helping Hands NGO', subject: 'Incorrect address on claim', status: 'in-progress', priority: 'medium', date: '5 hours ago' },
    { id: 'T-1003', user: 'Fresh Meals Foundation', subject: 'Change FSSAI document', status: 'resolved', priority: 'low', date: '1 day ago' },
    { id: 'T-1004', user: 'City Food Bank', subject: 'App crashes on Android 11', status: 'open', priority: 'high', date: '2 days ago' }
]

export default function Support() {
    const [searchTerm, setSearchTerm] = useState('')
    const [tickets, setTickets] = useState(mockTickets)

    const handleResolve = (id: string) => {
        setTickets(tickets.map(t => t.id === id ? { ...t, status: 'resolved' } : t))
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open': return <span className="bg-rose-50 text-rose-700 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider border border-rose-100 flex items-center shadow-sm"><AlertCircle className="w-3 h-3 mr-1.5" /> Open</span>
            case 'in-progress': return <span className="bg-amber-50 text-amber-700 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider border border-amber-100 flex items-center shadow-sm"><Clock className="w-3 h-3 mr-1.5" /> In Progress</span>
            case 'resolved': return <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider border border-emerald-100 flex items-center shadow-sm"><CheckCircle className="w-3 h-3 mr-1.5" /> Resolved</span>
            default: return null
        }
    }

    const filteredTickets = tickets.filter(t =>
        t.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
                            <LifeBuoy className="w-4 h-4" />
                            <span>Response & Resolution Unit</span>
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
                                    Support
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
                                placeholder="Search protocols..."
                                className="pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all w-full sm:w-64 font-medium shadow-sm"
                            />
                        </div>
                        <button className="flex items-center space-x-2 border border-slate-200 rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                            <Filter className="w-4 h-4 text-emerald-500" />
                            <span>Filter_Status</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden relative z-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                    <th className="px-6 py-5">Ticket ID</th>
                                    <th className="px-6 py-5">User_Node</th>
                                    <th className="px-6 py-5">Subject_Line</th>
                                    <th className="px-6 py-5 text-center">Protocol_Status</th>
                                    <th className="px-6 py-5">Rec_Date</th>
                                    <th className="px-6 py-5 text-right">Admin_Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredTickets.map((ticket, idx) => (
                                    <motion.tr
                                        key={ticket.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-5 font-mono text-[11px] text-emerald-600 font-black">{ticket.id}</td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tight">{ticket.user}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs text-slate-600 font-bold line-clamp-1 max-w-[250px] uppercase tracking-tight">{ticket.subject}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                {getStatusBadge(ticket.status)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ticket.date}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {ticket.status !== 'resolved' ? (
                                                <button
                                                    onClick={() => handleResolve(ticket.id)}
                                                    className="bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border border-emerald-100 hover:border-emerald-500 active:scale-95"
                                                >
                                                    Protocol_Verify
                                                </button>
                                            ) : (
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Closed_Node</span>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredTickets.length === 0 && (
                            <div className="p-20 text-center flex flex-col items-center">
                                <MessageSquare className="w-16 h-16 text-slate-100 mb-6" />
                                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">No_Active_Signals_Detected</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
