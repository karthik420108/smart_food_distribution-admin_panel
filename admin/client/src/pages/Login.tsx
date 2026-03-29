import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { motion } from 'framer-motion'
import { Lock, Mail, ChevronRight, Loader2 } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await login(email, password)
      localStorage.setItem('adminToken', response.token)
      localStorage.setItem('adminUser', JSON.stringify(response.user))
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Inter'] relative overflow-hidden">
      <style>{`
        .login-bg {
          position: fixed;
          inset: 0;
          background-image: linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.015) 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: -1;
        }

        .glow-orb {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%);
          border-radius: 50%;
          z-index: -1;
        }

        .wire-card {
          background: white;
          border-radius: 2rem;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.08);
          backdrop-filter: blur(8px);
        }
      `}</style>

      <div className="login-bg" />
      <div className="glow-orb -top-64 -left-64" />
      <div className="glow-orb -bottom-64 -right-64" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mb-6"
          >
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase">
              Rescue<span className="text-emerald-500">Bite</span>
            </h1>
          </motion.div>
          <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.6em]">Secure_Admin_Gateway</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="wire-card py-10 px-8 sm:px-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity_Key</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium placeholder:text-slate-300"
                  placeholder="admin@bridge.sys"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access_Cipher</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium placeholder:text-slate-300"
                  placeholder="••••••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-70 group"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
              ) : (
                <>
                  Connect_To_Node
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-[9px]">
                <span className="px-4 bg-white text-slate-400 font-bold uppercase tracking-[0.3em]">Encrypted_Tunnel</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          © 2024 RESCUEBITE_OS // v2.4.0
        </p>
      </motion.div>
    </div>
  )
}
