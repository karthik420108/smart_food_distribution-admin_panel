import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    CheckSquare,
    Utensils,
    MessageSquare,
    BarChart3,
    LogOut
} from 'lucide-react'
const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'User Management', href: '/users', icon: Users },
    { name: 'KYC Reviews', href: '/kyc', icon: CheckSquare },
    { name: 'Food Listings', href: '/listings', icon: Utensils },
    { name: 'Support Tickets', href: '/support', icon: MessageSquare },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
]

export default function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        navigate('/login')
    }

    return (
        <div className="flex flex-col w-64 bg-slate-900 text-white min-h-screen">
            <div className="p-8 mb-6 flex flex-col items-start gap-1">
                <h1 className="text-3xl font-black tracking-tighter uppercase">
                    Rescue<span className="text-emerald-500">Bite</span>
                </h1>
                <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-black border-l-2 border-emerald-500 pl-3 mt-1">Admin Panel</p>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                ? 'bg-primary-600 text-white'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <Icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    )
}
