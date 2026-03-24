import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import PrivateRoutes from './context/PrivateRoutes'
import Register from './pages/Register'
import { AuthProvider } from './context/AuthContext'

import { AdminProvider } from './context/AdminContext'
import AdminPanel from './pages/AdminPanel'



function App() {
  return (
      <Router>
        <AuthProvider>
          <AdminProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
                
              <Route element={<PrivateRoutes />} >
                <Route path="/" element={<AdminPanel />} />
              </Route>
                
            </Routes>
          </AdminProvider>
        </AuthProvider>
      </Router>
  )
}

export default App