import type { ReactNode } from 'react'
import Reveal from './Reveal'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  children?: ReactNode
}

function SectionHeading({ eyebrow, title, children }: SectionHeadingProps) {
  return (
    <Reveal className="section-heading">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {children ? <div className="section-heading-copy">{children}</div> : null}
    </Reveal>
  )
}

export default SectionHeading
