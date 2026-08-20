type Props = {
  eyebrow: string
  title: string
  text?: string
  meta?: string
}

export default function PageHero({ eyebrow, title, text, meta }: Props) {
  return (
    <section className="page-hero">
      <div className="container-wide page-hero-inner">
        <div className="page-hero-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {text && <p>{text}</p>}
        </div>
        {meta && <div className="page-hero-meta">{meta}</div>}
      </div>
    </section>
  )
}
