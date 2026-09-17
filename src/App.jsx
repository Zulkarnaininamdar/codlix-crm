import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext.jsx'
import LoginPage from './components/LoginPage.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Leads from './pages/Leads.jsx'
import LeadNew from './pages/LeadNew.jsx'
import LeadDetails from './pages/LeadDetails.jsx'
import FollowUps from './pages/FollowUps.jsx'
import Meetings from './pages/Meetings.jsx'
import Companies from './pages/Companies.jsx'
import CompanyDetails from './pages/CompanyDetails.jsx'
import Contacts from './pages/Contacts.jsx'
import Proposals from './pages/Proposals.jsx'
import ProposalNew from './pages/ProposalNew.jsx'
import ProposalDetails from './pages/ProposalDetails.jsx'
import Clients from './pages/Clients.jsx'
import ClientDetails from './pages/ClientDetails.jsx'
import Projects from './pages/Projects.jsx'
import ProjectNew from './pages/ProjectNew.jsx'
import ProjectDetails from './pages/ProjectDetails.jsx'
import Tasks from './pages/Tasks.jsx'
import Employees from './pages/Employees.jsx'
import EmployeeDetails from './pages/EmployeeDetails.jsx'
import Reports from './pages/Reports.jsx'
import SocialMediaLayout from './components/social/SocialMediaLayout.jsx'
import SocialOverview from './pages/social/SocialOverview.jsx'
import SocialPosts from './pages/social/SocialPosts.jsx'
import SocialPlanner from './pages/social/SocialPlanner.jsx'
import SocialCalendar from './pages/social/SocialCalendar.jsx'
import Placeholder from './pages/Placeholder.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/new" element={<LeadNew />} />
            <Route path="/leads/:id" element={<LeadDetails />} />

            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyDetails />} />

            <Route path="/contacts" element={<Contacts />} />

            <Route path="/follow-ups" element={<FollowUps />} />
            <Route path="/meetings" element={<Meetings />} />

            <Route path="/proposals" element={<Proposals />} />
            <Route path="/proposals/new" element={<ProposalNew />} />
            <Route path="/proposals/:id" element={<ProposalDetails />} />

            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetails />} />

            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/new" element={<ProjectNew />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />

            <Route path="/tasks" element={<Tasks />} />

            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/:id" element={<EmployeeDetails />} />

            <Route path="/reports" element={<Reports />} />

            <Route path="/marketing/campaigns" element={<Placeholder title="Campaigns" />} />
            <Route path="/marketing/social" element={<SocialMediaLayout />}>
              <Route index element={<SocialOverview />} />
              <Route path="posts" element={<SocialPosts />} />
              <Route path="planner" element={<SocialPlanner />} />
              <Route path="calendar" element={<SocialCalendar />} />
            </Route>
            <Route path="/marketing/analytics" element={<Placeholder title="Analytics" />} />
            <Route path="/settings" element={<Placeholder title="Settings" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
