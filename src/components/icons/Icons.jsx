const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const DashboardIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
    <rect x="13" y="3.5" width="7.5" height="4.5" rx="1.5" />
    <rect x="13" y="10.5" width="7.5" height="10" rx="1.5" />
    <rect x="3.5" y="13.5" width="7.5" height="7" rx="1.5" />
  </svg>
)

export const SalesIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M3.5 19.5 9 12l4 3 6.5-8.5" />
    <path d="M14.5 5.5h5.5V11" />
  </svg>
)

export const LeadsIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19c1-3.4 3-5.2 5.5-5.2S13.5 15.6 14.5 19" />
    <path d="M16 8.5h5.5M16 12h5.5" />
  </svg>
)

export const CompaniesIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="4" y="9" width="7" height="11" />
    <rect x="13" y="4" width="7" height="16" />
    <path d="M6.5 12.5h2M6.5 15.5h2M15.5 7.5h2M15.5 10.5h2M15.5 13.5h2" />
  </svg>
)

export const ContactsIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="7.5" r="3.5" />
    <path d="M5 20c1.3-4 3.6-6 7-6s5.7 2 7 6" />
  </svg>
)

export const FollowupsIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4.5l3 2" />
  </svg>
)

export const MeetingsIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
  </svg>
)

export const ProposalsIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6 3.5h9l3.5 3.5V20.5H6z" />
    <path d="M15 3.5V7h3.5M9 12h6M9 15.5h6M9 8.5h2.5" />
  </svg>
)

export const CustomersIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="8.5" cy="8" r="3" />
    <circle cx="16" cy="9" r="2.4" />
    <path d="M3.2 19c.8-3.4 2.6-5 5.3-5s4.5 1.6 5.3 5" />
    <path d="M14.8 14.6c2.3.2 3.7 1.7 4.3 4.4" />
  </svg>
)

export const ClientsIcon = ContactsIcon

export const ProjectsIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M3.5 7.5 12 3l8.5 4.5V16L12 20.5 3.5 16Z" />
    <path d="M3.5 7.5 12 12l8.5-4.5M12 12v8.5" />
  </svg>
)

export const TasksIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2.5" />
    <path d="M8 12.5l2.3 2.3L16.5 9" />
  </svg>
)

export const ManagementIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="2.6" />
    <path d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20M6.3 6.3l1.6 1.6M16.1 16.1l1.6 1.6M6.3 17.7l1.6-1.6M16.1 7.9l1.6-1.6" />
  </svg>
)

export const EmployeesIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="9" cy="7.5" r="3" />
    <circle cx="17" cy="8.5" r="2.2" />
    <path d="M3.5 19.5c.8-3.6 2.7-5.4 5.5-5.4s4.7 1.8 5.5 5.4" />
    <path d="M15.8 14.6c2 .3 3.3 1.8 3.8 4.2" />
  </svg>
)

export const ReportsIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M5 20V10M11 20V4M17 20v-7" />
    <path d="M3.5 20.5h17" />
  </svg>
)

export const MarketingIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M3.5 10v4h3.5L14 18V6L7 10H3.5Z" />
    <path d="M17.5 9.5a3.2 3.2 0 0 1 0 5M20 7.5a6.3 6.3 0 0 1 0 9" />
  </svg>
)

export const CampaignsIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M3.5 10v4h3.5L14 18V6L7 10H3.5Z" />
    <path d="M17.5 9.5a3.2 3.2 0 0 1 0 5" />
  </svg>
)

export const SocialIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="6" cy="12" r="2.6" />
    <circle cx="17.5" cy="6" r="2.6" />
    <circle cx="17.5" cy="18" r="2.6" />
    <path d="M8.3 10.7 15.2 7.3M8.3 13.3l6.9 3.4" />
  </svg>
)

export const AnalyticsIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 20V4M4 20h16" />
    <path d="M8 16l3-4 3 2.5L18 8" />
  </svg>
)

export const SettingsIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 13.5a7.4 7.4 0 0 0 0-3l1.9-1.4-2-3.4-2.2.8a7.4 7.4 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.5a7.4 7.4 0 0 0-2.6 1.5l-2.2-.8-2 3.4L4.6 10.5a7.4 7.4 0 0 0 0 3l-1.9 1.4 2 3.4 2.2-.8a7.4 7.4 0 0 0 2.6 1.5l.5 2.5h4l.5-2.5a7.4 7.4 0 0 0 2.6-1.5l2.2.8 2-3.4Z" />
  </svg>
)

export const InstagramIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
  </svg>
)

export const HeartIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 20s-7.5-4.6-9.8-9.3C.6 7.2 2.3 4 5.6 4c2 0 3.3 1 4.4 2.4C11.1 5 12.4 4 14.4 4c3.3 0 5 3.2 3.4 6.7C15.5 15.4 12 20 12 20Z" />
  </svg>
)

export const CommentIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 5.5h16v11H9.5L5 20v-3.5H4v-11Z" />
  </svg>
)

export const SearchIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.7-3.7" />
  </svg>
)

export const BellIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10Z" />
    <path d="M9.7 19a2.3 2.3 0 0 0 4.6 0" />
  </svg>
)

export const ChevronDownIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const ChevronRightIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
)

export const LogoutIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M9 20H5.5A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4H9" />
    <path d="M16 16.5 20.5 12 16 7.5M20.5 12h-11" />
  </svg>
)

export const CloseIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const UserIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 19.5c1.4-3.2 4.2-5 7.5-5s6.1 1.8 7.5 5" />
  </svg>
)

export const PlusIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const TrashIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4.5 7h15M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2M18 7l-.75 12.5A1.5 1.5 0 0 1 15.75 21h-7.5a1.5 1.5 0 0 1-1.5-1.5L6 7" />
    <path d="M10 11v6M14 11v6" />
  </svg>
)

export const FilterIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 5.5h16M7 12h10M10.5 18.5h3" />
  </svg>
)

export const PhoneIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6.5 4.5h2.7l1.3 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.3v2.7a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 5 5.6 1.5 1.5 0 0 1 6.5 4.5Z" />
  </svg>
)

export const MailIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4.5 6.5 7.5 6 7.5-6" />
  </svg>
)

export const WhatsappIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6.5 17.5 4.5 20l2.6-1.9A8 8 0 1 0 5 12a7.9 7.9 0 0 0 1.5 5.5Z" />
    <path d="M9.3 9.8c.2 2.4 2.5 4.7 4.9 4.9.9.1 1-.6 1-1.1l-.3-.9-1.7-.5-.7.7a5.4 5.4 0 0 1-2.4-2.4l.7-.7-.5-1.7-.9-.3c-.5 0-1.2.1-1.1 1Z" />
  </svg>
)

export const GlobeIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.3 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.3-3.8-8.5S9.5 5.8 12 3.5Z" />
  </svg>
)

export const MapPinIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.4" />
  </svg>
)

export const LinkedinIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
    <path d="M8 10.5v6M8 7.8v.1M12 16.5v-4a2 2 0 0 1 4 0v4" strokeLinecap="round" />
  </svg>
)

export const BriefcaseIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3.5" y="7.5" width="17" height="11.5" rx="1.8" />
    <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
    <path d="M3.5 12.5h17" />
  </svg>
)

export const BudgetIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.5 15.5c0 1 1 1.8 2.5 1.8s2.5-.7 2.5-1.7c0-2.4-5-1-5-3.4 0-1 1-1.7 2.5-1.7s2.5.7 2.5 1.7M12 8.5v1.2M12 16.8V18" />
  </svg>
)

export const CalendarIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
    <path d="M8 14l2 2 4-4" />
  </svg>
)

export const ListViewIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M8 6.5h12M8 12h12M8 17.5h12" />
    <path d="M4 6.5h.01M4 12h.01M4 17.5h.01" />
  </svg>
)

export const KanbanIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3.5" y="4.5" width="5" height="15" rx="1.3" />
    <rect x="9.5" y="4.5" width="5" height="9" rx="1.3" />
    <rect x="15.5" y="4.5" width="5" height="12" rx="1.3" />
  </svg>
)

export const SendIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 20 20.5 12 4 4l2 7 9 1-9 1Z" />
  </svg>
)

export const DownloadIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 3.5v11M8 11l4 4 4-4" />
    <path d="M4.5 16.5V19a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2.5" />
  </svg>
)

export const FolderIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M3.5 6.5A1.5 1.5 0 0 1 5 5h4l2 2.5h8A1.5 1.5 0 0 1 20.5 9v9A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18Z" />
  </svg>
)

export const MoreIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p} fill="currentColor" stroke="none">
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </svg>
)

export const ArrowLeftIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)

export const CheckCircleIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.5 12.3 2.3 2.3 4.7-4.7" />
  </svg>
)

export const RefreshIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M20 11a8 8 0 0 0-14.6-4.5M4 13a8 8 0 0 0 14.6 4.5" />
    <path d="M4.5 4.5v4h4M19.5 19.5v-4h-4" />
  </svg>
)

export const BuildingIcon = CompaniesIcon

export const TrendUpIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 16.5 10 10l4 4 6-7" />
    <path d="M20 11v-4h-4" />
  </svg>
)

export const SortIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="m8 9 4-4 4 4M8 15l4 4 4-4" />
  </svg>
)

export const CaretUpIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p} fill="currentColor" stroke="none">
    <path d="M12 8.5 6 15h12z" />
  </svg>
)

export const CaretDownIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p} fill="currentColor" stroke="none">
    <path d="M12 15.5 6 9h12z" />
  </svg>
)

export const ChevronLeftIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="m15 6-6 6 6 6" />
  </svg>
)

export const NoteIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6 3.5h9l3.5 3.5V19.5A1.5 1.5 0 0 1 17 21H6.5A1.5 1.5 0 0 1 5 19.5v-14A1.5 1.5 0 0 1 6.5 3.5Z" />
    <path d="M14.5 3.5V7h3.5M8.5 12h7M8.5 15.5h7" />
  </svg>
)

export const FlagIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6 21V4M6 4.5h11l-2.5 3.5L17 11.5H6" />
  </svg>
)

export const CheckIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
)
