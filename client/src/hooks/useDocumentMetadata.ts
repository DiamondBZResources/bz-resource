import { useEffect } from 'react'

const defaultTitle = 'BZ Resources | Staffing & Workforce Solutions'
const defaultDescription = 'BZ Resources provides staffing, recruitment, screening, training, payroll and workforce solutions nationwide.'

export default function useDocumentMetadata(title: string, description: string) {
  useEffect(() => {
    let descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta')
      descriptionMeta.name = 'description'
      document.head.append(descriptionMeta)
    }

    document.title = title
    descriptionMeta.content = description

    return () => {
      document.title = defaultTitle
      descriptionMeta.content = defaultDescription
    }
  }, [description, title])
}
