import CallToAction from '../components/CallToAction'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'

const sections = [
  {
    title: 'Information Collection and Use',
    text: 'BZ Resources may request personally identifiable information such as address, contact, and fax information when needed to provide or improve services. Information provided is retained and used as described in this privacy policy.',
  },
  {
    title: 'Log Data',
    text: 'When an error occurs, data such as IP address, device name, operating system version, service configuration, usage time and date, and other statistics may be collected through third-party products.',
  },
  {
    title: 'Cookies',
    text: 'The service does not use cookies explicitly, but third-party code and libraries may use cookies to collect information and improve their services. Users may accept or refuse cookies through their browser controls.',
  },
  {
    title: 'Service Providers',
    text: 'Third-party companies and individuals may be employed to facilitate services, provide services on behalf of BZ Resources, perform service-related work, or help analyze how services are used.',
  },
  {
    title: 'Security',
    text: 'BZ Resources values trust in providing personal information and uses commercially acceptable means of protection. No internet transmission or electronic storage method is completely secure.',
  },
  {
    title: 'Links to Other Sites',
    text: 'This service may contain links to other sites. External sites are not operated by BZ Resources, so visitors should review the privacy policies of those websites.',
  },
  {
    title: 'Children’s Privacy',
    text: 'These services do not address anyone under the age of 13. BZ Resources does not knowingly collect personally identifiable information from children under 13.',
  },
  {
    title: 'Changes to This Privacy Policy',
    text: 'This privacy policy may be updated from time to time. Changes are effective immediately after they are posted on this page.',
  },
]

function PrivacyPolicyPage() {
  document.title = 'Privacy Policy | BZ Resources'
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', 'BZ Resources privacy policy.')

  return (
    <>
      <PageHero eyebrow="Privacy Policy" title="Privacy Policy" />

      <section className="section section-soft">
        <Reveal className="section-inner policy-content">
          <p>
            This page informs visitors about policies for the collection, use,
            and disclosure of Personal Information when using BZ Resources
            services.
          </p>
          <p>
            By using the service, visitors agree to the collection and use of
            information in relation to this policy. Personal Information is used
            for providing and improving the service and is not shared except as
            described here.
          </p>

          {sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </section>
          ))}

          <section>
            <h2>Contact Us</h2>
            <p>
              Questions or suggestions about this Privacy Policy can be sent
              through the BZ Resources contact page.
            </p>
          </section>
        </Reveal>
      </section>

      <CallToAction
        title="Questions about this policy?"
        text="Contact BZ Resources if you have a question or suggestion about how information is handled."
        linkLabel="Contact Us"
        to="/contact"
      />
    </>
  )
}

export default PrivacyPolicyPage
