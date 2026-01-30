import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import PostJob from './components/admin/PostJob'
import JobDescription from './components/JobDescription'
import AdminJobs from './components/admin/AdminJobs'
import ApplicantsTable from './components/admin/ApplicantsTable'
import ProtectedRoute from './components/admin/ProtectedRoute';
import Companies from './components/admin/Companies'
import Profile from './components/Profile'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/jobs',
    element: <Jobs />
  },
  {
    path: '/admin/companies/create',
    element: <CompanyCreate />
  },
  {
    path: '/admin/companies/:id',
    element: <CompanySetup />
  },
  {
    path: '/admin/jobs/create',
    element: <PostJob />
  },
  {
    path: '/description/:id',
    element: <JobDescription />
  },
  {
    path: '/admin/jobs/:id/applicants',
    element: <ApplicantsTable />
  },
  {
    path: '/admin/jobs',
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
  },
  {
    path: '/admin/companies',
    element: <ProtectedRoute><Companies /></ProtectedRoute> // Make sure Companies.jsx exists!
  },
  {
    path: '/admin/jobs',
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
  },
  {
    path: '/admin/jobs/create',
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: '/admin/companies/create',
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: "/profile",
    element: <Profile />
  },
])

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App