import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import PageTransition from './components/PageTransition'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import './App.css'

const AboutPage = lazy(() => import('./pages/AboutPage'))
const ApplicantQuestionnairePage = lazy(() => import('./pages/ApplicantQuestionnairePage'))
const BiographyPage = lazy(() => import('./pages/BiographyPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const FormsPage = lazy(() => import('./pages/FormsPage'))
const NewHireApplicationPage = lazy(() => import('./pages/NewHireApplicationPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const WhyBZPage = lazy(() => import('./pages/WhyBZPage'))

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
          <Suspense fallback={<div aria-live="polite" className="route-loading">Loading page…</div>}>
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
              <Route element={<ApplicantQuestionnairePage />} path="/forms/applicant-questionnaire/:language" />
              <Route element={<NewHireApplicationPage />} path="/forms/new-hire-application/:language" />
              <Route element={<PrivacyPolicyPage />} path="/privacy-policy" />
              <Route element={<NotFoundPage />} path="*" />
            </Routes>
          </Suspense>
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}

export default App
