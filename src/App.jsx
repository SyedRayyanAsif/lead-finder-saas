import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToHash from './components/ScrollToHash.jsx'
import Landing from './pages/Landing.jsx'
import ComingSoon from './pages/ComingSoon.jsx'

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
          {/* Auth is the next build step – placeholders so the nav isn't dead. */}
          <Route path="/login" element={<ComingSoon title="Log in" />} />
          <Route path="/signup" element={<ComingSoon title="Sign up" />} />
          <Route path="*" element={<ComingSoon title="Page not found" notFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
