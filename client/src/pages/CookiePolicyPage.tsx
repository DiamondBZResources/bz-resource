import PageHero from '../components/PageHero'
import { useLanguage } from '../context/language'

export default function CookiePolicyPage() {
  const { language } = useLanguage()
  const es = language === 'es'
  const openPreferences = () => window.dispatchEvent(new Event('bz-open-cookie-preferences'))

  return <>
    <PageHero eyebrow={es ? 'Privacidad' : 'Privacy'} title={es ? 'Política de Cookies' : 'Cookie Policy'} text={es ? 'Una explicación clara de las cookies, el almacenamiento local y la caché usados por este sitio.' : 'A clear explanation of the cookies, local storage, and caching used by this site.'} meta={es ? 'Vigente: 20 de agosto de 2026' : 'Effective: August 20, 2026'} />
    <section className="section legal-section">
      <div className="container-wide legal-layout">
        <aside className="legal-summary">
          <p className="eyebrow">{es ? 'Control' : 'Your control'}</p>
          <h2>{es ? 'Elija lo que funciona para usted.' : 'Choose what works for you.'}</h2>
          <p>{es ? 'Puede revisar o cambiar sus opciones en cualquier momento. El sitio no usa actualmente publicidad conductual.' : 'You can review or change your choices at any time. The site does not currently use behavioral advertising.'}</p>
          <button className="button" type="button" onClick={openPreferences}>{es ? 'Administrar preferencias' : 'Manage preferences'}</button>
        </aside>
        <div className="legal-copy">
          <p>{es ? 'Las cookies son pequeños archivos que un sitio puede guardar en su navegador. Otras funciones del navegador, como almacenamiento local y cachés, también pueden recordar opciones o acelerar recursos. Esta política describe cómo se usan en bz-resources.com y en la versión alojada en GitHub Pages.' : 'Cookies are small files a site may store in your browser. Other browser features, including local storage and caches, can also remember choices or speed up resources. This policy describes their use on bz-resources.com and the GitHub Pages-hosted version.'}</p>
          <h2>{es ? 'Servicios estrictamente necesarios' : 'Strictly necessary services'}</h2>
          <p>{es ? 'Guardamos su elección de privacidad para que el aviso no aparezca en cada visita. El sitio también puede recordar el idioma elegido. Estas opciones se guardan en almacenamiento local del navegador, no se usan para publicidad y pueden eliminarse mediante la configuración de su navegador.' : 'We store your privacy choice so the notice does not appear on every visit. The site may also remember your selected language. These choices are saved in browser local storage, are not used for advertising, and can be removed through your browser settings.'}</p>
          <h2>{es ? 'Protección de formularios' : 'Form protection'}</h2>
          <p>{es ? 'Las páginas de formularios usan un servicio de verificación para distinguir envíos legítimos del abuso automatizado. Ese proveedor puede establecer cookies o recopilar información limitada del dispositivo cuando se carga la verificación. Esta función es necesaria para proteger los formularios y está sujeta a las políticas del proveedor.' : 'Form pages use a verification service to distinguish legitimate submissions from automated abuse. That provider may set cookies or collect limited device information when the verification loads. This function is necessary to protect the forms and is subject to the provider’s policies.'}</p>
          <h2>{es ? 'Rendimiento y caché' : 'Performance and caching'}</h2>
          <p>{es ? 'Un service worker puede guardar copias de imágenes, hojas de estilo, scripts, documentos públicos y páginas visitadas para acelerar visitas posteriores y ofrecer una experiencia más resiliente. Esta caché permanece en su dispositivo y no rastrea su actividad entre sitios.' : 'A service worker may keep copies of images, stylesheets, scripts, public documents, and visited pages to speed up return visits and provide a more resilient experience. This cache remains on your device and does not track your activity across sites.'}</p>
          <h2>{es ? 'Servicios opcionales' : 'Optional services'}</h2>
          <p>{es ? 'BZ Resources no usa actualmente cookies de publicidad conductual ni herramientas de analítica opcional en este sitio. Si añadimos medición opcional en el futuro, respetaremos la elección guardada y actualizaremos esta política.' : 'BZ Resources does not currently use behavioral-advertising cookies or optional analytics tools on this site. If we add optional measurement in the future, we will honor the stored choice and update this policy.'}</p>
          <h2>{es ? 'Cómo cambiar sus opciones' : 'How to change your choices'}</h2>
          <p>{es ? 'Use el botón “Administrar preferencias” en esta página o el enlace del pie de página. También puede borrar o bloquear cookies, almacenamiento local y datos de sitios desde la configuración del navegador. Bloquear funciones necesarias puede afectar formularios, idioma o funcionamiento sin conexión.' : 'Use the “Manage preferences” button on this page or the footer link. You can also delete or block cookies, local storage, and site data through browser settings. Blocking necessary features may affect forms, language, or offline behavior.'}</p>
        </div>
      </div>
    </section>
  </>
}
