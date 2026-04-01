import { API_BASE_URL } from './config'

// User management API calls

export const fetchUsers = async (type = 'all') => {
    const token = localStorage.getItem('adminToken')
    const response = await fetch(`${API_BASE_URL}/api/users?type=${type}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
}

export const fetchUserStats = async () => {
    const token = localStorage.getItem('adminToken')
    const response = await fetch(`${API_BASE_URL}/api/users/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok) throw new Error('Failed to fetch stats')
    return response.json()
}

export const updateUserStatus = async (userId: string, status: string, reason?: string) => {
    const token = localStorage.getItem('adminToken')
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, reason })
    })
    if (!response.ok) throw new Error('Failed to update user status')
    return response.json()
}
