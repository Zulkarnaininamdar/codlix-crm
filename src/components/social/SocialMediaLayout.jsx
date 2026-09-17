import { Outlet } from 'react-router-dom'
import PageHeader from '../common/PageHeader.jsx'
import InstagramAccountCard from './InstagramAccountCard.jsx'
import { instagramAccount } from '../../data/socialMediaData.js'
import '../common/PageHeader.css'
import '../common/Button.css'
import '../common/Form.css'
import '../common/Modal.css'
import '../common/Badge.css'
import '../../pages/social/social.css'

function SocialMediaLayout() {
  return (
    <div className="social-page">
      <PageHeader title="Social Media" subtitle="Instagram performance, posts & content planning" />
      <InstagramAccountCard account={instagramAccount} />
      <Outlet />
    </div>
  )
}

export default SocialMediaLayout
