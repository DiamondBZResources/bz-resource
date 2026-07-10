import { useCallback, useEffect, useState } from 'react'

type UseInViewOptions = {
  rootMargin?: string
  threshold?: number
}

function useInView<TElement extends Element>({
  rootMargin = '0px 0px -12% 0px',
  threshold = 0.14,
}: UseInViewOptions = {}) {
  const [element, setElement] = useState<TElement | null>(null)
  const [inView, setInView] = useState(false)
  const ref = useCallback((node: TElement | null) => {
    setElement(node)
  }, [])

  useEffect(() => {
    if (!element || inView) {
      return undefined
    }

    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [element, inView, rootMargin, threshold])

  return { ref, inView }
}

export default useInView
