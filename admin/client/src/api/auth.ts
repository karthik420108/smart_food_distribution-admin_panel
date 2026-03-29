// API relative base URL for dev proxy or production same-origin
const API_BASE_URL = ''

export interface LoginResponse {
  message: string
  token: string
  user: {
    email: string
    role: string
  }
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Login failed')
  }

  return response.json()
}
