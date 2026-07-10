import type { HTMLAttributes, ReactNode } from 'react'
import useInView from '../hooks/useInView'

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'div' | 'footer' | 'section'
  children: ReactNode
  className?: string
  delay?: 0 | 1 | 2 | 3
}

function Reveal({
  as: Component = 'div',
  children,
  className = '',
  delay = 0,
  ...props
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>()
  const classes = [
    'reveal',
    inView ? 'reveal-visible' : '',
    delay > 0 ? `reveal-delay-${delay}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classes} ref={ref} {...props}>
      {children}
    </Component>
  )
}

export default Reveal
