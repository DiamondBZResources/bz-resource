import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CookieConsent from './components/CookieConsent'
import Footer from './components/Footer'
import Header from './components/Header'
import PageTransition from './components/PageTransition'
import RoutePreloader from './components/RoutePreloader'
import ScrollMotion from './components/ScrollMotion'
import ScrollToTop from './components/ScrollToTop'

const AboutPage = lazy(() => import('./pages/AboutPage'))
const WhyBZPage = lazy(() => import('./pages/WhyBZPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const ServicePage = lazy(() => import('./pages/ServicePage'))
const BiographyPage = lazy(() => import('./pages/BiographyPage'))
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const FormsPage = lazy(() => import('./pages/FormsPage'))
const ApplicantQuestionnairePage = lazy(() => import('./pages/ApplicantQuestionnairePage'))
const NewHireApplicationPage = lazy(() => import('./pages/NewHireApplicationPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'))
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
    <div className="site-shell">
      <ScrollToTop />
      <RoutePreloader />
      <ScrollMotion />
      <Header />
      <main>
        <Suspense fallback={<div className="route-loading" aria-live="polite">Loading…</div>}>
          <PageTransition>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/why-choose-bz" element={<WhyBZPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:serviceSlug" element={<ServicePage />} />
              <Route path="/biography" element={<BiographyPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/forms" element={<FormsPage />} />
              <Route path="/forms/applicant-questionnaire/:language" element={<ApplicantQuestionnairePage />} />
              <Route path="/forms/new-hire-application/:language" element={<NewHireApplicationPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/cookie-policy" element={<CookiePolicyPage />} />
              <Route path="/terms-of-use" element={<TermsOfUsePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </PageTransition>
        </Suspense>
      </main>
      <Footer />
      <CookieConsent />
    </div>
  )
}
