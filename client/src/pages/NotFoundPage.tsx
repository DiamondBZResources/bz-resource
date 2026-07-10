import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'

function NotFoundPage() {
  document.title = 'Page Not Found | BZ Resources'
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', 'The requested BZ Resources page was not found.')

  return (
    <>
      <PageHero
        eyebrow="Not Found"
        title="Page Not Found"
        description="The page you requested does not exist in this rebuild."
      />
      <section className="section">
        <Reveal className="section-inner content-panel">
          <p>Use the navigation to continue exploring BZ Resources.</p>
          <Link className="button" to="/">
            Return Home
          </Link>
        </Reveal>
      </section>
    </>
  )
}

export default NotFoundPage
