import {
  DashboardIcon,
  LeadsIcon,
  FollowupsIcon,
  MeetingsIcon,
  ProposalsIcon,
  ClientsIcon,
  EmployeesIcon,
  SocialIcon,
  AnalyticsIcon,
  InstagramIcon,
  NoteIcon,
  CalendarIcon,
} from '../icons/Icons.jsx'

export const navConfig = [
  { type: 'link', label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { type: 'link', label: 'Leads', path: '/leads', icon: LeadsIcon },
  { type: 'link', label: 'Follow-ups', path: '/follow-ups', icon: FollowupsIcon },
  { type: 'link', label: 'Meetings', path: '/meetings', icon: MeetingsIcon },
  { type: 'link', label: 'Proposals', path: '/proposals', icon: ProposalsIcon },
]

// Clients are managed by sales managers only.
export const salesManagerNavConfig = [
  ...navConfig,
  { type: 'link', label: 'Clients', path: '/clients', icon: ClientsIcon },
  { type: 'link', label: 'Team', path: '/team/sales-executives', icon: EmployeesIcon },
]

export const socialManagerNavConfig = [
  {
    type: 'group',
    label: 'Social Media',
    icon: SocialIcon,
    children: [
      { label: 'Overview', path: '/marketing/social', icon: AnalyticsIcon, end: true },
      { label: 'Posts', path: '/marketing/social/posts', icon: InstagramIcon },
      { label: 'Content Planner', path: '/marketing/social/planner', icon: NoteIcon },
      { label: 'Calendar', path: '/marketing/social/calendar', icon: CalendarIcon },
    ],
  },
]
