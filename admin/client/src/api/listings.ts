export const fetchListings = async () => {
    const token = localStorage.getItem('adminToken')
    const response = await fetch('/api/listings', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch listings')
    return response.json()
}

export const updateListingStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('adminToken')
    const response = await fetch(`/api/listings/${id}/status`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    })
    if (!response.ok) throw new Error('Failed to update listing status')
    return response.json()
}
