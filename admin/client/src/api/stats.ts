export const fetchDashboardStats = async () => {
    const token = localStorage.getItem('adminToken')
    const response = await fetch('/api/stats/dashboard', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error('Failed to fetch stats')
    return response.json()
}
