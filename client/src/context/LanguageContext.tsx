import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { LanguageContext } from './language'
import type { Language } from './language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = window.localStorage.getItem('bz-language')
    return saved === 'es' ? 'es' : 'en'
  })

  const setLanguage = (next: Language) => setLanguageState(next)

  useEffect(() => {
    document.documentElement.lang = language
    window.localStorage.setItem('bz-language', language)
  }, [language])

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage: () => setLanguageState((current) => current === 'en' ? 'es' : 'en') }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
