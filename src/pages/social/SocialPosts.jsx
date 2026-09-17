import { useState } from 'react'
import Modal from '../../components/common/Modal.jsx'
import PostCard from '../../components/social/PostCard.jsx'
import { instagramPosts } from '../../data/socialMediaData.js'
import { HeartIcon, CommentIcon } from '../../components/icons/Icons.jsx'

const typeLabels = { image: 'Image', carousel: 'Carousel', reel: 'Reel' }

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function SocialPosts() {
  const [selectedPost, setSelectedPost] = useState(null)

  return (
    <div className="social-page__section">
      <div className="social-page__posts-grid">
        {instagramPosts.map((post) => (
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
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SocialPosts
