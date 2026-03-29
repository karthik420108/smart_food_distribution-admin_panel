export const fetchPendingKyc = async () => {
    const token = localStorage.getItem('adminToken')
    const response = await fetch('/api/kyc/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch KYC')
    return response.json()
}

export const reviewKyc = async (id: string, status: 'verified' | 'rejected', user_type: 'donor' | 'receiver') => {
    const token = localStorage.getItem('adminToken')
    const response = await fetch(`/api/kyc/${id}/review`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, user_type })
    })
    if (!response.ok) throw new Error('Failed to review KYC')
    return response.json()
}
