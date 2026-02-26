import { createContext, useContext, useState, useCallback } from 'react'
import { profileApi } from '../api/profile'

export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

// Demo users database
const DEMO_USERS = [
  {
    id: 'user_1',
    name: 'Rishabh Mukherjee',
    handle: '@rishabh',
    email: 'rishabh@forge.io',
    password: 'password123',
    bio: 'Senior engineer & occasional writer. Building tools for the web.',
    website: 'https://rishabh.dev',
    location: 'Ranchi, Jharkhand, India',
    avatarIdx: 0,
    followers: 2841,
    following: 312,
    joinedAt: 'January 2024',
    verified: true,
    coverIdx: 0,
  },
  {
    id: 'user_2',
    name: 'Trisha Gupta',
    handle: '@trishagupta',
    email: 'trisha@example.com',
    password: 'demo1234',
    bio: 'Product designer. Writing about design systems and UX.',
    website: '',
    location: 'Vijaywada, India',
    avatarIdx: 1,
    followers: 1204,
    following: 88,
    joinedAt: 'March 2024',
    verified: false,
    coverIdx: 1,
  },
  {
    id: 'user_3',
    name: 'Souleh Bhat',
    handle: '@souleh',
    email: 'souleh@example.com',
    password: 'demo1234',
    bio: 'Product designer. Writing about design systems and UX.',
    website: '',
    location: 'Srinagar, Kashmir',
    avatarIdx: 1,
    followers: 1204,
    following: 88,
    joinedAt: 'March 2024',
    verified: false,
    coverIdx: 1,
  },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState('')

  const refreshSocialCounts = useCallback(async (userId) => {
    try {
      const social = await profileApi.getFollowersFollowing(userId)
      setUser(prev => (prev ? { ...prev, ...social } : prev))
      return { ok: true }
    } catch {
      return { ok: false }
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setAuthError('')
    // Simulate API delay
    await new Promise(r => setTimeout(r, 900))
    const found = DEMO_USERS.find(u => u.email === email && u.password === password)
    if (found) {
      const { password: _, ...safeUser } = found
      setUser(safeUser)
      await refreshSocialCounts(safeUser.id)
      return { ok: true }
    }
    setAuthError('Invalid email or password. Try rishabh@forge.io / password123')
    return { ok: false }
  }, [])

  const register = useCallback(async (name, email, password) => {
    setAuthError('')
    await new Promise(r => setTimeout(r, 1000))
    if (DEMO_USERS.find(u => u.email === email)) {
      setAuthError('An account with this email already exists.')
      return { ok: false }
    }
    const newUser = {
      id: `user_${Date.now()}`,
      name, email,
      handle: '@' + name.toLowerCase().replace(/\s+/g, ''),
      bio: '',
      website: '',
      location: '',
      avatarIdx: Math.floor(Math.random() * 7),
      followers: 0,
      following: 0,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      verified: false,
      coverIdx: Math.floor(Math.random() * 5),
    }
    setUser(newUser)
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setAuthError('')
  }, [])

  const updateProfile = useCallback((updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, refreshSocialCounts, authError, setAuthError }}>
      {children}
    </AuthContext.Provider>
  )
}
