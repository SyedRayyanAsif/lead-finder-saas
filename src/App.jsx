import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToHash from './components/ScrollToHash.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import RequestForm from './pages/RequestForm.jsx'
import RequestReceived from './pages/RequestReceived.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollToHash />
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/request"
            element={
              <ProtectedRoute>
                <RequestForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request/received"
            element={
              <ProtectedRoute>
                <RequestReceived />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
