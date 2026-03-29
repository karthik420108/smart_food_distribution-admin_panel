import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Calendar, Download, TrendingUp, PieChart as PieIcon } from 'lucide-react'
import { motion } from 'framer-motion'

const activityData = [
    { name: 'Jan', donations: 400, claims: 240, newUsers: 150 },
    { name: 'Feb', donations: 300, claims: 139, newUsers: 120 },
    { name: 'Mar', donations: 200, claims: 980, newUsers: 200 },
    { name: 'Apr', donations: 278, claims: 390, newUsers: 180 },
    { name: 'May', donations: 189, claims: 480, newUsers: 90 },
    { name: 'Jun', donations: 239, claims: 380, newUsers: 110 },
]

const userSplitData = [
    { name: 'Donors', value: 45 },
    { name: 'Receivers', value: 55 },
]

const COLORS = ['#10b981', '#06b6d4']

export default function Analytics() {
    const handleExport = () => {
        const headers = ['Month', 'Donations', 'Claims', 'New Users']
        const csvContent = [
            headers.join(','),
            ...activityData.map(d => `${d.name},${d.donations},${d.claims},${d.newUsers}`)
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `analytics_export_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
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
          border-radius: 2rem;
          padding: 2rem;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .wire-card:hover {
          transform: translateY(-4px);
          border-color: #10b981;
          box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.1);
        }
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
                            <TrendingUp className="w-4 h-4" />
                            <span>Platform Intelligence Unit</span>
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
                                    Analytics
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

                    <div className="flex gap-4">
                        <button className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                            <Calendar className="w-4 h-4 text-emerald-500" />
                            <span>Time_Interval: 6M</span>
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95 group"
                        >
                            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                            <span>Export_Data</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 wire-card overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center">
                                <TrendingUp className="w-5 h-5 mr-3 text-emerald-500" />
                                Growth_Matrix
                            </h3>
                            <div className="flex gap-3">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[10px] font-bold text-slate-400">DONATIONS</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-md" />
                                    <span className="text-[10px] font-bold text-slate-400">USER_COUNT</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="5 5" stroke="#f1f5f9" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                                        contentStyle={{
                                            borderRadius: '16px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                            padding: '12px'
                                        }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}
                                    />
                                    <Bar dataKey="donations" name="Resources" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
                                    <Bar dataKey="claims" name="Allocation" fill="#06b6d4" radius={[6, 6, 0, 0]} barSize={24} />
                                    <Bar dataKey="newUsers" name="Nodes" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="wire-card"
                    >
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-12 flex items-center">
                            <PieIcon className="w-5 h-5 mr-3 text-cyan-500" />
                            Segmentation
                        </h3>
                        <div className="h-64 w-full flex justify-center items-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={userSplitData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={8}
                                        dataKey="value"
                                        animationBegin={0}
                                        animationDuration={1500}
                                    >
                                        {userSplitData.map((_entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                stroke="none"
                                                className="hover:opacity-80 transition-opacity"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-[10px] font-black uppercase text-slate-500 ml-1">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                <p className="text-2xl font-black text-slate-900 leading-none">100%</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">DATA_SYNC</p>
                            </div>
                        </div>
                        <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">SYSTEM_INSIGHT_</p>
                            <p className="text-xs font-medium text-slate-600 leading-relaxed">
                                User growth has stabilized with a <span className="text-emerald-500 font-bold">12% increase</span> in donor participation over the last quarter.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
