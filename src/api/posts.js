import axios from 'axios'
import { INITIAL_POSTS } from '../data/posts'

const API_BASE_URL = 'https://dummyjson.com'
const DEFAULT_LIMIT = 10

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const uniqueById = (posts) => {
  const seen = new Set()
  return posts.filter((post) => {
    if (seen.has(post.id)) return false
    seen.add(post.id)
    return true
  })
}

const normalizeTag = (tag) => String(tag || '').toLowerCase().replace(/\s+/g, '-')

const hashNumber = (value, seed = 1) => {
  const text = String(value ?? '')
  return [...text].reduce((acc, ch) => acc + ch.charCodeAt(0) * seed, 0)
}

const buildCreatedAt = (id) => `${(id % 12) + 1}h ago`

const mapUserToAuthor = (user) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim()
  const author = fullName || user?.username || 'Unknown Author'
  const authorHandle = user?.username ? `@${String(user.username).toLowerCase()}` : '@unknown'
  return { author, authorHandle }
}

const mapDummyPost = (post, user) => {
  const { author, authorHandle } = mapUserToAuthor(user)
  const body = post.body || ''
  const words = body.trim() ? body.trim().split(/\s+/).length : 0
  const reactions = Number(post.reactions?.likes ?? post.reactions ?? 0)
  const baseScore = hashNumber(post.id, 7)

  return {
    id: `dummy-post-${post.id}`,
    remoteId: post.id,
    authorId: post.userId,
    title: post.title,
    body,
    status: 'published',
    tags: Array.isArray(post.tags) ? post.tags.map(normalizeTag) : [],
    category: post.tags?.[0] ? String(post.tags[0]) : 'Community',
    author,
    authorHandle,
    likes: reactions,
    comments: Math.max(0, Math.round(reactions * 0.18) + (baseScore % 14)),
    reposts: Math.max(0, Math.round(reactions * 0.09) + (baseScore % 7)),
    bookmarks: Math.max(0, Math.round(reactions * 0.05) + (baseScore % 5)),
    liked: false,
    bookmarked: false,
    reposted: false,
    createdAt: buildCreatedAt(post.id),
    readTime: Math.max(1, Math.ceil(words / 180)),
    wordCount: words,
    avatarIdx: post.userId % 7,
    canEdit: false,
    source: 'dummyjson',
  }
}

async function fetchUsersMap(userIds) {
  const uniqueIds = [...new Set(userIds.filter(Boolean))]
  const entries = await Promise.all(
    uniqueIds.map(async (id) => {
      const { data } = await axios.get(`${API_BASE_URL}/users/${id}`)
      return [id, data]
    })
  )

  return new Map(entries)
}

export const postsApi = {
  getPosts: async ({ skip = 0, limit = DEFAULT_LIMIT } = {}) => {
    await delay(250)

    try {
      const { data } = await axios.get(`${API_BASE_URL}/posts`, {
        params: { skip, limit },
      })

      const usersMap = await fetchUsersMap(data.posts.map((post) => post.userId))
      const mapped = data.posts.map((post) => mapDummyPost(post, usersMap.get(post.userId)))

      return {
        posts: mapped,
        total: data.total ?? mapped.length,
        skip: data.skip ?? skip,
        limit: data.limit ?? limit,
      }
    } catch {
      const fallbackPosts = INITIAL_POSTS.slice(skip, skip + limit)
      return {
        posts: uniqueById(fallbackPosts),
        total: INITIAL_POSTS.length,
        skip,
        limit,
      }
    }
  },

  getPost: async (id) => {
    await delay(200)
    const post = INITIAL_POSTS.find((p) => p.id === id || p.remoteId === id)
    if (!post) throw new Error('Post not found')
    return post
  },

  createPost: async (postData) => {
    await delay(500)
    return {
      ...postData,
      id: Date.now(),
      createdAt: 'Just now',
      canEdit: true,
      source: 'local',
    }
  },

  updatePost: async (id, postData) => {
    await delay(500)
    return { ...postData, id }
  },

  deletePost: async () => {
    await delay(300)
    return { success: true }
  }
}

export default postsApi
