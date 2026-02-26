import { useState, useEffect } from 'react'
import {
  MapPin, Link2, Calendar, Edit2,
  Check, X, Heart, MessageCircle, Repeat2,
  Bookmark, Globe, FileText, Users, Award,
  TrendingUp
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { useAsync, simulateAsync } from '../hooks'
import PostCard from '../components/PostCard'
import { AVATAR_GRADIENTS } from '../data/posts'

const COVERS = [
  'linear-gradient(135deg,#f4f1ec 0%,#e8e0d5 50%,#ddd1c7 100%)',
  'linear-gradient(135deg,#f9f6f0 0%,#f0ebe5 100%)',
  'linear-gradient(135deg,#e8e0d5 0%,#d4c5b9 100%)',
  'linear-gradient(135deg,#ddd1c7 0%,#c4b5a6 100%)',
  'linear-gradient(135deg,#b8a085 0%,#8b7355 100%)',
]

const ACHIEVEMENTS = [
  { icon: '🚀', label: 'First Post',   check: (p) => p.length >= 1 },
  { icon: '🌐', label: 'Published',    check: (_, pub) => pub.length >= 1 },
  { icon: '❤️', label: '100 Likes',   check: (_, __, tl) => tl >= 100 },
  { icon: '🔁', label: 'Viral',        check: (_, __, _2, tr) => tr >= 10 },
  { icon: '⭐', label: '500 Likes',   check: (_, __, tl) => tl >= 500 },
  { icon: '🏆', label: 'Power User',  check: (p, _, tl) => p.length >= 5 && tl >= 200 },
]

export default function ProfilePage() {
  const { user, updateProfile, refreshSocialCounts } = useAuth()
  const { posts, totalLikes, totalComments, totalReposts, totalBookmarks, published } = useApp()
  const navigate = useNavigate()
  const { loading, run } = useAsync()

  const [activeTab, setActiveTab] = useState('posts')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
  })

  if (!user) return null

  useEffect(() => {
    refreshSocialCounts(user.id)
  }, [user.id, refreshSocialCounts])

  const [uc1, uc2] = AVATAR_GRADIENTS[user.avatarIdx ?? 0]
  const cover = COVERS[user.coverIdx ?? 0]

  const myPosts    = posts
  const bookmarked = posts.filter(p => p.bookmarked)
  const liked      = posts.filter(p => p.liked)

  const tabContent = { posts: myPosts, bookmarks: bookmarked, liked }
  const currentPosts = tabContent[activeTab] || []

  const TABS = [
    { key: 'posts',     label: 'Posts',     icon: FileText,   count: myPosts.length },
    { key: 'bookmarks', label: 'Bookmarks', icon: Bookmark,   count: bookmarked.length },
    { key: 'liked',     label: 'Liked',     icon: Heart,      count: liked.length },
  ]

  const STATS = [
    { icon: FileText,      label: 'Total Posts',  value: posts.length },
    { icon: Globe,         label: 'Published',    value: published.length },
    { icon: Heart,         label: 'Likes',        value: totalLikes },
    { icon: MessageCircle, label: 'Comments',     value: totalComments },
    { icon: Repeat2,       label: 'Reposts',      value: totalReposts },
    { icon: Bookmark,      label: 'Bookmarks',    value: totalBookmarks },
  ]

  const handleSave = () => run(async () => {
    await simulateAsync(700)
    updateProfile(form)
    setEditing(false)
  })

  const handleCancel = () => {
    setForm({ name: user.name, bio: user.bio, location: user.location, website: user.website })
    setEditing(false)
  }

  return (
    <>
      {/* ── Topbar ── */}
      <div className="topbar">
        <div className="topbar-title">
          <Users size={16} /> Profile
        </div>
        <div className="topbar-actions">
          {editing ? (
            <>
              <button className="btn btn-ghost btn-sm" onClick={handleCancel}>
                <X size={12} /> Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={loading}>
                {loading
                  ? <><span className="spinner" /> Saving…</>
                  : <><Check size={12} /> Save</>}
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>
                <Edit2 size={12} /> Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ padding: 0 }}>

        {/* ── Cover ── */}
        <div style={{ height: 140, background: cover, position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 40%, rgba(7,7,13,0.92) 100%)'
          }} />
        </div>

        {/* ── Hero row ── */}
        <div className="pf-hero">
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div className="pf-avatar" style={{ background: `linear-gradient(135deg,${uc1},${uc2})` }}>
              {user.name[0]}
            </div>
            {user.verified && <span className="pf-verified">✓</span>}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {editing ? (
              <div className="pf-edit-grid">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Location</label>
                  <input className="form-input" placeholder="City, Country" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
                </div>
                <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}>
                  <label className="form-label">Bio</label>
                  <textarea className="form-textarea" style={{ minHeight: 52 }} maxLength={160} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
                </div>
                <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}>
                  <label className="form-label">Website</label>
                  <input className="form-input" placeholder="https://yoursite.com" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                  <h1 className="pf-name">{user.name}</h1>
                  {user.verified && (
                    <span className="pf-verified-label"><Check size={9} /> Verified</span>
                  )}
                </div>
                <div className="pf-handle">{user.handle}</div>
                {user.bio && <p className="pf-bio">{user.bio}</p>}
                <div className="pf-meta">
                  {user.location && (
                    <span className="pf-meta-item"><MapPin size={11} /> {user.location}</span>
                  )}
                  {user.website && (
                    <a href={user.website} className="pf-meta-item pf-meta-link" target="_blank" rel="noopener noreferrer">
                      <Link2 size={11} /> {user.website.replace('https://', '')}
                    </a>
                  )}
                  <span className="pf-meta-item"><Calendar size={11} /> Joined {user.joinedAt}</span>
                </div>
              </>
            )}
          </div>

          {/* Follow counts */}
          <div className="pf-follow-block">
            <div className="pf-follow-item">
              <span className="pf-follow-num">{user.followers?.toLocaleString()}</span>
              <span className="pf-follow-label">Followers</span>
            </div>
            <div className="pf-follow-divider" />
            <div className="pf-follow-item">
              <span className="pf-follow-num">{user.following?.toLocaleString()}</span>
              <span className="pf-follow-label">Following</span>
            </div>
          </div>
        </div>

        {/* ── Two-column body ── */}
        <div className="pf-body">

          {/* ── LEFT sidebar ── */}
          <aside className="pf-sidebar">

            {/* Stats widget */}
            <div className="pf-widget">
              <div className="pf-widget-title"><TrendingUp size={12} /> Stats</div>
              {STATS.map(s => (
                <div key={s.label} className="pf-stat-row">
                  <span className="pf-stat-label">
                    <s.icon size={12} style={{ color: 'var(--accent)' }} /> {s.label}
                  </span>
                  <span className="pf-stat-val">{s.value.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div className="pf-widget">
              <div className="pf-widget-title"><Award size={12} /> Achievements</div>
              <div className="pf-achievements-grid">
                {ACHIEVEMENTS.map(a => {
                  const earned = a.check(posts, published, totalLikes, totalReposts)
                  return (
                    <div
                      key={a.label}
                      className={`pf-badge ${earned ? 'pf-badge-earned' : 'pf-badge-locked'}`}
                      title={earned ? a.label : `${a.label} (locked)`}
                    >
                      <span style={{ fontSize: 18 }}>{a.icon}</span>
                      <span className="pf-badge-label">{a.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

          </aside>

          {/* ── RIGHT content ── */}
          <div className="pf-content">
            {/* Tabs */}
            <div className="pf-tabs">
              {TABS.map(t => (
                <button
                  key={t.key}
                  className={`pf-tab ${activeTab === t.key ? 'pf-tab-active' : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  <t.icon size={13} />
                  {t.label}
                  <span className="pf-tab-count">{t.count}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="pf-tab-body">
              {currentPosts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    {activeTab === 'bookmarks' ? '🔖' : activeTab === 'liked' ? '❤️' : '✍️'}
                  </div>
                  <div className="empty-title">Nothing here yet</div>
                  <div className="empty-sub">
                    {activeTab === 'bookmarks'
                      ? 'Bookmark posts to see them here.'
                      : activeTab === 'liked'
                        ? 'Posts you like will appear here.'
                        : 'Start creating content!'}
                  </div>
                  {activeTab === 'posts' && (
                    <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/editor')}>
                      Create your first post
                    </button>
                  )}
                </div>
              ) : (
                currentPosts.map((post, i) => (
                  <div key={post.id} style={{ animationDelay: `${i * 35}ms` }}>
                    <PostCard post={post} />
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
