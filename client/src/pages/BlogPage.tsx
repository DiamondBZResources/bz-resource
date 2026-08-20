import { FiArrowUpRight } from 'react-icons/fi'
import PageHero from '../components/PageHero'
import ResponsiveImage from '../components/ResponsiveImage'
import FinalCta from '../components/FinalCta'
import { useLanguage } from '../context/language'
import { blogPosts } from '../data/blogPosts'
import { siteContent } from '../data/siteContent'

export default function BlogPage() {
  const { language } = useLanguage()
  const copy = siteContent[language].blog
  return (
    <>
      <PageHero eyebrow={copy.hero[0]} title={copy.hero[1]} text={copy.hero[2]} meta={language === 'es' ? 'Contratación • Personal • Carreras' : 'Hiring • Staffing • Careers'} />
      <section className="section"><div className="container-wide"><div className="section-heading-row"><div><p className="eyebrow">{copy.eyebrow}</p><h2>{copy.title}</h2></div></div>
        <div className="blog-list">{blogPosts.map((post, index) => <article key={post.title} className={index === 0 ? 'featured' : ''}>
          <a className="blog-image" href={post.href} target="_blank" rel="noreferrer"><ResponsiveImage alt="" imageClassName="cover-image" sizes={index === 0 ? '(max-width: 900px) 100vw, 55vw' : '(max-width: 700px) 100vw, 33vw'} source={post.image} /></a>
          <div className="blog-copy"><div className="blog-meta"><span>{post.category}</span><time>{post.date}</time></div><h2><a href={post.href} target="_blank" rel="noreferrer">{post.title}</a></h2><p>{post.excerpt}</p><a className="text-link" href={post.href} target="_blank" rel="noreferrer">{copy.read}<FiArrowUpRight /></a></div>
        </article>)}</div>
      </div></section>
      <FinalCta copy={copy.cta} />
    </>
  )
}
