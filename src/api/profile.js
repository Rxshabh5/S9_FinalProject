import axios from 'axios'

const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

const toNumericUserId = (userId) => {
  const n = Number(String(userId ?? '').replace(/\D/g, ''))
  return Number.isFinite(n) && n > 0 ? n : 1
}

export const profileApi = {
  getProfile: async (userId) => {
    const id = toNumericUserId(userId)
    const response = await axios.get(`${API_BASE_URL}/users/${id}`)
    return response.data
  },

  // jsonplaceholder has no social graph, so followers/following are derived from profile data
  getFollowersFollowing: async (userId) => {
    const profile = await profileApi.getProfile(userId)
    const seed = (profile?.id || 1) * 337 + (profile?.name?.length || 0) * 19
    const followers = Math.max(100, seed * 3)
    const following = Math.max(25, Math.round(followers * 0.14))
    return { followers, following }
  },
}

export default profileApi
