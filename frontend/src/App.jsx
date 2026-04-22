import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useEffect, useContext } from 'react'
import { io } from "socket.io-client";
import { AuthContext } from './context/AuthContext';
import { Toaster } from 'sonner';

// --- AUTH IMPORTS ---
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'

// --- HOME IMPORTS ---
import Home from './components/home/Home'

// --- PUBLIC PAGE IMPORTS ---
import About from './components/pages/About'
import Contact from './components/pages/Contact'
import FAQs from './components/pages/FAQs'

// --- STUDENT IMPORTS ---
import Jobs from './components/student/Jobs'
import Browse from './components/student/Browse'
import Profile from './components/student/Profile'
import JobDescription from './components/student/JobDescription'
import SavedJobs from './components/student/SavedJobs'
import CareerInsights from './components/student/CareerInsights'
import BrowseCompanies from './components/student/BrowseCompanies'
import SalaryInsights from './components/student/SalaryInsights'
import AccountSettings from './components/student/AccountSettings'

// --- ADMIN IMPORTS ---
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from './components/admin/AdminJobs'
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import CandidateSearch from './components/admin/CandidateSearch'
import AdminRoute from './components/admin/ProtectedRoute'
import ProtectedRoute from './components/shared/ProtectedRoute'

// --- CHAT IMPORT ---
import Chat from './components/chat/Chat' 

const appRouter = createBrowserRouter([
  // --- PUBLIC ROUTES ---
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/faqs', element: <FAQs /> },
  { path: '/companies', element: <BrowseCompanies /> },

  // --- JOB ROUTES ---
  { path: "/jobs", element: <Jobs /> },
  { path: "/description/:id", element: <JobDescription /> },
  { path: "/browse", element: <Browse /> },

  // --- AUTHENTICATED STUDENT ROUTES ---
  { path: "/saved-jobs", element: <SavedJobs /> },
  { path: "/career-insights", element: <ProtectedRoute><CareerInsights /></ProtectedRoute> },
  { path: "/salary-insights", element: <SalaryInsights /> },
  { path: "/settings", element: <ProtectedRoute><AccountSettings /></ProtectedRoute> },
  { path: "/chat", element: <ProtectedRoute><Chat /></ProtectedRoute> },
  { path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },

  // --- ADMIN ROUTES ---
  { path: "/admin/companies/create", element: <ProtectedRoute><CompanyCreate /></ProtectedRoute> },
  { path: "/admin/companies/:id", element: <ProtectedRoute><CompanySetup /></ProtectedRoute> },
  { path: "/admin/jobs/create", element: <ProtectedRoute><PostJob /></ProtectedRoute> },
  { path: "/admin/jobs/:id/applicants", element: <ProtectedRoute><Applicants /></ProtectedRoute> },
  { path: "/admin/companies", element: <AdminRoute><Companies /></AdminRoute> },
  { path: "/admin/jobs", element: <AdminRoute><AdminJobs /></AdminRoute> },
  { path: "/admin/candidates", element: <AdminRoute><CandidateSearch /></AdminRoute> },
])

function App() {
  const { user } = useContext(AuthContext); 

  useEffect(() => {
    if (user) {
      const socket = io('http://localhost:8000', {
        query: { userId: user._id },
        transports: ['websocket']
      });
      socket.on('getOnlineUsers', (users) => {
        console.log("Online users:", users);
      });

      return () => socket.close();
    }
  }, [user]);

  return (
    <>
      <RouterProvider router={appRouter} />
      <Toaster position="bottom-right" richColors closeButton />
    </>
  )
}

export default App