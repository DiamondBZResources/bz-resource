import PageHero from '../components/PageHero'
import { useLanguage } from '../context/language'
import { contactEmail } from '../data/navigation'

export default function TermsOfUsePage() {
  const { language } = useLanguage()
  const es = language === 'es'

  return <>
    <PageHero eyebrow={es ? 'Términos' : 'Terms'} title={es ? 'Términos de Uso' : 'Terms of Use'} text={es ? 'Las condiciones que rigen el uso del sitio web de BZ Resources.' : 'The conditions governing use of the BZ Resources website.'} meta={es ? 'Vigente: 20 de agosto de 2026' : 'Effective: August 20, 2026'} />
    <section className="section legal-section">
      <div className="container-wide legal-layout">
        <aside className="legal-summary">
          <p className="eyebrow">{es ? 'Uso responsable' : 'Responsible use'}</p>
          <h2>{es ? 'Información clara. Expectativas claras.' : 'Clear information. Clear expectations.'}</h2>
          <p>{es ? 'Al usar este sitio, acepta estos términos. Si no está de acuerdo, no use el sitio ni envíe formularios.' : 'By using this site, you agree to these terms. If you do not agree, do not use the site or submit forms.'}</p>
        </aside>
        <div className="legal-copy">
          <h2>{es ? 'Finalidad del sitio' : 'Purpose of the site'}</h2>
          <p>{es ? 'Este sitio ofrece información general sobre BZ Resources, servicios laborales, recursos, oficinas y formas de contacto. La información puede cambiar y no constituye asesoría legal, fiscal, profesional ni de empleo.' : 'This site provides general information about BZ Resources, workforce services, resources, offices, and ways to make contact. Information may change and does not constitute legal, tax, professional, or employment advice.'}</p>
          <h2>{es ? 'Solicitudes y oportunidades laborales' : 'Applications and employment opportunities'}</h2>
          <p>{es ? 'Enviar un formulario, currículum o consulta no garantiza entrevista, colocación, oferta, duración de asignación ni empleo. La elegibilidad y las decisiones dependen de necesidades comerciales, calificaciones, verificaciones permitidas y requisitos aplicables. Proporcione información precisa y no incluya datos sensibles que el formulario no solicite.' : 'Submitting a form, résumé, or inquiry does not guarantee an interview, placement, offer, assignment duration, or employment. Eligibility and decisions depend on business needs, qualifications, permitted screening, and applicable requirements. Provide accurate information and do not include sensitive data the form does not request.'}</p>
          <h2>{es ? 'Uso aceptable' : 'Acceptable use'}</h2>
          <p>{es ? 'No debe intentar interferir con el sitio, evadir controles de seguridad, enviar contenido ilícito o engañoso, introducir código malicioso, recopilar datos sin autorización ni usar el sitio para perjudicar a BZ Resources, sus clientes, candidatos o terceros.' : 'You may not attempt to interfere with the site, bypass security controls, submit unlawful or deceptive content, introduce malicious code, collect data without authorization, or use the site to harm BZ Resources, its clients, candidates, or others.'}</p>
          <h2>{es ? 'Propiedad intelectual' : 'Intellectual property'}</h2>
          <p>{es ? 'El contenido, la marca, el diseño, los textos y los materiales del sitio pertenecen a BZ Resources o se usan con permiso. Puede verlos para fines personales y legítimos, pero no copiarlos, venderlos, publicarlos ni crear obras derivadas sin autorización escrita.' : 'Site content, branding, design, text, and materials belong to BZ Resources or are used with permission. You may view them for personal, legitimate purposes, but may not copy, sell, publish, or create derivative works without written authorization.'}</p>
          <h2>{es ? 'Servicios y enlaces de terceros' : 'Third-party services and links'}</h2>
          <p>{es ? 'El sitio puede enlazar a servicios externos de verificación, firma de documentos y redes sociales. BZ Resources no controla sus sitios, disponibilidad, seguridad ni prácticas. El uso de esos servicios está sujeto a sus propios términos y políticas.' : 'The site may link to external verification, document-signing, and social-media services. BZ Resources does not control their sites, availability, security, or practices. Use of those services is governed by their own terms and policies.'}</p>
          <h2>{es ? 'Disponibilidad y limitación' : 'Availability and limitation'}</h2>
          <p>{es ? 'Trabajamos para mantener el sitio preciso, seguro y disponible, pero se ofrece “tal cual” y “según disponibilidad” en la medida permitida por la ley. No garantizamos funcionamiento ininterrumpido ni ausencia de errores. En la medida permitida por la ley, BZ Resources no será responsable por daños indirectos o consecuentes derivados del uso del sitio.' : 'We work to keep the site accurate, secure, and available, but it is provided “as is” and “as available” to the extent permitted by law. We do not guarantee uninterrupted or error-free operation. To the extent permitted by law, BZ Resources will not be liable for indirect or consequential damages arising from site use.'}</p>
          <h2>{es ? 'Ley aplicable y cambios' : 'Governing law and changes'}</h2>
          <p>{es ? 'Estos términos se rigen por las leyes aplicables del Estado de Florida y de los Estados Unidos, sin perjuicio de derechos obligatorios que puedan aplicar en su ubicación. Podemos actualizar los términos; continuar usando el sitio después de una actualización constituye aceptación de la versión revisada.' : 'These terms are governed by applicable laws of the State of Florida and the United States, without limiting mandatory rights that may apply where you live. We may update these terms; continued site use after an update constitutes acceptance of the revised version.'}</p>
          <h2>{es ? 'Contacto' : 'Contact'}</h2>
          <p>{es ? 'Para preguntas sobre estos términos, escriba a ' : 'For questions about these terms, email '}<a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
        </div>
      </div>
    </section>
  </>
}
