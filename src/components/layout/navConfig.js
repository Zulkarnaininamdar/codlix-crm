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
  ProjectsIcon,
  TasksIcon,
  ManagementIcon,
  EmployeesIcon,
  ReportsIcon,
} from '../icons/Icons.jsx'

export const navConfig = [
  { type: 'link', label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
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
  {
    type: 'group',
    label: 'Projects',
    icon: ProjectsIcon,
    children: [
      { label: 'Projects', path: '/projects', icon: ProjectsIcon },
      { label: 'Tasks', path: '/tasks', icon: TasksIcon },
    ],
  },
  {
    type: 'group',
    label: 'Management',
    icon: ManagementIcon,
    children: [
      { label: 'Employees', path: '/employees', icon: EmployeesIcon },
      { label: 'Reports', path: '/reports', icon: ReportsIcon },
    ],
  },
]
