import payrollImage from '../assets/generated/payroll'
import recruitmentImage from '../assets/generated/recruitment'
import screeningImage from '../assets/generated/screening'
import trackingImage from '../assets/generated/tracking'
import trainingImage from '../assets/generated/training'
import workersCompImage from '../assets/generated/workers-comp'
import type { ResponsiveImageSource } from '../components/ResponsiveImage'

export const serviceSlugs = ['recruiting', 'screening', 'training', 'tracking', 'payroll', 'workers-comp'] as const
export type ServiceSlug = (typeof serviceSlugs)[number]

export type Service = {
  slug: ServiceSlug
  title: string
  titleEs: string
  image: ResponsiveImageSource
  alt: string
  altEs: string
  description: string
  descriptionEs: string
  employerHelp: string
  employerHelpEs: string
}

export const services: Service[] = [
  {
    slug: 'recruiting',
    title: 'Recruiting',
    titleEs: 'Reclutamiento',
    image: recruitmentImage,
    alt: 'Recruitment professional greeting a candidate',
    altEs: 'Profesionales saludándose durante un proceso de reclutamiento',
    description:
      'BZ Resources matches top-tier talent with each company culture and role requirement. The team searches for candidates who align with business needs so placements can support the organization from the start.',
    descriptionEs:
      'BZ Resources busca y conecta talento con la cultura, los requisitos y los objetivos de cada organización. La búsqueda se adapta al puesto real, no a una descripción genérica.',
    employerHelp:
      'A focused search reduces time spent sorting through unqualified applicants and gives hiring teams a clearer shortlist.',
    employerHelpEs:
      'Una búsqueda enfocada reduce el tiempo revisando candidatos no calificados y ofrece una lista más clara al equipo de contratación.',
  },
  {
    slug: 'screening',
    title: 'Screening',
    titleEs: 'Evaluación',
    image: screeningImage,
    alt: 'Professional candidates prepared for screening',
    altEs: 'Candidatos profesionales preparados para evaluación',
    description:
      'The screening process helps save time by assessing qualifications, skills, and fit before candidates are presented. Employers receive a refined selection of people suited to the role and company values.',
    descriptionEs:
      'El proceso de evaluación revisa calificaciones, habilidades, experiencia y compatibilidad antes de presentar candidatos. Los empleadores reciben una selección mejor preparada para el puesto.',
    employerHelp:
      'Early qualification and verification help protect interview time and improve confidence in every candidate conversation.',
    employerHelpEs:
      'La evaluación y verificación tempranas protegen el tiempo de entrevistas y aumentan la confianza en cada conversación.',
  },
  {
    slug: 'training',
    title: 'Training',
    titleEs: 'Capacitación',
    image: trainingImage,
    alt: 'Workplace training presentation',
    altEs: 'Presentación de capacitación en el lugar de trabajo',
    description:
      'Training solutions support onboarding and skill development so employees can become productive, confident, and ready to contribute to a stronger team.',
    descriptionEs:
      'Las soluciones de capacitación apoyan la incorporación y el desarrollo de habilidades para que los empleados comiencen preparados y con mayor confianza.',
    employerHelp:
      'Better-prepared employees can contribute sooner, understand expectations and settle into the assignment with less friction.',
    employerHelpEs:
      'Los empleados mejor preparados pueden contribuir antes, entender expectativas e integrarse con menos fricción.',
  },
  {
    slug: 'tracking',
    title: 'Tracking',
    titleEs: 'Seguimiento',
    image: trackingImage,
    alt: 'Business professional managing workforce tracking',
    altEs: 'Profesional administrando el seguimiento laboral',
    description:
      'Tracking support gives employers insight into recruiting and HR activity, helping teams monitor candidate progress, streamline communication, and make informed decisions.',
    descriptionEs:
      'El seguimiento mantiene visibles el progreso de candidatos, la comunicación y la actividad laboral para ayudar a los equipos a tomar decisiones informadas.',
    employerHelp:
      'Clear status updates and follow-through reduce missed details and keep managers informed from placement onward.',
    employerHelpEs:
      'Las actualizaciones claras reducen detalles perdidos y mantienen informados a los gerentes desde la colocación.',
  },
  {
    slug: 'payroll',
    title: 'Payroll',
    titleEs: 'Nómina',
    image: payrollImage,
    alt: 'Payroll calculations and financial paperwork',
    altEs: 'Cálculos de nómina y documentación financiera',
    description:
      'Payroll service helps manage processing, tax compliance, and timely payments so employers can focus on core business activity while employees receive dependable support.',
    descriptionEs:
      'El servicio de nómina ayuda a administrar procesamiento, cumplimiento y pagos puntuales para que empleadores y trabajadores tengan apoyo confiable.',
    employerHelp:
      'Dependable administration frees internal teams to focus on the operation while essential employee processes keep moving.',
    employerHelpEs:
      'La administración confiable permite que los equipos internos se enfoquen en la operación mientras los procesos esenciales continúan.',
  },
  {
    slug: 'workers-comp',
    title: "Workers' Comp",
    titleEs: 'Compensación Laboral',
    image: workersCompImage,
    alt: 'Safety helmet representing workers compensation',
    altEs: 'Trabajadores con equipo de seguridad',
    description:
      'Workers compensation support helps protect employees and the business in the event of workplace injuries, giving teams more peace of mind while they do their work.',
    descriptionEs:
      'El apoyo de compensación laboral ayuda a proteger a empleados y empresas cuando ocurren lesiones en el trabajo y coordina los próximos pasos necesarios.',
    employerHelp:
      'Coordinated workforce risk support gives employers a clearer process when an incident needs attention.',
    employerHelpEs:
      'El apoyo coordinado de riesgos ofrece a empleadores un proceso más claro cuando un incidente requiere atención.',
  },
]

export const getServiceBySlug = (slug: string | undefined) => services.find((service) => service.slug === slug)
export const getServicePath = (service: Pick<Service, 'slug'>) => `/services/${service.slug}`
