import type { Language } from '../context/language'
import type { ServiceSlug } from './services'

export type ServicePageLocale = {
  metaTitle: string
  metaDescription: string
  hero: {
    eyebrow: string
    title: string
    intro: string
    meta: string
  }
  overview: {
    eyebrow: string
    title: string
    paragraphs: string[]
    caption: string
  }
  includes: {
    eyebrow: string
    title: string
    text: string
    items: [string, string][]
  }
  employer: {
    eyebrow: string
    title: string
    text: string
    points: string[]
  }
  process: {
    eyebrow: string
    title: string
    text: string
    steps: [string, string][]
  }
  related: {
    eyebrow: string
    title: string
    linkLabel: string
  }
  cta: [string, string, string, string]
}

type ServicePageContent = Record<Language, ServicePageLocale>

export const relatedServices: Record<ServiceSlug, ServiceSlug[]> = {
  recruiting: ['screening', 'training', 'payroll'],
  screening: ['recruiting', 'training', 'tracking'],
  training: ['recruiting', 'tracking', 'payroll'],
  tracking: ['training', 'payroll', 'workers-comp'],
  payroll: ['recruiting', 'tracking', 'workers-comp'],
  'workers-comp': ['training', 'tracking', 'payroll'],
}

export const servicePageContent: Record<ServiceSlug, ServicePageContent> = {
  recruiting: {
    en: {
      metaTitle: 'Recruiting Services | BZ Resources',
      metaDescription: 'Recruiting support from BZ Resources helps employers define staffing needs, source qualified candidates and coordinate placement with clear communication.',
      hero: {
        eyebrow: 'Recruiting services',
        title: 'A focused search begins with a clear understanding of the work.',
        intro: 'BZ Resources connects recruiting activity to the actual role, workplace and priorities behind every staffing need.',
        meta: 'Candidate search • Placement support',
      },
      overview: {
        eyebrow: 'A practical recruiting partner',
        title: 'Find people who align with the role and the operation around it.',
        paragraphs: [
          'A strong recruiting process starts before the search. BZ Resources learns how the position works, what experience matters, when the need must be filled and what the employer expects from the placement.',
          'That context guides candidate sourcing and communication. Employers receive a more focused selection, while candidates receive clearer information about the opportunity and what comes next.',
        ],
        caption: 'Recruiting shaped around the position, environment and timeline.',
      },
      includes: {
        eyebrow: 'What recruiting includes',
        title: 'The details that keep a candidate search focused.',
        text: 'Each search is organized around the employer’s stated requirements and the practical realities of the assignment.',
        items: [
          ['A clearer staffing brief', 'The role, workplace, priorities, schedule and timing create the foundation for the search.'],
          ['Candidate sourcing', 'BZ Resources looks for qualified people whose experience connects with the employer’s stated need.'],
          ['Experience and role alignment', 'Candidate backgrounds are considered in relation to the position and working environment.'],
          ['Recruiting communication', 'Employers and candidates have a clear point of contact as the search moves toward placement.'],
        ],
      },
      employer: {
        eyebrow: 'How it helps employers',
        title: 'Less time sorting. More attention on qualified conversations.',
        text: 'A focused search helps hiring teams spend their time on candidates who better reflect the role requirements already discussed.',
        points: ['A clearer shortlist built around the real position', 'Consistent context from the first conversation through placement', 'A responsive contact for timing, questions and next steps'],
      },
      process: {
        eyebrow: 'The BZ approach',
        title: 'Listen, focus and stay connected.',
        text: 'Recruiting is treated as the beginning of the workforce relationship—not a handoff that ends when a candidate is identified.',
        steps: [
          ['Understand the need', 'BZ Resources learns the position, team environment, priorities and desired timeline.'],
          ['Focus the search', 'Candidate sourcing and review stay connected to the requirements the employer has defined.'],
          ['Coordinate placement', 'Communication continues as the employer and candidate move through decisions and next steps.'],
        ],
      },
      related: { eyebrow: 'Continue exploring', title: 'Related Services', linkLabel: 'View service' },
      cta: ['Start a focused search', 'Tell us about the role your team needs to fill.', 'A useful recruiting conversation begins with the work, timeline and people involved.', 'Talk With Our Team'],
    },
    es: {
      metaTitle: 'Servicios de Reclutamiento | BZ Resources',
      metaDescription: 'BZ Resources ayuda a empleadores a definir sus necesidades, buscar candidatos calificados y coordinar la colocación con comunicación clara.',
      hero: {
        eyebrow: 'Servicios de reclutamiento',
        title: 'Una búsqueda enfocada comienza con una comprensión clara del trabajo.',
        intro: 'BZ Resources conecta el reclutamiento con el puesto real, el ambiente laboral y las prioridades detrás de cada necesidad de personal.',
        meta: 'Búsqueda de candidatos • Apoyo de colocación',
      },
      overview: {
        eyebrow: 'Un socio práctico de reclutamiento',
        title: 'Encuentre personas que se alineen con el puesto y la operación.',
        paragraphs: [
          'Un proceso sólido comienza antes de la búsqueda. BZ Resources conoce cómo funciona el puesto, qué experiencia importa, cuándo debe cubrirse y qué espera el empleador de la colocación.',
          'Ese contexto guía la búsqueda y la comunicación. Los empleadores reciben una selección más enfocada y los candidatos entienden mejor la oportunidad y los próximos pasos.',
        ],
        caption: 'Reclutamiento adaptado al puesto, ambiente y plazo.',
      },
      includes: {
        eyebrow: 'Qué incluye el reclutamiento',
        title: 'Los detalles que mantienen enfocada la búsqueda.',
        text: 'Cada búsqueda se organiza alrededor de los requisitos indicados por el empleador y la realidad práctica de la asignación.',
        items: [
          ['Una necesidad más clara', 'El puesto, ambiente, prioridades, horario y plazo forman la base de la búsqueda.'],
          ['Búsqueda de candidatos', 'BZ Resources busca personas calificadas cuya experiencia se conecte con la necesidad indicada.'],
          ['Alineación de experiencia', 'La experiencia se considera en relación con el puesto y su ambiente de trabajo.'],
          ['Comunicación de reclutamiento', 'Empleadores y candidatos tienen un contacto claro mientras el proceso avanza.'],
        ],
      },
      employer: {
        eyebrow: 'Cómo ayuda a empleadores',
        title: 'Menos tiempo clasificando. Más atención en conversaciones calificadas.',
        text: 'Una búsqueda enfocada ayuda al equipo de contratación a dedicar tiempo a candidatos que reflejan mejor los requisitos ya establecidos.',
        points: ['Una selección más clara basada en el puesto real', 'Contexto consistente desde la primera conversación hasta la colocación', 'Un contacto receptivo para plazos, preguntas y próximos pasos'],
      },
      process: {
        eyebrow: 'El enfoque de BZ',
        title: 'Escuchar, enfocar y mantenerse conectado.',
        text: 'El reclutamiento es el comienzo de la relación laboral, no un traspaso que termina al identificar un candidato.',
        steps: [
          ['Entender la necesidad', 'BZ Resources conoce el puesto, el equipo, las prioridades y el plazo deseado.'],
          ['Enfocar la búsqueda', 'La búsqueda y revisión permanecen conectadas con los requisitos del empleador.'],
          ['Coordinar la colocación', 'La comunicación continúa mientras el empleador y el candidato avanzan.'],
        ],
      },
      related: { eyebrow: 'Continúe explorando', title: 'Servicios Relacionados', linkLabel: 'Ver servicio' },
      cta: ['Inicie una búsqueda enfocada', 'Cuéntenos sobre el puesto que necesita cubrir.', 'Una conversación útil comienza con el trabajo, el plazo y las personas involucradas.', 'Hable con Nuestro Equipo'],
    },
  },
  screening: {
    en: {
      metaTitle: 'Screening Services | BZ Resources',
      metaDescription: 'BZ Resources reviews candidate qualifications, experience and role alignment to help employers make more informed staffing decisions.',
      hero: {
        eyebrow: 'Screening services',
        title: 'Candidate review connected to the requirements of the position.',
        intro: 'BZ Resources helps employers move from a broad applicant pool toward people whose qualifications and experience better fit the stated need.',
        meta: 'Qualifications • Experience • Role alignment',
      },
      overview: {
        eyebrow: 'A more useful candidate review',
        title: 'Bring the right criteria into the conversation early.',
        paragraphs: [
          'Screening is most useful when it reflects the real position. BZ Resources reviews the qualifications, experience and skills employers identify as important before candidates are presented.',
          'The goal is a clearer staffing decision—not a generic checklist. Candidate information stays connected to the job requirements, workplace and expectations already shared by the employer.',
        ],
        caption: 'Candidate evaluation grounded in the needs of the role.',
      },
      includes: {
        eyebrow: 'What screening includes',
        title: 'A consistent review before the employer conversation.',
        text: 'The screening approach is shaped around the position and the information confirmed for that search.',
        items: [
          ['Candidate evaluation', 'Applicant information is considered against the employer’s stated priorities for the role.'],
          ['Qualifications review', 'Relevant qualifications and experience are reviewed before candidates move forward.'],
          ['Skill and role matching', 'Skills are considered in the context of the assignment rather than as isolated keywords.'],
          ['Clear candidate presentation', 'Employers receive a more refined selection with useful context for the next conversation.'],
        ],
      },
      employer: {
        eyebrow: 'How it helps employers',
        title: 'Protect interview time with a more focused candidate pool.',
        text: 'Early review helps hiring teams direct attention toward people whose backgrounds more closely reflect the needs they have already defined.',
        points: ['Qualifications and experience considered before presentation', 'Candidate context tied to the actual role', 'More informed conversations and staffing decisions'],
      },
      process: {
        eyebrow: 'The BZ approach',
        title: 'Define, review and clarify.',
        text: 'Screening remains practical and position-specific, with communication available when criteria or priorities change.',
        steps: [
          ['Define the criteria', 'The employer’s requirements, environment and priorities guide what matters in the review.'],
          ['Review the candidate', 'Qualifications, experience and relevant skills are considered against that criteria.'],
          ['Share a clearer selection', 'Candidate information moves forward with context that supports the employer’s decision.'],
        ],
      },
      related: { eyebrow: 'Continue exploring', title: 'Related Services', linkLabel: 'View service' },
      cta: ['Make candidate review more useful', 'Start with the criteria that matter to your team.', 'Tell BZ Resources about the position, experience and working environment behind your search.', 'Talk With Our Team'],
    },
    es: {
      metaTitle: 'Servicios de Evaluación | BZ Resources',
      metaDescription: 'BZ Resources revisa calificaciones, experiencia y alineación con el puesto para apoyar decisiones de personal más informadas.',
      hero: {
        eyebrow: 'Servicios de evaluación',
        title: 'Revisión de candidatos conectada con los requisitos del puesto.',
        intro: 'BZ Resources ayuda a pasar de un grupo amplio de solicitantes a personas cuyas calificaciones y experiencia se ajustan mejor a la necesidad indicada.',
        meta: 'Calificaciones • Experiencia • Alineación',
      },
      overview: {
        eyebrow: 'Una revisión más útil',
        title: 'Incluya los criterios correctos desde el principio.',
        paragraphs: [
          'La evaluación es más útil cuando refleja el puesto real. BZ Resources revisa las calificaciones, experiencia y habilidades que el empleador identifica como importantes.',
          'El objetivo es apoyar una decisión más clara, no completar una lista genérica. La información permanece conectada con el puesto, ambiente y expectativas compartidas.',
        ],
        caption: 'Evaluación basada en las necesidades del puesto.',
      },
      includes: {
        eyebrow: 'Qué incluye la evaluación',
        title: 'Una revisión consistente antes de la conversación.',
        text: 'El enfoque se adapta al puesto y a la información confirmada para la búsqueda.',
        items: [
          ['Evaluación de candidatos', 'La información se considera según las prioridades indicadas por el empleador.'],
          ['Revisión de calificaciones', 'Las calificaciones y experiencia relevantes se revisan antes de avanzar.'],
          ['Alineación de habilidades', 'Las habilidades se consideran dentro del contexto de la asignación.'],
          ['Presentación clara', 'El empleador recibe una selección más enfocada con contexto para la próxima conversación.'],
        ],
      },
      employer: {
        eyebrow: 'Cómo ayuda a empleadores',
        title: 'Proteja el tiempo de entrevistas con candidatos más enfocados.',
        text: 'La revisión temprana ayuda al equipo a concentrarse en personas cuya experiencia refleja mejor las necesidades ya definidas.',
        points: ['Calificaciones y experiencia consideradas antes de presentar candidatos', 'Contexto conectado con el puesto real', 'Conversaciones y decisiones más informadas'],
      },
      process: {
        eyebrow: 'El enfoque de BZ',
        title: 'Definir, revisar y aclarar.',
        text: 'La evaluación se mantiene práctica y específica al puesto, con comunicación disponible cuando cambian los criterios.',
        steps: [
          ['Definir los criterios', 'Los requisitos, ambiente y prioridades guían la revisión.'],
          ['Revisar al candidato', 'Las calificaciones, experiencia y habilidades relevantes se consideran según esos criterios.'],
          ['Compartir una selección clara', 'La información avanza con contexto útil para la decisión del empleador.'],
        ],
      },
      related: { eyebrow: 'Continúe explorando', title: 'Servicios Relacionados', linkLabel: 'Ver servicio' },
      cta: ['Haga más útil la evaluación', 'Comience con los criterios importantes para su equipo.', 'Cuéntenos sobre el puesto, la experiencia y el ambiente detrás de su búsqueda.', 'Hable con Nuestro Equipo'],
    },
  },
  training: {
    en: {
      metaTitle: 'Training Services | BZ Resources',
      metaDescription: 'BZ Resources supports onboarding preparation, assignment expectations and workplace readiness so employers and employees can begin with greater clarity.',
      hero: {
        eyebrow: 'Training services',
        title: 'Help employees begin with clearer expectations and practical preparation.',
        intro: 'BZ Resources supports communication and readiness before placement so the employer and employee can start from shared information.',
        meta: 'Onboarding • Expectations • Readiness',
      },
      overview: {
        eyebrow: 'Preparation before the first day',
        title: 'A smoother start begins with useful information.',
        paragraphs: [
          'Every assignment has its own expectations. BZ Resources helps communicate the position, workplace information and onboarding direction employers have provided before an employee begins.',
          'Where applicable, preparation can also connect employees with role-specific information or training identified for the assignment. The focus is practical readiness and a clearer transition into the work.',
        ],
        caption: 'Workplace preparation connected to the assignment.',
      },
      includes: {
        eyebrow: 'What training support includes',
        title: 'Prepare the people and the information around the placement.',
        text: 'Support is shaped by the assignment and the expectations confirmed by the employer.',
        items: [
          ['Onboarding preparation', 'Employees receive direction about the steps and information needed before an assignment begins.'],
          ['Assignment expectations', 'The role, schedule, workplace and key expectations are communicated more clearly.'],
          ['Workplace and safety information', 'Relevant workplace or safety information supplied for the assignment can be reinforced before placement.'],
          ['Role-specific readiness', 'Where applicable, employees can be connected with preparation identified for the position.'],
        ],
      },
      employer: {
        eyebrow: 'How it helps employers',
        title: 'Give new team members a more organized starting point.',
        text: 'Clear expectations before placement can reduce avoidable confusion and help employees arrive with a better understanding of the assignment.',
        points: ['Onboarding details communicated before the start', 'Workplace expectations kept connected to the placement', 'A clear contact for questions and preparation'],
      },
      process: {
        eyebrow: 'The BZ approach',
        title: 'Align, prepare and support the start.',
        text: 'Preparation stays connected to the employer’s requirements and the practical information the employee needs.',
        steps: [
          ['Align on requirements', 'BZ Resources confirms the onboarding direction and assignment expectations supplied by the employer.'],
          ['Prepare the communication', 'Employees receive the relevant information and next steps before placement.'],
          ['Support the transition', 'Questions have a clear place to go as the employee moves into the assignment.'],
        ],
      },
      related: { eyebrow: 'Continue exploring', title: 'Related Services', linkLabel: 'View service' },
      cta: ['Prepare for a clearer start', 'Connect onboarding and assignment expectations before placement.', 'Talk with BZ Resources about the information and readiness your workforce needs.', 'Talk With Our Team'],
    },
    es: {
      metaTitle: 'Servicios de Capacitación | BZ Resources',
      metaDescription: 'BZ Resources apoya la preparación de incorporación, las expectativas de asignación y la disposición laboral para comenzar con mayor claridad.',
      hero: {
        eyebrow: 'Servicios de capacitación',
        title: 'Ayude a los empleados a comenzar con expectativas claras y preparación práctica.',
        intro: 'BZ Resources apoya la comunicación y preparación antes de la colocación para que empleador y empleado comiencen con información compartida.',
        meta: 'Incorporación • Expectativas • Preparación',
      },
      overview: {
        eyebrow: 'Preparación antes del primer día',
        title: 'Un mejor comienzo parte de información útil.',
        paragraphs: [
          'Cada asignación tiene sus propias expectativas. BZ Resources ayuda a comunicar el puesto, la información del lugar y la orientación indicada antes del inicio.',
          'Cuando corresponde, la preparación también puede conectar al empleado con información o capacitación específica identificada para la asignación.',
        ],
        caption: 'Preparación laboral conectada con la asignación.',
      },
      includes: {
        eyebrow: 'Qué incluye el apoyo',
        title: 'Prepare a las personas y la información alrededor de la colocación.',
        text: 'El apoyo se adapta a la asignación y a las expectativas confirmadas por el empleador.',
        items: [
          ['Preparación de incorporación', 'Los empleados reciben orientación sobre los pasos necesarios antes de comenzar.'],
          ['Expectativas de asignación', 'El puesto, horario, lugar y expectativas se comunican con mayor claridad.'],
          ['Información laboral y de seguridad', 'La información relevante indicada para la asignación puede reforzarse antes de la colocación.'],
          ['Preparación específica', 'Cuando corresponde, los empleados pueden conectarse con preparación identificada para el puesto.'],
        ],
      },
      employer: {
        eyebrow: 'Cómo ayuda a empleadores',
        title: 'Ofrezca a nuevos miembros un punto de partida más organizado.',
        text: 'Las expectativas claras antes de la colocación pueden reducir confusión y ayudar al empleado a entender mejor la asignación.',
        points: ['Detalles de incorporación comunicados antes del inicio', 'Expectativas conectadas con la colocación', 'Un contacto claro para preguntas y preparación'],
      },
      process: {
        eyebrow: 'El enfoque de BZ',
        title: 'Alinear, preparar y apoyar el comienzo.',
        text: 'La preparación permanece conectada con los requisitos del empleador y la información práctica que necesita el empleado.',
        steps: [
          ['Alinear los requisitos', 'BZ Resources confirma la orientación y expectativas indicadas por el empleador.'],
          ['Preparar la comunicación', 'Los empleados reciben información y próximos pasos antes de la colocación.'],
          ['Apoyar la transición', 'Las preguntas tienen un contacto claro al comenzar la asignación.'],
        ],
      },
      related: { eyebrow: 'Continúe explorando', title: 'Servicios Relacionados', linkLabel: 'Ver servicio' },
      cta: ['Prepárese para un comienzo claro', 'Conecte la incorporación y las expectativas antes de la colocación.', 'Hable con BZ Resources sobre la información y preparación que necesita su personal.', 'Hable con Nuestro Equipo'],
    },
  },
  tracking: {
    en: {
      metaTitle: 'Tracking Services | BZ Resources',
      metaDescription: 'BZ Resources provides ongoing assignment communication, employee status coordination and workforce follow-through for employers.',
      hero: {
        eyebrow: 'Tracking services',
        title: 'Keep workforce communication connected after placement begins.',
        intro: 'BZ Resources supports ongoing assignment visibility, employee status communication and the practical follow-through employers need.',
        meta: 'Status • Communication • Coordination',
      },
      overview: {
        eyebrow: 'Ongoing workforce support',
        title: 'Placement is a starting point, not the end of the relationship.',
        paragraphs: [
          'Workforce needs continue after an employee starts. BZ Resources helps keep assignment communication, employee status and relevant administrative details visible to the people who need them.',
          'A consistent point of contact gives employers and employees a clearer place to raise questions, share changes and coordinate next steps as the work continues.',
        ],
        caption: 'Clearer status and communication throughout the assignment.',
      },
      includes: {
        eyebrow: 'What tracking support includes',
        title: 'Practical visibility for an active workforce.',
        text: 'The level of tracking and administration reflects the assignment and the workforce support arranged with the employer.',
        items: [
          ['Assignment communication', 'Relevant updates can move through a consistent contact instead of becoming disconnected.'],
          ['Employee status coordination', 'Employers have a clearer way to stay informed about active workforce details.'],
          ['Workforce administration', 'Time or workforce information can stay connected where it forms part of the arranged support.'],
          ['Employer follow-through', 'Questions and changing needs have a responsive place to go after placement.'],
        ],
      },
      employer: {
        eyebrow: 'How it helps employers',
        title: 'Reduce missed details with clearer ongoing communication.',
        text: 'Consistent follow-through helps managers stay closer to workforce activity without rebuilding context every time something changes.',
        points: ['A clear contact after placement begins', 'More visible assignment and employee-status communication', 'Administrative details kept connected where applicable'],
      },
      process: {
        eyebrow: 'The BZ approach',
        title: 'Establish, communicate and follow through.',
        text: 'Tracking support is built around useful communication, not unnecessary complexity.',
        steps: [
          ['Establish the rhythm', 'BZ Resources aligns on the assignment information and communication the employer needs.'],
          ['Keep status visible', 'Relevant updates and questions move through a consistent point of contact.'],
          ['Follow through', 'Changing workforce needs receive practical coordination as the assignment continues.'],
        ],
      },
      related: { eyebrow: 'Continue exploring', title: 'Related Services', linkLabel: 'View service' },
      cta: ['Keep workforce details connected', 'Bring clearer follow-through to active assignments.', 'Talk with BZ Resources about the status, communication and administration your team needs.', 'Talk With Our Team'],
    },
    es: {
      metaTitle: 'Servicios de Seguimiento | BZ Resources',
      metaDescription: 'BZ Resources ofrece comunicación continua, coordinación del estado de empleados y seguimiento laboral para empleadores.',
      hero: {
        eyebrow: 'Servicios de seguimiento',
        title: 'Mantenga conectada la comunicación después de la colocación.',
        intro: 'BZ Resources apoya la visibilidad de asignaciones, la comunicación del estado del empleado y el seguimiento práctico.',
        meta: 'Estado • Comunicación • Coordinación',
      },
      overview: {
        eyebrow: 'Apoyo laboral continuo',
        title: 'La colocación es un punto de partida, no el final de la relación.',
        paragraphs: [
          'Las necesidades continúan después de que un empleado comienza. BZ Resources ayuda a mantener visibles la comunicación, el estado y los detalles administrativos relevantes.',
          'Un contacto consistente ofrece a empleadores y empleados un lugar claro para preguntas, cambios y próximos pasos.',
        ],
        caption: 'Estado y comunicación más claros durante la asignación.',
      },
      includes: {
        eyebrow: 'Qué incluye el seguimiento',
        title: 'Visibilidad práctica para una fuerza laboral activa.',
        text: 'El nivel de seguimiento y administración refleja la asignación y el apoyo acordado con el empleador.',
        items: [
          ['Comunicación de asignación', 'Las actualizaciones pueden mantenerse conectadas mediante un contacto consistente.'],
          ['Coordinación del estado', 'Los empleadores tienen una forma más clara de mantenerse informados.'],
          ['Administración laboral', 'La información de tiempo o personal puede mantenerse conectada cuando forma parte del apoyo.'],
          ['Seguimiento al empleador', 'Las preguntas y necesidades cambiantes tienen un lugar receptivo después de la colocación.'],
        ],
      },
      employer: {
        eyebrow: 'Cómo ayuda a empleadores',
        title: 'Reduzca detalles perdidos con comunicación continua.',
        text: 'El seguimiento consistente ayuda a los gerentes a mantenerse cerca de la actividad sin reconstruir el contexto cada vez.',
        points: ['Un contacto claro después de la colocación', 'Mayor visibilidad de asignaciones y estado', 'Detalles administrativos conectados cuando corresponde'],
      },
      process: {
        eyebrow: 'El enfoque de BZ',
        title: 'Establecer, comunicar y dar seguimiento.',
        text: 'El seguimiento se construye alrededor de comunicación útil, sin complejidad innecesaria.',
        steps: [
          ['Establecer el ritmo', 'BZ Resources alinea la información y comunicación que necesita el empleador.'],
          ['Mantener el estado visible', 'Las actualizaciones y preguntas pasan por un contacto consistente.'],
          ['Dar seguimiento', 'Las necesidades cambiantes reciben coordinación práctica durante la asignación.'],
        ],
      },
      related: { eyebrow: 'Continúe explorando', title: 'Servicios Relacionados', linkLabel: 'Ver servicio' },
      cta: ['Mantenga conectados los detalles', 'Lleve seguimiento más claro a sus asignaciones activas.', 'Hable con BZ Resources sobre el estado, comunicación y administración que necesita.', 'Hable con Nuestro Equipo'],
    },
  },
  payroll: {
    en: {
      metaTitle: 'Payroll Services | BZ Resources',
      metaDescription: 'BZ Resources provides payroll processing and workforce administration support that keeps essential employee details moving.',
      hero: {
        eyebrow: 'Payroll services',
        title: 'Payroll support connected to the workforce behind the details.',
        intro: 'BZ Resources helps employers coordinate payroll processing and related workforce administration through one responsive relationship.',
        meta: 'Processing • Communication • Administration',
      },
      overview: {
        eyebrow: 'Dependable workforce administration',
        title: 'Keep essential payroll details organized and moving.',
        paragraphs: [
          'Payroll is part of the day-to-day employee experience. BZ Resources supports processing and the practical communication around payroll so employers can keep attention on the operation.',
          'When payroll is connected with staffing and tracking support, relevant workforce information has a clearer path from the assignment to the administrative process.',
        ],
        caption: 'Payroll and workforce information supported through one relationship.',
      },
      includes: {
        eyebrow: 'What payroll support includes',
        title: 'Administration grounded in active workforce needs.',
        text: 'The exact support reflects the employer arrangement and the workforce services BZ Resources is providing.',
        items: [
          ['Payroll processing support', 'Essential processing activity is coordinated as part of the workforce relationship.'],
          ['Workforce information', 'Relevant employee and assignment details can stay connected to payroll administration.'],
          ['Payroll communication', 'Employers and employees have a clear place for appropriate payroll questions and next steps.'],
          ['Connected administration', 'Payroll can work alongside tracking and ongoing workforce support instead of standing alone.'],
        ],
      },
      employer: {
        eyebrow: 'How it helps employers',
        title: 'Keep internal attention on the work while essential processes continue.',
        text: 'A responsive payroll and workforce contact helps reduce disconnected administration and keeps questions moving toward the right next step.',
        points: ['Processing support connected to the active workforce', 'Clearer communication around appropriate payroll matters', 'Continuity with tracking and workforce administration'],
      },
      process: {
        eyebrow: 'The BZ approach',
        title: 'Organize, coordinate and remain available.',
        text: 'Payroll support is treated as part of the broader workforce relationship, with context carried forward from the assignment.',
        steps: [
          ['Organize the inputs', 'Relevant workforce and assignment information is coordinated for the arranged payroll support.'],
          ['Support processing', 'Payroll activity moves through the established administrative process.'],
          ['Remain responsive', 'Appropriate questions and changes have a clear place to go as the work continues.'],
        ],
      },
      related: { eyebrow: 'Continue exploring', title: 'Related Services', linkLabel: 'View service' },
      cta: ['Connect payroll with workforce support', 'Bring essential administration into one responsive relationship.', 'Tell BZ Resources about the workforce and payroll support your operation needs.', 'Talk With Our Team'],
    },
    es: {
      metaTitle: 'Servicios de Nómina | BZ Resources',
      metaDescription: 'BZ Resources ofrece apoyo de procesamiento de nómina y administración laboral para mantener en movimiento los detalles esenciales.',
      hero: {
        eyebrow: 'Servicios de nómina',
        title: 'Apoyo de nómina conectado con las personas detrás de los detalles.',
        intro: 'BZ Resources ayuda a coordinar el procesamiento de nómina y la administración laboral mediante una relación receptiva.',
        meta: 'Procesamiento • Comunicación • Administración',
      },
      overview: {
        eyebrow: 'Administración laboral confiable',
        title: 'Mantenga organizados y en movimiento los detalles esenciales.',
        paragraphs: [
          'La nómina forma parte de la experiencia diaria del empleado. BZ Resources apoya el procesamiento y la comunicación práctica para que el empleador mantenga su atención en la operación.',
          'Cuando la nómina se conecta con el personal y seguimiento, la información tiene un camino más claro desde la asignación hasta la administración.',
        ],
        caption: 'Nómina e información laboral apoyadas mediante una sola relación.',
      },
      includes: {
        eyebrow: 'Qué incluye el apoyo de nómina',
        title: 'Administración basada en necesidades laborales activas.',
        text: 'El apoyo exacto refleja el acuerdo con el empleador y los servicios laborales que proporciona BZ Resources.',
        items: [
          ['Apoyo de procesamiento', 'La actividad esencial se coordina como parte de la relación laboral.'],
          ['Información laboral', 'Los detalles relevantes del empleado y asignación pueden mantenerse conectados.'],
          ['Comunicación de nómina', 'Empleadores y empleados tienen un lugar claro para preguntas apropiadas y próximos pasos.'],
          ['Administración conectada', 'La nómina puede trabajar junto con seguimiento y apoyo continuo.'],
        ],
      },
      employer: {
        eyebrow: 'Cómo ayuda a empleadores',
        title: 'Mantenga la atención interna en el trabajo mientras continúan procesos esenciales.',
        text: 'Un contacto receptivo ayuda a reducir administración desconectada y dirige las preguntas al próximo paso correcto.',
        points: ['Procesamiento conectado con la fuerza laboral activa', 'Comunicación más clara sobre asuntos apropiados de nómina', 'Continuidad con seguimiento y administración laboral'],
      },
      process: {
        eyebrow: 'El enfoque de BZ',
        title: 'Organizar, coordinar y permanecer disponible.',
        text: 'La nómina se trata como parte de la relación laboral, manteniendo el contexto de la asignación.',
        steps: [
          ['Organizar la información', 'La información relevante se coordina para el apoyo de nómina acordado.'],
          ['Apoyar el procesamiento', 'La actividad avanza mediante el proceso administrativo establecido.'],
          ['Permanecer receptivo', 'Las preguntas y cambios apropiados tienen un lugar claro mientras continúa el trabajo.'],
        ],
      },
      related: { eyebrow: 'Continúe explorando', title: 'Servicios Relacionados', linkLabel: 'Ver servicio' },
      cta: ['Conecte la nómina con el apoyo laboral', 'Integre la administración esencial en una relación receptiva.', 'Cuéntenos sobre el apoyo laboral y de nómina que necesita su operación.', 'Hable con Nuestro Equipo'],
    },
  },
  'workers-comp': {
    en: {
      metaTitle: "Workers' Compensation | BZ Resources",
      metaDescription: "BZ Resources provides workforce communication and coordination that supports employers and employees when workplace safety or injury matters need attention.",
      hero: {
        eyebrow: "Workers' Compensation",
        title: 'Clear workforce coordination when workplace matters need attention.',
        intro: 'BZ Resources keeps communication and practical workforce follow-through connected when a workplace safety or injury matter affects an assignment.',
        meta: 'Communication • Coordination • Follow-through',
      },
      overview: {
        eyebrow: 'Workforce support with continuity',
        title: 'Give employers and employees a clear place to turn.',
        paragraphs: [
          'Workplace matters require timely, organized communication. BZ Resources supports the workforce relationship by helping employers and employees connect with the appropriate next steps when an assignment is affected.',
          'The exact support depends on the employer arrangement and assignment. The focus is clear communication, practical coordination and continuity with the broader workforce services already in place.',
        ],
        caption: 'Practical workforce communication centered on people and the assignment.',
      },
      includes: {
        eyebrow: 'What this support includes',
        title: 'Connected communication around workplace needs.',
        text: 'BZ Resources provides workforce coordination within the scope of the services arranged with the employer.',
        items: [
          ['Workplace expectations', 'Relevant expectations and workplace information can stay connected with onboarding and assignment support.'],
          ['Employee communication', 'Employees have a clearer contact when a workplace matter needs to be reported or discussed.'],
          ['Workforce coordination', 'Relevant information can move between the people responsible for the assignment and next steps.'],
          ['Employer follow-through', 'Employers have a responsive workforce contact as appropriate actions are coordinated.'],
        ],
      },
      employer: {
        eyebrow: 'How it helps employers',
        title: 'Keep communication organized when the situation is important.',
        text: 'A connected workforce relationship reduces uncertainty about where questions and relevant assignment information should go.',
        points: ['A clear workforce contact for appropriate communication', 'Continuity with assignment and employee information', 'Practical follow-through within the arranged workforce support'],
      },
      process: {
        eyebrow: 'The BZ approach',
        title: 'Prepare, communicate and coordinate.',
        text: 'Support stays grounded in the assignment, employer arrangement and information available to BZ Resources.',
        steps: [
          ['Prepare with clear expectations', 'Workplace and assignment information remains part of the employee’s preparation where applicable.'],
          ['Communicate promptly', 'Relevant workplace matters have a clear channel for appropriate reporting and discussion.'],
          ['Coordinate next steps', 'BZ Resources supports workforce follow-through with the employer and employee as appropriate.'],
        ],
      },
      related: { eyebrow: 'Continue exploring', title: 'Related Services', linkLabel: 'View service' },
      cta: ['Bring clarity to workforce support', 'Keep communication and follow-through connected.', 'Talk with BZ Resources about the workforce support appropriate for your operation.', 'Talk With Our Team'],
    },
    es: {
      metaTitle: 'Compensación Laboral | BZ Resources',
      metaDescription: 'BZ Resources ofrece comunicación y coordinación laboral cuando asuntos de seguridad o lesiones en el trabajo requieren atención.',
      hero: {
        eyebrow: 'Compensación Laboral',
        title: 'Coordinación clara cuando un asunto laboral necesita atención.',
        intro: 'BZ Resources mantiene conectadas la comunicación y el seguimiento práctico cuando un asunto de seguridad o lesión afecta una asignación.',
        meta: 'Comunicación • Coordinación • Seguimiento',
      },
      overview: {
        eyebrow: 'Apoyo laboral con continuidad',
        title: 'Ofrezca a empleadores y empleados un lugar claro donde acudir.',
        paragraphs: [
          'Los asuntos laborales requieren comunicación oportuna y organizada. BZ Resources apoya la relación ayudando a conectar a empleadores y empleados con los próximos pasos apropiados.',
          'El apoyo exacto depende del acuerdo con el empleador y la asignación. El enfoque es comunicación clara, coordinación práctica y continuidad con otros servicios laborales.',
        ],
        caption: 'Comunicación práctica centrada en las personas y la asignación.',
      },
      includes: {
        eyebrow: 'Qué incluye este apoyo',
        title: 'Comunicación conectada alrededor de necesidades laborales.',
        text: 'BZ Resources ofrece coordinación dentro del alcance de los servicios acordados con el empleador.',
        items: [
          ['Expectativas del lugar', 'La información relevante puede permanecer conectada con la incorporación y asignación.'],
          ['Comunicación con empleados', 'Los empleados tienen un contacto más claro cuando un asunto necesita reportarse o discutirse.'],
          ['Coordinación laboral', 'La información relevante puede pasar entre las personas responsables y los próximos pasos.'],
          ['Seguimiento al empleador', 'Los empleadores tienen un contacto receptivo mientras se coordinan acciones apropiadas.'],
        ],
      },
      employer: {
        eyebrow: 'Cómo ayuda a empleadores',
        title: 'Mantenga organizada la comunicación cuando la situación es importante.',
        text: 'Una relación conectada reduce incertidumbre sobre dónde deben dirigirse las preguntas y la información relevante.',
        points: ['Un contacto laboral claro para comunicación apropiada', 'Continuidad con la información de asignación y empleado', 'Seguimiento práctico dentro del apoyo laboral acordado'],
      },
      process: {
        eyebrow: 'El enfoque de BZ',
        title: 'Preparar, comunicar y coordinar.',
        text: 'El apoyo se basa en la asignación, el acuerdo con el empleador y la información disponible.',
        steps: [
          ['Preparar con expectativas claras', 'La información laboral forma parte de la preparación cuando corresponde.'],
          ['Comunicar oportunamente', 'Los asuntos relevantes tienen un canal claro para comunicación apropiada.'],
          ['Coordinar próximos pasos', 'BZ Resources apoya el seguimiento con el empleador y empleado cuando corresponde.'],
        ],
      },
      related: { eyebrow: 'Continúe explorando', title: 'Servicios Relacionados', linkLabel: 'Ver servicio' },
      cta: ['Lleve claridad al apoyo laboral', 'Mantenga conectados la comunicación y el seguimiento.', 'Hable con BZ Resources sobre el apoyo apropiado para su operación.', 'Hable con Nuestro Equipo'],
    },
  },
}
