import { Link } from 'react-router-dom'
import Reveal from './Reveal'

type CallToActionProps = {
  title: string
  text: string
  linkLabel: string
  to: string
}

function CallToAction({ title, text, linkLabel, to }: CallToActionProps) {
  return (
    <Reveal as="section" className="cta-band">
      <div className="section-inner cta-inner">
        <div>
          <p className="eyebrow">Let’s get to work</p>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <Link className="button button-light" to={to}>
          {linkLabel}
        </Link>
      </div>
    </Reveal>
  )
}

export default CallToAction
