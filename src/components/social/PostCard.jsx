import { HeartIcon, CommentIcon } from '../icons/Icons.jsx'
import './PostCard.css'

const typeLabels = {
  image: 'Image',
  carousel: 'Carousel',
  reel: 'Reel',
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function PostCard({ post, onClick }) {
  return (
    <button type="button" className="post-card" onClick={onClick}>
      <div className={`post-card__thumb post-card__thumb--${post.accent}`}>
        <span className="post-card__type">{typeLabels[post.type]}</span>
      </div>

      <div className="post-card__body">
        <p className="post-card__caption">{post.caption}</p>
        <div className="post-card__footer">
          <span className="post-card__stat"><HeartIcon /> {post.likes.toLocaleString()}</span>
          <span className="post-card__stat"><CommentIcon /> {post.comments.toLocaleString()}</span>
          <span className="post-card__date">{formatDate(post.postedAt)}</span>
        </div>
      </div>
    </button>
  )
}

export default PostCard
