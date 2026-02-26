import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PenLine, Search, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PostCard from '../components/PostCard'
import { useDebounce } from '../hooks'

export default function FeedPage() {
  const { posts } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const debSearch = useDebounce(search, 250)

  const filtered = posts.filter((p) => {
    const q = debSearch.toLowerCase()
    return !q ||
      p.title.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q)) ||
      p.category?.toLowerCase().includes(q)
  })

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">
          <TrendingUp size={18} />
          Feed
        </div>
        <div className="topbar-actions">
          <div className="search-wrap">
            <span className="search-icon"><Search /></span>
            <input
              className="search-input"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/editor')}>
            <PenLine size={14} /> New Post
          </button>
        </div>
      </div>

      <div className="page-body">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{search ? 'Search' : 'Post'}</div>
            <div className="empty-title">{search ? 'No results found' : 'Nothing here yet'}</div>
            <div className="empty-sub">
              {search
                ? `No posts matching "${search}"`
                : 'Create your first post to get started!'}
            </div>
            {!search && (
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/editor')}>
                <PenLine size={14} /> Create Post
              </button>
            )}
          </div>
        ) : (
          <div>
            {filtered.map((post, i) => (
              <div key={post.id} style={{ animationDelay: `${i * 40}ms` }}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
