import { API_BASE_URL } from './config'

export const fetchDashboardStats = async () => {
    const token = localStorage.getItem('adminToken')
    const response = await fetch(`${API_BASE_URL}/api/stats/dashboard`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error('Failed to fetch stats')
    return response.json()
}
