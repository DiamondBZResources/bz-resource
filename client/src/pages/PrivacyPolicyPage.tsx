import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { useLanguage } from '../context/language'
import { contactEmail } from '../data/navigation'

export default function PrivacyPolicyPage() {
  const { language } = useLanguage()
  const es = language === 'es'

  return <>
    <PageHero eyebrow={es ? 'Privacidad' : 'Privacy'} title={es ? 'Política de Privacidad' : 'Privacy Policy'} text={es ? 'Cómo BZ Resources recopila, usa, protege y comparte información personal.' : 'How BZ Resources collects, uses, protects, and shares personal information.'} meta={es ? 'Vigente: 20 de agosto de 2026' : 'Effective: August 20, 2026'} />
    <section className="section legal-section">
      <div className="container-wide legal-layout">
        <aside className="legal-summary">
          <p className="eyebrow">{es ? 'Resumen' : 'At a glance'}</p>
          <h2>{es ? 'Información con propósito.' : 'Information with a purpose.'}</h2>
          <p>{es ? 'Recopilamos la información necesaria para responder, evaluar solicitudes y prestar servicios laborales. No vendemos información personal.' : 'We collect information needed to respond, evaluate submissions, and provide workforce services. We do not sell personal information.'}</p>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </aside>
        <div className="legal-copy">
          <p>{es ? 'Esta Política de Privacidad explica las prácticas de BZ Resources en este sitio web. También puede aplicarse información adicional cuando usted participa en un proceso de contratación, empleo o servicio específico.' : 'This Privacy Policy explains BZ Resources’ practices for this website. Additional notices may apply when you participate in a specific hiring, employment, or service process.'}</p>

          <h2>{es ? 'Información que recopilamos' : 'Information we collect'}</h2>
          <p>{es ? 'Podemos recopilar identificadores y datos de contacto, experiencia laboral, disponibilidad, calificaciones, preferencias de empleo, información incluida en mensajes y otra información que usted decide proporcionar. También recibimos información limitada del dispositivo, como dirección IP, tipo de navegador, registros de seguridad y datos necesarios para mantener el sitio y prevenir abuso.' : 'We may collect identifiers and contact details, work history, availability, qualifications, employment preferences, information included in messages, and other information you choose to provide. We also receive limited device information such as IP address, browser type, security logs, and data needed to operate the site and prevent abuse.'}</p>
          <div className="legal-callout">{es ? 'No envíe números de Seguro Social, datos bancarios, documentos de identidad, información médica ni información fiscal mediante los formularios generales del sitio.' : 'Do not submit Social Security numbers, banking data, identity documents, medical information, or tax information through the site’s general forms.'}</div>

          <h2>{es ? 'Cómo obtenemos y usamos la información' : 'How we obtain and use information'}</h2>
          <p>{es ? 'Recibimos información directamente de usted cuando llama, envía un correo o completa un formulario. La usamos para responder consultas; considerar candidatos; coordinar reclutamiento, evaluación, incorporación y servicios laborales; mantener la seguridad; cumplir obligaciones legales; y administrar nuestra relación comercial.' : 'We receive information directly from you when you call, email, or submit a form. We use it to respond to inquiries; consider candidates; coordinate recruiting, screening, onboarding, and workforce services; maintain security; comply with legal obligations; and administer our business relationship.'}</p>

          <h2>{es ? 'Cuándo compartimos información' : 'When we share information'}</h2>
          <p>{es ? 'Podemos compartir información con personal autorizado de BZ Resources, empleadores o clientes relacionados con una oportunidad, y proveedores que prestan servicios por nuestra cuenta, incluidos los que ayudan a proteger y entregar los formularios. También podemos divulgar información si la ley lo requiere, para proteger derechos y seguridad, o en relación con una transacción empresarial legítima.' : 'We may share information with authorized BZ Resources personnel, employers or clients connected to an opportunity, and providers that perform services on our behalf, including those that help protect and deliver form submissions. We may also disclose information when required by law, to protect rights and safety, or in connection with a legitimate business transaction.'}</p>
          <p>{es ? 'No vendemos información personal ni la compartimos para publicidad conductual entre contextos.' : 'We do not sell personal information or share it for cross-context behavioral advertising.'}</p>

          <h2>{es ? 'Cookies, almacenamiento y caché' : 'Cookies, storage, and caching'}</h2>
          <p>{es ? 'El sitio usa almacenamiento local para recordar idioma y preferencias de privacidad, además de una caché del navegador para acelerar recursos públicos. Los servicios que protegen nuestros formularios pueden usar cookies o funciones similares cuando visita esas páginas. Consulte nuestra ' : 'The site uses local storage to remember language and privacy choices, plus browser caching to speed up public resources. Services that protect our forms may use cookies or similar features when you visit those pages. See our '}<Link to="/cookie-policy">{es ? 'Política de Cookies' : 'Cookie Policy'}</Link>{es ? ' para más información.' : ' for more information.'}</p>

          <h2>{es ? 'Conservación y seguridad' : 'Retention and security'}</h2>
          <p>{es ? 'Conservamos información durante el tiempo razonablemente necesario para los fines descritos, requisitos legales, resolución de disputas y mantenimiento de registros. Aplicamos medidas administrativas, organizativas y físicas razonables. Ningún método de transmisión o almacenamiento es completamente seguro.' : 'We retain information for as long as reasonably needed for the purposes described, legal requirements, dispute resolution, and recordkeeping. We use reasonable administrative, organizational, and physical safeguards. No transmission or storage method is completely secure.'}</p>

          <h2>{es ? 'Sus opciones y derechos' : 'Your choices and rights'}</h2>
          <p>{es ? 'Puede solicitar acceso, corrección o eliminación de cierta información y puede oponerse o retirar consentimiento cuando corresponda. Los derechos y excepciones dependen de su ubicación y de la relación que tenga con BZ Resources. Verificaremos las solicitudes antes de responder y no discriminaremos por ejercer un derecho aplicable.' : 'You may request access to, correction of, or deletion of certain information and may object or withdraw consent where applicable. Rights and exceptions depend on your location and relationship with BZ Resources. We will verify requests before responding and will not discriminate for exercising an applicable right.'}</p>

          <h2>{es ? 'Privacidad de menores' : 'Children’s privacy'}</h2>
          <p>{es ? 'El sitio y nuestros servicios laborales no están dirigidos a menores de 16 años. No recopilamos conscientemente información personal de niños mediante este sitio.' : 'The site and our workforce services are not directed to children under 16. We do not knowingly collect children’s personal information through this site.'}</p>

          <h2>{es ? 'Cambios y contacto' : 'Changes and contact'}</h2>
          <p>{es ? 'Podemos actualizar esta política para reflejar cambios en nuestras prácticas o requisitos. La fecha de vigencia mostrará la revisión más reciente. Para preguntas o solicitudes de privacidad, escriba a ' : 'We may update this policy to reflect changes in our practices or requirements. The effective date will show the latest revision. For privacy questions or requests, email '}<a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
        </div>
      </div>
    </section>
  </>
}
