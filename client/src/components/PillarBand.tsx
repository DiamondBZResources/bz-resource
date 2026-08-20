type PillarBandProps = {
  eyebrow: string
  title: string
  text: string
  items: string[][]
  tone?: 'teal' | 'light'
}

export default function PillarBand({ eyebrow, title, text, items, tone = 'light' }: PillarBandProps) {
  return (
    <section className={`pillar-band pillar-band-${tone}`}>
      <div className="container-wide pillar-band-intro">
        <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
        <p>{text}</p>
      </div>
      <div className="container-wide pillar-band-grid">
        {items.map((item, index) => (
          <article key={item[0]}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{item[0]}</h3>
            <p>{item[1]}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
