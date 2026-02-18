import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useEffect, useContext } from 'react' // <--- Added useContext
import { io } from "socket.io-client";
import { AuthContext } from './context/AuthContext'; // <--- Import your Context

// --- AUTH IMPORTS ---
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'

// --- HOME IMPORTS ---
import Home from './components/home/Home'

// --- STUDENT IMPORTS ---
import Jobs from './components/student/Jobs'
import Browse from './components/student/Browse'
import Profile from './components/student/Profile'
import JobDescription from './components/student/JobDescription'
import SavedJobs from './components/student/SavedJobs'

// --- ADMIN IMPORTS ---
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from './components/admin/AdminJobs'
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import AdminRoute from './components/admin/ProtectedRoute'
import ProtectedRoute from './components/shared/ProtectedRoute'

// --- CHAT IMPORT (Uncomment when ready) ---
import Chat from './components/chat/Chat' 

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
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/saved-jobs",
    element: <SavedJobs />
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },
  {
    path: "/chat",
    element: <ProtectedRoute><Chat /></ProtectedRoute>
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute> 
  },
  {
    path: "/admin/companies",
    element: <AdminRoute><Companies /></AdminRoute>
  },
  {
    path: "/admin/jobs",
    element: <AdminRoute><AdminJobs /></AdminRoute>
  },
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
    </>
  )
}

export default App