import { useMemo, useState } from 'react'
import Modal from '../../components/common/Modal.jsx'
import PostCard from '../../components/social/PostCard.jsx'
import { useApi } from '../../hooks/useApi.js'
import { HeartIcon, CommentIcon } from '../../components/icons/Icons.jsx'

const typeLabels = { image: 'Image', carousel: 'Carousel', reel: 'Reel' }
const typeByMedia = { IMAGE: 'image', CAROUSEL_ALBUM: 'carousel', VIDEO: 'reel' }
const ACCENTS = 6

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function SocialPosts() {
  const { data, error, loading } = useApi('/social/media')
  const [selectedPost, setSelectedPost] = useState(null)

  const posts = useMemo(
    () =>
      (data ?? []).map((m, index) => ({
        id: m.id,
        type: typeByMedia[m.mediaType] ?? 'image',
        caption: m.caption,
        likes: m.likes,
        comments: m.comments,
        postedAt: m.timestamp,
        permalink: m.permalink,
        accent: `accent-${(index % ACCENTS) + 1}`,
      })),
    [data]
  )

  if (loading && !data) return <p className="social-page__empty">Loading posts…</p>
  if (error) return <p className="social-page__empty">Could not load posts. {error.message}</p>
  if (posts.length === 0) {
    return <p className="social-page__empty">No posts synced yet. Use Sync now on your account card to pull your latest posts.</p>
  }

  return (
    <div className="social-page__section">
      <div className="social-page__posts-grid">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />
        ))}
      </div>

      <Modal open={!!selectedPost} onClose={() => setSelectedPost(null)} title="Post Details" width="520px">
        {selectedPost && (
          <div className="post-detail">
            <div className={`post-detail__thumb post-card__thumb--${selectedPost.accent}`}>
              <span className="post-card__type">{typeLabels[selectedPost.type]}</span>
            </div>
            <p className="post-detail__caption">{selectedPost.caption}</p>
            <div className="post-detail__stats">
              <span><HeartIcon /> {selectedPost.likes.toLocaleString()} likes</span>
              <span><CommentIcon /> {selectedPost.comments.toLocaleString()} comments</span>
            </div>
            <p className="post-detail__date">Posted {formatDate(selectedPost.postedAt)}</p>
            {selectedPost.permalink && (
              <a className="post-detail__link" href={selectedPost.permalink} target="_blank" rel="noreferrer">
                View on Instagram
              </a>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SocialPosts
