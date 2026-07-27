import CallToAction from '../components/CallToAction'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { blogPosts } from '../data/blogPosts'

function BlogPage() {
  document.title = 'Blog | BZ Resources'
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      'Read BZ Resources hiring tips and staffing articles from the current public blog index.',
    )

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Staffing Insights"
        description="Current BZ Resources articles are listed with their public destinations."
      />

      <section className="section section-soft">
        <div className="section-inner blog-grid">
          {blogPosts.map((post, index) => (
            <Reveal
              as="article"
              className="blog-card"
              delay={(index % 4) as 0 | 1 | 2 | 3}
              key={post.href}
            >
              <div className="card-image-frame">
                <img
                  className="image-cover"
                  src={post.image}
                  alt=""
                  decoding="async"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="blog-meta">
                  by {post.author} | {post.date} | {post.category}
                </p>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <a href={post.href} rel="noopener noreferrer" target="_blank">
                  Read article
                  <span className="sr-only">, opens on the current public site</span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CallToAction
        title="Turn staffing insight into a stronger next step"
        text="Talk with BZ Resources about the hiring and workforce challenges facing your organization."
        linkLabel="Contact BZ Resources"
        to="/contact"
      />
    </>
  )
}

export default BlogPage
