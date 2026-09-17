import {
  DashboardIcon,
  SalesIcon,
  LeadsIcon,
  CompaniesIcon,
  FollowupsIcon,
  MeetingsIcon,
  ProposalsIcon,
  CustomersIcon,
  ClientsIcon,
  SocialIcon,
  AnalyticsIcon,
  InstagramIcon,
  NoteIcon,
  CalendarIcon,
} from '../icons/Icons.jsx'

export const navConfig = [
  { type: 'link', label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { type: 'link', label: 'Social Media', path: '/marketing/social', icon: SocialIcon },
  {
    type: 'group',
    label: 'Sales',
    icon: SalesIcon,
    children: [
      { label: 'Leads', path: '/leads', icon: LeadsIcon },
      { label: 'Companies', path: '/companies', icon: CompaniesIcon },
      { label: 'Follow-ups', path: '/follow-ups', icon: FollowupsIcon },
      { label: 'Meetings', path: '/meetings', icon: MeetingsIcon },
      { label: 'Proposals', path: '/proposals', icon: ProposalsIcon },
    ],
  },
  {
    type: 'group',
    label: 'Customers',
    icon: CustomersIcon,
    children: [{ label: 'Clients', path: '/clients', icon: ClientsIcon }],
  },
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
