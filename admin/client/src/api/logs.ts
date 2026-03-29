export const fetchLogs = async () => {
    const token = localStorage.getItem('adminToken')
    const response = await fetch('/api/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch logs')
    return response.json()
}
