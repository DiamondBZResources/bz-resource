import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import PageTransition from './components/PageTransition'
import ScrollToTop from './components/ScrollToTop'
import AboutPage from './pages/AboutPage'
import BiographyPage from './pages/BiographyPage'
import BlogPage from './pages/BlogPage'
import ContactPage from './pages/ContactPage'
import FormsPage from './pages/FormsPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import ResourcesPage from './pages/ResourcesPage'
import ServicesPage from './pages/ServicesPage'
import WhyBZPage from './pages/WhyBZPage'
import './App.css'

function App() {
  useEffect(() => {
    document.documentElement.classList.add('reveal-enabled')

    return () => document.documentElement.classList.remove('reveal-enabled')
  }, [])

  return (
    <div className="site-shell">
      <ScrollToTop />
      <Header />
      <main>
        <PageTransition>
          <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<AboutPage />} path="/about-us" />
            <Route element={<WhyBZPage />} path="/why-choose-bz" />
            <Route element={<ServicesPage />} path="/services" />
            <Route element={<BiographyPage />} path="/biography" />
            <Route element={<ResourcesPage />} path="/resources" />
            <Route element={<BlogPage />} path="/blog" />
            <Route element={<ContactPage />} path="/contact" />
            <Route element={<FormsPage />} path="/forms" />
            <Route element={<PrivacyPolicyPage />} path="/privacy-policy" />
            <Route element={<NotFoundPage />} path="*" />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}

export default App
