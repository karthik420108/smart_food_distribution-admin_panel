import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Utensils,
  CheckSquare,
  Activity,
  Globe,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { fetchDashboardStats } from '../api/stats'

export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchDashboardStats()
        setData(response)
      } catch (error) {
        console.error('Failed to load stats', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfcfd]">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-emerald-500 font-black tracking-[0.3em] animate-pulse uppercase text-xs">Initializing_Mesh...</p>
      </div>
    )
  }

  const stats = [
    { name: 'Total Donors', value: data?.stats?.donors || 0, icon: Users, color: "text-emerald-500" },
    { name: 'Total Receivers', value: data?.stats?.receivers || 0, icon: Globe, color: "text-cyan-500" },
    { name: 'Active Listings', value: data?.stats?.listings || 0, icon: Utensils, color: "text-amber-500" },
    { name: 'KYC Pending', value: data?.stats?.kycPending || 0, icon: CheckSquare, color: "text-rose-500" },
  ]

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

        .scanline {
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, transparent 0%, rgba(16, 185, 129, 0.03) 50%, transparent 100%);
          position: absolute;
          top: -100%;
          left: 0;
          animation: scan-v2 4s linear infinite;
          pointer-events: none;
        }

        @keyframes scan-v2 { 0% { top: -100%; } 100% { top: 100%; } }
        @keyframes rotate-wire { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="dashboard-bg" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-8 relative">

        {/* ENHANCED ADMIN PANEL HEADER - FIXED ALIGNMENT */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-10">
          <div className="space-y-1">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black tracking-[0.4em] text-emerald-500 uppercase block">
                Auth_Session // Node_01
              </span>
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
                  Panel
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 bg-white p-3 pr-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-default"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-emerald-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-lg relative">A</div>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated Admin</p>
              <p className="text-sm font-bold text-slate-700">admin@rescuebite.in</p>
            </div>
          </motion.div>
        </div>

        {/* STATS TILES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="wire-card p-6 group cursor-crosshair border border-slate-200"
            >
              <div className="card-grid" />
              <div className="relative z-10 flex flex-col h-full">
                <div className={`absolute -top-2 -right-2 p-4 transition-all duration-500 ease-out 
                  ${stat.color} opacity-5 group-hover:opacity-100 group-hover:scale-110 group-hover:-translate-x-2 group-hover:translate-y-2 group-hover:drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]`}>
                  <stat.icon size={44} strokeWidth={1.5} />
                </div>

                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">DATA_POINT_{i + 1}</p>
                <h4 className="text-xs font-black text-slate-500 mb-6 uppercase tracking-wider">{stat.name}</h4>

                <div className="mt-auto flex items-baseline gap-3">
                  <h3 className="text-4xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tighter">
                    {stat.value}
                  </h3>
                  <div className="p-1 rounded bg-emerald-50 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1">
                    <ArrowUpRight size={14} className="text-emerald-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* CHART CARD */}
          <div className="lg:col-span-2 wire-card p-8 border border-slate-200">
            <div className="card-grid" />
            <div className="scanline" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3 tracking-tight uppercase">
                  <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-200">
                    <Activity className="text-white animate-pulse" size={18} />
                  </div>
                  Metric_Flow_Realtime
                </h3>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Feed</span>
                </div>
              </div>

              <div className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 15px 30px rgba(0,0,0,0.08)', padding: '12px' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}
                    />
                    <Area type="monotone" dataKey="donations" stroke="#10b981" strokeWidth={3} fill="url(#glow)" />
                    <Area type="monotone" dataKey="claims" stroke="#0ea5e9" strokeWidth={3} fill="transparent" strokeDasharray="6 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ACTIVITY LOG */}
          <div className="wire-card p-8 border border-slate-200">
            <div className="card-grid" />
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="text-lg font-black text-slate-800 mb-8 uppercase tracking-tight">System_Log</h3>
              <div className="space-y-5 flex-1 overflow-y-auto pr-3 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {data?.activity?.map((activity: any, idx: number) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group/item relative pl-4 border-l-2 border-slate-100 hover:border-emerald-500 transition-all py-1"
                    >
                      <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{activity.user}</p>
                      <p className="text-[10px] text-slate-500 font-mono font-medium leading-relaxed">
                        {">> "} <span className="group-hover/item:text-emerald-600 transition-colors">{activity.item}</span>
                      </p>
                      <p className="text-[9px] text-slate-300 font-bold mt-1 uppercase">
                        {new Date(activity.time).toLocaleTimeString()}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <button
                onClick={() => navigate('/activity')}
                className="mt-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-emerald-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                Sync_Archive <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}