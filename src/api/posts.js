import axios from 'axios'
import { INITIAL_POSTS } from '../data/posts'

const API_BASE_URL = 'https://jsonplaceholder.typicode.com' // Placeholder API for demo

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const postsApi = {
  // Get all posts
  getPosts: async () => {
    await delay(500) // Simulate network delay
    // In real app, this would be: const response = await axios.get(`${API_BASE_URL}/posts`)
    // return response.data
    return INITIAL_POSTS // Return local data for demo
  },

  // Get a single post by ID
  getPost: async (id) => {
    await delay(300)
    const post = INITIAL_POSTS.find(p => p.id === id)
    if (!post) throw new Error('Post not found')
    return post
  },

  // Create a new post
  createPost: async (postData) => {
    await delay(500)
    // Simulate API response
    const newPost = {
      ...postData,
      id: Date.now(), // Generate ID
      createdAt: 'Just now'
    }
    return newPost
  },

  // Update a post
  updatePost: async (id, postData) => {
    await delay(500)
    // Simulate update
    return { ...postData, id }
  },

  // Delete a post
  deletePost: async (id) => {
    await delay(3000)
    // Simulate delete
    return { success: true }
  }
}

export default postsApi