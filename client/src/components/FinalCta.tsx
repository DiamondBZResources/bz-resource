import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

export default function FinalCta({ copy, to = '/contact' }: { copy: string[]; to?: string }) {
  return (
    <section className="final-cta">
      <div className="container-wide final-cta-inner">
        <div><p className="eyebrow eyebrow-light">{copy[0]}</p><h2>{copy[1]}</h2><p>{copy[2]}</p></div>
        <Link className="button button-light" to={to}>{copy[3]}<FiArrowRight /></Link>
      </div>
    </section>
  )
}
