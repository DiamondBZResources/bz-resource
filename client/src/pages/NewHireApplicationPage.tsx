import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import BotTrap from '../components/BotTrap'
import {
  CheckboxFieldset,
  QuestionnaireSection,
  RadioFieldset,
  ReviewGroup,
  StepProgress,
  TextAreaField,
  TextField,
} from '../components/QuestionnaireUI'
import { postJson } from '../lib/apiClient'

type Language = 'en' | 'es'

type ReferenceEntry = {
  name: string
  phone: string
  relationship: string
}

type EducationEntry = {
  address: string
  years: string
  school: string
  studies: string
}

type EmployerEntry = {
  address: string
  company: string
  endDate: string
  phone: string
  position: string
  reason: string
  responsibilities: string
  startDate: string
  supervisor: string
}

type NewHireState = {
  age18: string
  applicantSignature: string
  applicationDate: string
  availability: string[]
  availableDate: string
  city: string
  contactableByPhone: string
  desiredCompensation: string
  education: EducationEntry[]
  email: string
  employers: EmployerEntry[]
  firstName: string
  homePhone: string
  lastName: string
  middleInitial: string
  mobilePhone: string
  officeUseName: string
  orientationInitials: Record<string, string>
  policyAcknowledgments: string[]
  position: string
  previouslyWorked: string
  references: ReferenceEntry[]
  reliableTransportation: string
  safetyAnswers: Record<string, string>
  safetySignature: string
  secureDocumentsAcknowledged: string
  signatureDate: string
  skills: string[]
  state: string
  street: string
  textConsent: string
  unit: string
  workAuthorized: string
  zip: string
}

type SubmissionResponse = {
  message: string
  ok: boolean
}

const blankReference = (): ReferenceEntry => ({ name: '', phone: '', relationship: '' })
const blankEducation = (): EducationEntry => ({ address: '', years: '', school: '', studies: '' })
const blankEmployer = (): EmployerEntry => ({
  address: '',
  company: '',
  endDate: '',
  phone: '',
  position: '',
  reason: '',
  responsibilities: '',
  startDate: '',
  supervisor: '',
})

const initialState: NewHireState = {
  age18: '',
  applicantSignature: '',
  applicationDate: '',
  availability: [],
  availableDate: '',
  city: '',
  contactableByPhone: '',
  desiredCompensation: '',
  education: [blankEducation(), blankEducation()],
  email: '',
  employers: [blankEmployer(), blankEmployer(), blankEmployer(), blankEmployer()],
  firstName: '',
  homePhone: '',
  lastName: '',
  middleInitial: '',
  mobilePhone: '',
  officeUseName: '',
  orientationInitials: {},
  policyAcknowledgments: [],
  position: '',
  previouslyWorked: '',
  references: [blankReference(), blankReference()],
  reliableTransportation: '',
  safetyAnswers: {},
  safetySignature: '',
  secureDocumentsAcknowledged: '',
  signatureDate: '',
  skills: [],
  state: '',
  street: '',
  textConsent: '',
  unit: '',
  workAuthorized: '',
  zip: '',
}

const copy = {
  en: {
    title: 'New Hire Application',
    intro:
      'Complete the onboarding packet after BZ Resources has instructed you to do so. Sensitive identity, tax, medical, and banking documents are completed through the approved secure process.',
    steps: ['Orientation', 'Personal details', 'History & skills', 'Policies', 'Safety', 'Review'],
    back: 'Back',
    next: 'Continue',
    submit: 'Submit New Hire Packet',
    print: 'Print / Save PDF',
    required: 'Please complete the required information in this section.',
  },
  es: {
    title: 'Solicitud de Nuevo Empleado',
    intro:
      'Complete el paquete de orientación después de recibir instrucciones de BZ Resources. Los documentos confidenciales de identidad, impuestos, salud y banco se completan mediante el proceso seguro aprobado.',
    steps: ['Orientación', 'Información personal', 'Historial y destrezas', 'Políticas', 'Seguridad', 'Revisión'],
    back: 'Atrás',
    next: 'Continuar',
    submit: 'Enviar Paquete de Nuevo Empleado',
    print: 'Imprimir / Guardar PDF',
    required: 'Complete la información requerida en esta sección.',
  },
} as const

const orientationItems = {
  en: [
    'Employment application',
    'Skills sheet',
    'Policy and procedures checklist',
    'Attendance and sick policy',
    'Meal and rest periods',
    'Drug-free workplace policy',
    'Harassment, discrimination, and retaliation prevention policy',
    'Drug and alcohol testing authorization',
    'Background investigation authorization',
    'Job description, physical requirements, and essential functions',
    'Safety policy',
    'Safety orientation quiz',
    'Personal physician predesignation form',
    'Medical information release',
    'Conditional job offer documents',
    'Mutual arbitration agreement',
    'Form W-4',
    'Form I-9',
    'Wage notice',
    'ACA benefits offer',
  ],
  es: [
    'Solicitud de empleo',
    'Hoja de habilidades',
    'Lista de verificación de políticas y procedimientos',
    'Política de faltas y enfermedad',
    'Períodos de comida y descanso',
    'Política de empleo libre de drogas',
    'Política de prevención de acoso, discriminación y represalias',
    'Autorización para examen de alcohol y drogas',
    'Autorización de investigación de antecedentes',
    'Descripción del trabajo, requisitos físicos y funciones esenciales',
    'Política de seguridad',
    'Prueba de orientación de seguridad',
    'Formulario de predesignación de médico',
    'Autorización para revelar información médica',
    'Documentos de oferta de trabajo condicional',
    'Acuerdo mutuo de arbitraje',
    'Formulario W-4',
    'Formulario I-9',
    'Aviso de salario',
    'Oferta de beneficios ACA',
  ],
} as const

const policyItems = {
  en: [
    'I will immediately report workplace injuries to the client supervisor and BZ Resources and follow the directed treatment and reporting process.',
    'I understand that I must follow all safety rules, use required protective equipment, and report unsafe conditions before continuing work.',
    'I understand that I am employed by BZ Resources and must contact BZ Resources when an assignment ends or when I cannot report to work.',
    'I understand that absences or late arrivals must be reported as early as possible and according to the instructions provided for my assignment.',
    'I understand the timekeeping requirements and that accurate, timely documentation of hours worked is required for payroll processing.',
    'I will not use client phones, computers, internet access, or personal devices in a way prohibited by the assignment rules.',
    'I acknowledge the meal and rest-period policy and will promptly report any concern to BZ Resources.',
    'I acknowledge the drug-free workplace and harassment, discrimination, and retaliation prevention policies presented during orientation.',
  ],
  es: [
    'Reportaré inmediatamente las lesiones laborales al supervisor del cliente y a BZ Resources, y seguiré el proceso indicado de tratamiento y reporte.',
    'Entiendo que debo cumplir todas las reglas de seguridad, usar el equipo de protección requerido y reportar condiciones inseguras antes de continuar el trabajo.',
    'Entiendo que soy empleado/a de BZ Resources y debo comunicarme con BZ Resources cuando termine una asignación o cuando no pueda presentarme a trabajar.',
    'Entiendo que las ausencias o tardanzas deben reportarse lo antes posible y de acuerdo con las instrucciones de mi asignación.',
    'Entiendo los requisitos de registro de tiempo y que se requiere documentación precisa y oportuna de las horas trabajadas para procesar la nómina.',
    'No usaré los teléfonos, computadoras, acceso a internet o dispositivos personales de una manera prohibida por las reglas de la asignación.',
    'Reconozco la política de períodos de comida y descanso y reportaré de inmediato cualquier problema a BZ Resources.',
    'Reconozco las políticas de empleo libre de drogas y de prevención de acoso, discriminación y represalias presentadas durante la orientación.',
  ],
} as const

const skillGroups = {
  en: [
    { group: 'Certifications', options: ['CPR certified', 'First aid', 'ISO experience', 'Government security clearance'] },
    { group: 'Computer and shipping', options: ['Microsoft Excel', 'Microsoft Word', 'UPS shipping software', 'FedEx shipping software'] },
    { group: 'Construction and maintenance', options: ['Carpentry', 'Electrical', 'HVAC', 'Painting', 'Plumbing', 'Automotive mechanic', 'Facility maintenance'] },
    { group: 'Drivers', options: ['Commercial Class A', 'Non-commercial Class A', 'Class B', 'Class C', 'Delivery driving'] },
    { group: 'Electrical and assembly', options: ['Assembly', 'Blueprint reading', 'Circuit boards', 'Color codes', 'Wire stripping', 'Micrometers', 'Microscope', 'Schematics', 'Surface-mount soldering', 'Wire soldering'] },
    { group: 'Food service', options: ['Cooking', 'Dishwashing', 'Grill cooking', 'Food preparation', 'Fine dining service', 'Bar service'] },
    { group: 'Forklift and warehouse', options: ['Sit-down forklift', 'Stand-up forklift', 'Cherry picker', 'Reach forklift', 'Pallet jack', 'Cycle count', 'Inventory', 'Picking', 'Packing', 'Shipping and receiving', 'Stocking'] },
    { group: 'Production and machinery', options: ['Production line', 'Quality control', 'Inspection', 'CNC operator', 'CNC programmer', 'Machine operator', 'Machine setup', 'Drill press', 'Machinist', 'Lathe', 'Mill'] },
    { group: 'Management', options: ['Assistant', 'Shift lead', 'Supervisor', 'Manager'] },
  ],
  es: [
    { group: 'Certificaciones', options: ['CPR certificado', 'Primeros auxilios', 'Experiencia ISO', 'Autorización de seguridad gubernamental'] },
    { group: 'Computación y envíos', options: ['Microsoft Excel', 'Microsoft Word', 'Programa de envíos UPS', 'Programa de envíos FedEx'] },
    { group: 'Construcción y mantenimiento', options: ['Carpintería', 'Electricidad', 'Aire acondicionado y calefacción', 'Pintura', 'Plomería', 'Mecánica automotriz', 'Mantenimiento de instalaciones'] },
    { group: 'Conductores', options: ['Clase A comercial', 'Clase A no comercial', 'Clase B', 'Clase C', 'Entrega'] },
    { group: 'Electricidad y ensamblaje', options: ['Ensamblaje', 'Lectura de planos', 'Placas de circuito', 'Códigos de colores', 'Pelacables', 'Micrómetros', 'Microscopio', 'Esquemas', 'Soldadura de montaje superficial', 'Soldadura de alambre'] },
    { group: 'Servicio de comida', options: ['Cocinar', 'Lavaplatos', 'Cocinar a la parrilla', 'Preparación', 'Servicio de comedor', 'Servicio de bar'] },
    { group: 'Montacargas y bodega', options: ['Montacargas sentado', 'Montacargas parado', 'Plataforma auxiliar', 'Montacargas de alcance', 'Gato elevador', 'Conteo en ciclo', 'Inventario', 'Selección', 'Empaque', 'Envíos y recepción', 'Apilar'] },
    { group: 'Producción y maquinaria', options: ['Línea de producción', 'Control de calidad', 'Inspección', 'Operador CNC', 'Programador CNC', 'Operador de maquinaria', 'Configuración de maquinaria', 'Taladro de columna', 'Maquinista', 'Torno', 'Molino'] },
    { group: 'Gerencia', options: ['Asistente', 'Líder de turno', 'Supervisor', 'Gerente'] },
  ],
} as const

const safetyQuestions = {
  en: [
    { id: 'q1', question: 'Drug or alcohol use is acceptable at work when a supervisor says it is okay.', answer: 'false' },
    { id: 'q2', question: 'You should inspect your work area for unsafe conditions before starting work and after breaks.', answer: 'true' },
    { id: 'q3', question: 'Properly used personal protective equipment can prevent injuries and save lives.', answer: 'true' },
    { id: 'q4', question: 'Safety glasses only need to be worn when you remember to bring them.', answer: 'false' },
    { id: 'q5', question: 'Equipment must be shut down and properly isolated before repair or cleaning.', answer: 'true' },
    { id: 'q6', question: 'Unsafe conditions should be reported immediately before continuing work.', answer: 'true' },
    { id: 'q7', question: 'Only operate machinery after receiving the required training and authorization.', answer: 'true' },
    { id: 'q8', question: 'Work-related injuries should be reported promptly, even when they appear minor.', answer: 'true' },
  ],
  es: [
    { id: 'q1', question: 'Se permite usar drogas o alcohol en el trabajo si un supervisor dice que está bien.', answer: 'false' },
    { id: 'q2', question: 'Debe inspeccionar el área de trabajo por condiciones inseguras antes de comenzar y después de los descansos.', answer: 'true' },
    { id: 'q3', question: 'El equipo de protección personal usado correctamente puede prevenir lesiones y salvar vidas.', answer: 'true' },
    { id: 'q4', question: 'Las gafas de seguridad solo deben usarse cuando recuerde llevarlas.', answer: 'false' },
    { id: 'q5', question: 'El equipo debe apagarse y aislarse correctamente antes de repararlo o limpiarlo.', answer: 'true' },
    { id: 'q6', question: 'Las condiciones inseguras deben reportarse inmediatamente antes de continuar el trabajo.', answer: 'true' },
    { id: 'q7', question: 'Solo debe operar maquinaria después de recibir la capacitación y autorización requeridas.', answer: 'true' },
    { id: 'q8', question: 'Las lesiones relacionadas con el trabajo deben reportarse de inmediato, aunque parezcan menores.', answer: 'true' },
  ],
} as const

const yesNo = {
  en: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
  es: [{ label: 'Sí', value: 'yes' }, { label: 'No', value: 'no' }],
}

function NewHireApplicationPage() {
  const { language: languageParam } = useParams()
  const language = languageParam as Language
  const [form, setForm] = useState<NewHireState>(initialState)
  const [step, setStep] = useState(0)
  const [sectionError, setSectionError] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [startedAt] = useState(() => Date.now())

  if (language !== 'en' && language !== 'es') return <Navigate replace to="/forms" />

  const text = copy[language]
  const isSpanish = language === 'es'
  document.title = isSpanish ? 'Solicitud de Nuevo Empleado | BZ Resources' : 'New Hire Application | BZ Resources'
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', isSpanish ? 'Complete la solicitud de orientación para nuevos empleados de BZ Resources en inglés o español.' : 'Complete the BZ Resources new hire onboarding application in English or Spanish.')
  const steps = useMemo(() => [...text.steps], [text.steps])
  const allSkills = useMemo(() => skillGroups[language].flatMap((group) => group.options), [language])

  function update<K extends keyof NewHireState>(field: K, value: NewHireState[K]) {
    setForm((current) => ({ ...current, [field]: value }))
    setSectionError('')
    setStatus('idle')
    setMessage('')
  }

  function updateReference(index: number, field: keyof ReferenceEntry, value: string) {
    const next = form.references.map((entry, entryIndex) =>
      entryIndex === index ? { ...entry, [field]: value } : entry,
    )
    update('references', next)
  }

  function updateEducation(index: number, field: keyof EducationEntry, value: string) {
    const next = form.education.map((entry, entryIndex) =>
      entryIndex === index ? { ...entry, [field]: value } : entry,
    )
    update('education', next)
  }

  function updateEmployer(index: number, field: keyof EmployerEntry, value: string) {
    const next = form.employers.map((entry, entryIndex) =>
      entryIndex === index ? { ...entry, [field]: value } : entry,
    )
    update('employers', next)
  }

  function validateCurrentStep() {
    let valid = true

    if (step === 0) {
      valid = orientationItems[language].every((_, index) => form.orientationInitials[String(index)]?.trim())
    }

    if (step === 1) {
      valid = Boolean(
        form.lastName.trim() &&
          form.firstName.trim() &&
          form.applicationDate &&
          form.street.trim() &&
          form.city.trim() &&
          form.state.trim() &&
          form.zip.trim() &&
          form.email.trim() &&
          form.availableDate &&
          form.position.trim() &&
          form.availability.length > 0 &&
          form.reliableTransportation &&
          form.contactableByPhone &&
          form.age18 &&
          form.workAuthorized,
      )
    }

    if (step === 2) {
      const firstReference = form.references[0]
      const firstEmployer = form.employers[0]
      valid = Boolean(
        firstReference?.name.trim() &&
          firstReference.phone.trim() &&
          firstReference.relationship.trim() &&
          firstEmployer?.company.trim() &&
          firstEmployer.position.trim() &&
          firstEmployer.startDate &&
          firstEmployer.reason.trim() &&
          form.skills.length > 0,
      )
    }

    if (step === 3) {
      valid = form.policyAcknowledgments.length === policyItems[language].length
    }

    if (step === 4) {
      valid = safetyQuestions[language].every((question) => form.safetyAnswers[question.id]) && Boolean(form.safetySignature.trim())
    }

    if (step === 5) {
      valid = Boolean(
        form.applicantSignature.trim() &&
          form.signatureDate &&
          form.secureDocumentsAcknowledged === 'agreed',
      )
    }

    setSectionError(valid ? '' : text.required)
    return valid
  }

  function goNext() {
    if (!validateCurrentStep()) return
    setStep((current) => Math.min(current + 1, steps.length - 1))
    window.scrollTo({ behavior: 'smooth', top: 0 })
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0))
    setSectionError('')
    window.scrollTo({ behavior: 'smooth', top: 0 })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validateCurrentStep()) return
    setStatus('loading')
    setMessage('')

    try {
      const result = await postJson<
        {
          application: NewHireState
          language: Language
          security: { startedAt: number; website: string }
        },
        SubmissionResponse
      >(
        'api/forms/new-hire-application',
        {
          application: form,
          language,
          security: { startedAt, website: honeypot },
        },
      )
      setStatus(result.ok ? 'success' : 'error')
      setMessage(result.message)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'The new hire packet could not be submitted.')
    }
  }

  const fullName = [form.firstName, form.middleInitial, form.lastName].filter(Boolean).join(' ')
  const correctSafetyAnswers = safetyQuestions[language].filter(
    (question) => form.safetyAnswers[question.id] === question.answer,
  ).length

  return (
    <div className="questionnaire-page">
      <section className="questionnaire-hero questionnaire-hero-new-hire">
        <div className="section-inner questionnaire-hero-inner">
          <div>
            <p className="eyebrow">{isSpanish ? 'Orientación de empleados' : 'Employee onboarding'}</p>
            <h1>{text.title}</h1>
            <p>{text.intro}</p>
          </div>
          <div className="language-switch" aria-label={isSpanish ? 'Seleccionar idioma' : 'Select language'}>
            <Link className={language === 'en' ? 'active' : ''} to="/forms/new-hire-application/en">English</Link>
            <Link className={language === 'es' ? 'active' : ''} to="/forms/new-hire-application/es">Español</Link>
          </div>
        </div>
      </section>

      <section className="section questionnaire-workspace-section">
        <div className="section-inner questionnaire-workspace">
          <aside className="questionnaire-sidebar">
            <Link className="questionnaire-back-link" to="/forms">← {isSpanish ? 'Todos los formularios' : 'All forms'}</Link>
            <StepProgress currentStep={step} labels={steps} />
            <div className="questionnaire-privacy-note">
              <strong>{isSpanish ? 'Documentos confidenciales' : 'Sensitive documents'}</strong>
              <p>
                {isSpanish
                  ? 'No ingrese números de Seguro Social, información médica, datos bancarios ni documentos de identidad en este formulario. BZ Resources los solicitará mediante un proceso seguro separado.'
                  : 'Do not enter Social Security numbers, medical information, banking details, or identity documents in this form. BZ Resources will request them through a separate secure process.'}
              </p>
            </div>
          </aside>

          <form className="questionnaire-form new-hire-form" noValidate onSubmit={handleSubmit}>
            <BotTrap onChange={setHoneypot} value={honeypot} />
            {step === 0 ? (
              <QuestionnaireSection
                description={isSpanish ? 'Escriba sus iniciales al lado de cada documento después de recibirlo, leerlo o completarlo.' : 'Enter your initials beside each item after it has been received, reviewed, or completed.'}
                title={isSpanish ? 'Lista de orientación del empleado' : 'Employee orientation checklist'}
              >
                <div className="orientation-checklist question-field-wide">
                  {orientationItems[language].map((item, index) => (
                    <label className="orientation-item" key={item}>
                      <span>{item}</span>
                      <input
                        aria-label={`${item} ${isSpanish ? 'iniciales' : 'initials'}`}
                        maxLength={4}
                        onChange={(event) =>
                          update('orientationInitials', {
                            ...form.orientationInitials,
                            [String(index)]: event.target.value.toUpperCase(),
                          })
                        }
                        placeholder={isSpanish ? 'Iniciales' : 'Initials'}
                        value={form.orientationInitials[String(index)] ?? ''}
                      />
                    </label>
                  ))}
                </div>
              </QuestionnaireSection>
            ) : null}

            {step === 1 ? (
              <>
                <QuestionnaireSection title={isSpanish ? 'Información del solicitante' : 'Applicant information'}>
                  <TextField id="last-name" label={isSpanish ? 'Apellido' : 'Last name'} onChange={(value) => update('lastName', value)} required value={form.lastName} />
                  <TextField id="first-name" label={isSpanish ? 'Primer nombre' : 'First name'} onChange={(value) => update('firstName', value)} required value={form.firstName} />
                  <TextField id="middle-initial" label={isSpanish ? 'Inicial' : 'Middle initial'} maxLength={2} onChange={(value) => update('middleInitial', value)} value={form.middleInitial} />
                  <TextField id="application-date" label={isSpanish ? 'Fecha de solicitud' : 'Application date'} onChange={(value) => update('applicationDate', value)} required type="date" value={form.applicationDate} />
                  <TextField autoComplete="street-address" id="street" label={isSpanish ? 'Número y calle' : 'Street address'} onChange={(value) => update('street', value)} required value={form.street} />
                  <TextField id="unit" label={isSpanish ? 'Apartamento / unidad' : 'Apartment / unit'} onChange={(value) => update('unit', value)} value={form.unit} />
                  <TextField autoComplete="address-level2" id="city" label={isSpanish ? 'Ciudad' : 'City'} onChange={(value) => update('city', value)} required value={form.city} />
                  <TextField autoComplete="address-level1" id="state" label={isSpanish ? 'Estado' : 'State'} onChange={(value) => update('state', value)} required value={form.state} />
                  <TextField autoComplete="postal-code" id="zip" inputMode="numeric" label={isSpanish ? 'Código postal' : 'ZIP code'} onChange={(value) => update('zip', value)} required value={form.zip} />
                  <TextField autoComplete="tel" id="home-phone" label={isSpanish ? 'Teléfono principal' : 'Primary phone'} onChange={(value) => update('homePhone', value)} type="tel" value={form.homePhone} />
                  <TextField autoComplete="tel" id="mobile-phone" label={isSpanish ? 'Teléfono móvil' : 'Mobile phone'} onChange={(value) => update('mobilePhone', value)} type="tel" value={form.mobilePhone} />
                  <TextField autoComplete="email" id="email" label={isSpanish ? 'Correo electrónico' : 'Email address'} onChange={(value) => update('email', value)} required type="email" value={form.email} />
                  <RadioFieldset id="text-consent" label={isSpanish ? '¿Acepta recibir avisos relacionados con el trabajo por mensaje de texto?' : 'Do you agree to receive work-related notices by text message?'} name="text-consent" onChange={(value) => update('textConsent', value)} options={yesNo[language]} value={form.textConsent} />
                </QuestionnaireSection>

                <QuestionnaireSection title={isSpanish ? 'Puesto y disponibilidad' : 'Position and availability'}>
                  <TextField id="available-date" label={isSpanish ? 'Fecha disponible' : 'Date available'} onChange={(value) => update('availableDate', value)} required type="date" value={form.availableDate} />
                  <TextField id="desired-compensation" label={isSpanish ? 'Compensación deseada' : 'Desired compensation'} onChange={(value) => update('desiredCompensation', value)} placeholder={isSpanish ? 'Por ejemplo, $18 por hora' : 'For example, $18 per hour'} value={form.desiredCompensation} />
                  <TextField id="position" label={isSpanish ? 'Posición solicitada' : 'Position requested'} onChange={(value) => update('position', value)} required value={form.position} />
                  <CheckboxFieldset id="availability" label={isSpanish ? 'Disponibilidad' : 'Availability'} onChange={(value) => update('availability', value)} options={[
                    ...['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => ({ label: isSpanish ? ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][index] : day, value: day.toLowerCase() })),
                    { label: isSpanish ? 'Días' : 'Days', value: 'days' },
                    { label: isSpanish ? 'Tardes' : 'Evenings', value: 'evenings' },
                    { label: isSpanish ? 'Noches' : 'Nights', value: 'nights' },
                    { label: isSpanish ? 'Tiempo parcial' : 'Part time', value: 'part-time' },
                    { label: isSpanish ? 'Tiempo completo' : 'Full time', value: 'full-time' },
                    { label: isSpanish ? 'Asignaciones el mismo día' : 'Same-day assignments', value: 'same-day' },
                  ]} required value={form.availability} />
                  <RadioFieldset id="previously-worked" label={isSpanish ? '¿Ha trabajado anteriormente para BZ Resources?' : 'Have you previously worked for BZ Resources?'} name="previously-worked" onChange={(value) => update('previouslyWorked', value)} options={yesNo[language]} value={form.previouslyWorked} />
                  <RadioFieldset id="reliable-transportation" label={isSpanish ? '¿Tiene transporte confiable?' : 'Do you have reliable transportation?'} name="reliable-transportation" onChange={(value) => update('reliableTransportation', value)} options={yesNo[language]} required value={form.reliableTransportation} />
                  <RadioFieldset id="contactable-phone" label={isSpanish ? '¿Puede ser contactado/a por teléfono?' : 'Can you be contacted by phone?'} name="contactable-phone" onChange={(value) => update('contactableByPhone', value)} options={yesNo[language]} required value={form.contactableByPhone} />
                  <RadioFieldset id="age-18" label={isSpanish ? '¿Tiene al menos 18 años?' : 'Are you at least 18 years old?'} name="age-18" onChange={(value) => update('age18', value)} options={yesNo[language]} required value={form.age18} />
                  <RadioFieldset id="work-authorized" label={isSpanish ? '¿Puede demostrar su autorización para trabajar en los Estados Unidos?' : 'Can you provide evidence of authorization to work in the United States?'} name="work-authorized" onChange={(value) => update('workAuthorized', value)} options={yesNo[language]} required value={form.workAuthorized} />
                </QuestionnaireSection>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <QuestionnaireSection description={isSpanish ? 'Proporcione dos referencias personales o profesionales que no sean familiares inmediatos.' : 'Provide two personal or professional references who are not immediate family members.'} title={isSpanish ? 'Referencias' : 'References'}>
                  {form.references.map((entry, index) => (
                    <div className="repeating-entry question-field-wide" key={`reference-${index + 1}`}>
                      <h3>{isSpanish ? `Referencia ${index + 1}` : `Reference ${index + 1}`}</h3>
                      <div className="questionnaire-field-grid">
                        <TextField id={`reference-name-${index}`} label={isSpanish ? 'Nombre completo' : 'Full name'} onChange={(value) => updateReference(index, 'name', value)} required={index === 0} value={entry.name} />
                        <TextField id={`reference-relationship-${index}`} label={isSpanish ? 'Relación' : 'Relationship'} onChange={(value) => updateReference(index, 'relationship', value)} required={index === 0} value={entry.relationship} />
                        <TextField id={`reference-phone-${index}`} label={isSpanish ? 'Teléfono' : 'Phone'} onChange={(value) => updateReference(index, 'phone', value)} required={index === 0} type="tel" value={entry.phone} />
                      </div>
                    </div>
                  ))}
                </QuestionnaireSection>

                <QuestionnaireSection title={isSpanish ? 'Historial educativo' : 'Education history'}>
                  {form.education.map((entry, index) => (
                    <div className="repeating-entry question-field-wide" key={`education-${index + 1}`}>
                      <h3>{isSpanish ? `Escuela o programa ${index + 1}` : `School or program ${index + 1}`}</h3>
                      <div className="questionnaire-field-grid">
                        <TextField id={`school-${index}`} label={isSpanish ? 'Nombre de la escuela' : 'School name'} onChange={(value) => updateEducation(index, 'school', value)} value={entry.school} />
                        <TextField id={`education-years-${index}`} label={isSpanish ? 'Años asistidos' : 'Years attended'} onChange={(value) => updateEducation(index, 'years', value)} value={entry.years} />
                        <TextField id={`education-address-${index}`} label={isSpanish ? 'Dirección' : 'Address'} onChange={(value) => updateEducation(index, 'address', value)} value={entry.address} />
                        <TextField id={`education-studies-${index}`} label={isSpanish ? 'Materias o título' : 'Studies or degree'} onChange={(value) => updateEducation(index, 'studies', value)} value={entry.studies} />
                      </div>
                    </div>
                  ))}
                </QuestionnaireSection>

                <QuestionnaireSection description={isSpanish ? 'Comience con el empleador más reciente. Incluya hasta cuatro años de historial cuando sea posible.' : 'Begin with your most recent employer. Include up to four years of history when possible.'} title={isSpanish ? 'Historial laboral' : 'Employment history'}>
                  {form.employers.map((entry, index) => (
                    <details className="repeating-entry repeating-entry-collapsible question-field-wide" key={`employer-${index + 1}`} open={index === 0}>
                      <summary>{isSpanish ? `Empleador ${index + 1}` : `Employer ${index + 1}`}{entry.company ? ` · ${entry.company}` : ''}</summary>
                      <div className="questionnaire-field-grid">
                        <TextField id={`company-${index}`} label={isSpanish ? 'Empresa' : 'Company'} onChange={(value) => updateEmployer(index, 'company', value)} required={index === 0} value={entry.company} />
                        <TextField id={`employer-phone-${index}`} label={isSpanish ? 'Teléfono' : 'Phone'} onChange={(value) => updateEmployer(index, 'phone', value)} type="tel" value={entry.phone} />
                        <TextField id={`employer-address-${index}`} label={isSpanish ? 'Dirección' : 'Address'} onChange={(value) => updateEmployer(index, 'address', value)} value={entry.address} />
                        <TextField id={`supervisor-${index}`} label={isSpanish ? 'Supervisor' : 'Supervisor'} onChange={(value) => updateEmployer(index, 'supervisor', value)} value={entry.supervisor} />
                        <TextField id={`job-position-${index}`} label={isSpanish ? 'Posición' : 'Position'} onChange={(value) => updateEmployer(index, 'position', value)} required={index === 0} value={entry.position} />
                        <TextField id={`start-date-${index}`} label={isSpanish ? 'Fecha inicial' : 'Start date'} onChange={(value) => updateEmployer(index, 'startDate', value)} required={index === 0} type="date" value={entry.startDate} />
                        <TextField id={`end-date-${index}`} label={isSpanish ? 'Fecha final' : 'End date'} onChange={(value) => updateEmployer(index, 'endDate', value)} type="date" value={entry.endDate} />
                        <TextAreaField id={`responsibilities-${index}`} label={isSpanish ? 'Responsabilidades' : 'Responsibilities'} onChange={(value) => updateEmployer(index, 'responsibilities', value)} value={entry.responsibilities} />
                        <TextAreaField id={`reason-${index}`} label={isSpanish ? 'Razón de separación' : 'Reason for leaving'} onChange={(value) => updateEmployer(index, 'reason', value)} required={index === 0} value={entry.reason} />
                      </div>
                    </details>
                  ))}
                </QuestionnaireSection>

                <QuestionnaireSection description={isSpanish ? 'Seleccione todas las destrezas que puede realizar de manera segura y competente.' : 'Select every skill you can perform safely and competently.'} title={isSpanish ? 'Hoja de habilidades' : 'Skills inventory'}>
                  <div className="skill-groups question-field-wide">
                    {skillGroups[language].map((group) => (
                      <CheckboxFieldset
                        id={`skills-${group.group.toLowerCase().replaceAll(' ', '-')}`}
                        key={group.group}
                        label={group.group}
                        onChange={(selectedInGroup) => {
                          const otherSkills = form.skills.filter((skill) => !(group.options as readonly string[]).includes(skill))
                          update('skills', [...otherSkills, ...selectedInGroup])
                        }}
                        options={group.options.map((option) => ({ label: option, value: option }))}
                        value={form.skills.filter((skill) => (group.options as readonly string[]).includes(skill))}
                      />
                    ))}
                  </div>
                  <span className="sr-only">{allSkills.length} skill options available.</span>
                </QuestionnaireSection>
              </>
            ) : null}

            {step === 3 ? (
              <QuestionnaireSection
                description={isSpanish ? 'Lea cada punto y marque la casilla para reconocer que recibió y entendió la política durante la orientación.' : 'Read each item and check the box to acknowledge that it was provided and explained during orientation.'}
                title={isSpanish ? 'Políticas y procedimientos' : 'Policies and procedures'}
              >
                <div className="policy-acknowledgment-list question-field-wide">
                  {policyItems[language].map((item, index) => (
                    <label className="policy-acknowledgment" key={item}>
                      <input
                        checked={form.policyAcknowledgments.includes(String(index))}
                        onChange={() => {
                          const value = String(index)
                          update(
                            'policyAcknowledgments',
                            form.policyAcknowledgments.includes(value)
                              ? form.policyAcknowledgments.filter((itemValue) => itemValue !== value)
                              : [...form.policyAcknowledgments, value],
                          )
                        }}
                        type="checkbox"
                      />
                      <span><strong>{index + 1}.</strong> {item}</span>
                    </label>
                  ))}
                </div>
                <div className="questionnaire-legal-note question-field-wide">
                  <strong>{isSpanish ? 'Nota importante' : 'Important note'}</strong>
                  <p>
                    {isSpanish
                      ? 'Esta pantalla organiza los reconocimientos de orientación. Los textos legales completos y las políticas vigentes deben ser proporcionados y aprobados por BZ Resources antes de obtener la firma final.'
                      : 'This screen organizes orientation acknowledgments. The complete, current legal documents and policies must be provided and approved by BZ Resources before final signature.'}
                  </p>
                </div>
              </QuestionnaireSection>
            ) : null}

            {step === 4 ? (
              <>
                <QuestionnaireSection
                  description={isSpanish ? 'Seleccione verdadero o falso para cada declaración.' : 'Select true or false for each statement.'}
                  title={isSpanish ? 'Prueba de orientación de seguridad' : 'Safety orientation quiz'}
                >
                  <div className="safety-quiz question-field-wide">
                    {safetyQuestions[language].map((question, index) => (
                      <RadioFieldset
                        id={`safety-${question.id}`}
                        key={question.id}
                        label={`${index + 1}. ${question.question}`}
                        name={`safety-${question.id}`}
                        onChange={(value) => update('safetyAnswers', { ...form.safetyAnswers, [question.id]: value })}
                        options={isSpanish
                          ? [{ label: 'Verdadero', value: 'true' }, { label: 'Falso', value: 'false' }]
                          : [{ label: 'True', value: 'true' }, { label: 'False', value: 'false' }]}
                        required
                        value={form.safetyAnswers[question.id] ?? ''}
                      />
                    ))}
                  </div>
                  <TextField id="safety-signature" label={isSpanish ? 'Nombre completo como firma del solicitante' : 'Applicant full name as safety acknowledgment signature'} onChange={(value) => update('safetySignature', value)} required value={form.safetySignature} />
                  <div className="safety-score question-field-wide" aria-live="polite">
                    <strong>{isSpanish ? 'Puntuación actual' : 'Current score'}:</strong> {correctSafetyAnswers} / {safetyQuestions[language].length}
                    <span>{isSpanish ? 'La orientación debe revisarse con un representante de BZ Resources antes de finalizar.' : 'Review the orientation with a BZ Resources representative before final completion.'}</span>
                  </div>
                </QuestionnaireSection>

                <QuestionnaireSection title={isSpanish ? 'Procedimiento por lesiones laborales' : 'Work-related injury procedure'}>
                  <ol className="procedure-list question-field-wide">
                    <li>{isSpanish ? 'Reporte inmediatamente toda lesión relacionada con el trabajo a su supervisor y a BZ Resources.' : 'Immediately report every work-related injury to your supervisor and BZ Resources.'}</li>
                    <li>{isSpanish ? 'En una emergencia médica, obtenga atención de inmediato y luego notifique a su supervisor.' : 'In a medical emergency, obtain care immediately and then notify your supervisor.'}</li>
                    <li>{isSpanish ? 'Complete los documentos de compensación laboral requeridos dentro del plazo indicado.' : 'Complete the required workers’ compensation documents within the directed timeframe.'}</li>
                    <li>{isSpanish ? 'Siga las instrucciones de la clínica y entregue a su supervisor la documentación de tratamiento y restricciones.' : 'Follow clinic instructions and return treatment and work-restriction documents to your supervisor.'}</li>
                    <li>{isSpanish ? 'No regrese a funciones restringidas hasta recibir autorización.' : 'Do not return to restricted duties until authorized.'}</li>
                  </ol>
                </QuestionnaireSection>
              </>
            ) : null}

            {step === 5 ? (
              <>
                <div className="questionnaire-review">
                  <ReviewGroup
                    items={[
                      { label: isSpanish ? 'Empleado' : 'Employee', value: fullName },
                      { label: isSpanish ? 'Posición' : 'Position', value: form.position },
                      { label: isSpanish ? 'Fecha disponible' : 'Available date', value: form.availableDate },
                      { label: isSpanish ? 'Destrezas seleccionadas' : 'Selected skills', value: String(form.skills.length) },
                      { label: isSpanish ? 'Puntuación de seguridad' : 'Safety score', value: `${correctSafetyAnswers}/${safetyQuestions[language].length}` },
                    ]}
                    title={isSpanish ? 'Resumen del paquete' : 'Packet summary'}
                  />
                </div>

                <QuestionnaireSection
                  description={isSpanish ? 'Los siguientes documentos contienen información confidencial y deben completarse mediante el flujo seguro aprobado por BZ Resources.' : 'The following documents contain sensitive information and must be completed through the secure workflow approved by BZ Resources.'}
                  title={isSpanish ? 'Documentos seguros pendientes' : 'Secure documents still required'}
                >
                  <ul className="secure-document-list question-field-wide">
                    <li>Form W-4</li>
                    <li>Form I-9 and identity verification</li>
                    <li>{isSpanish ? 'Autorización de investigación de antecedentes, cuando corresponda' : 'Background investigation authorization, when applicable'}</li>
                    <li>{isSpanish ? 'Información bancaria o elección de pago' : 'Banking or pay-election information'}</li>
                    <li>{isSpanish ? 'Información médica o predesignación de médico, cuando corresponda' : 'Medical information or physician predesignation, when applicable'}</li>
                    <li>{isSpanish ? 'Acuerdo de arbitraje y avisos específicos del estado, cuando correspondan' : 'Arbitration agreement and state-specific notices, when applicable'}</li>
                  </ul>
                  <RadioFieldset
                    id="secure-documents-acknowledged"
                    label={isSpanish ? 'Confirmo que no ingresé información confidencial en este formulario y que completaré los documentos pendientes mediante el proceso seguro.' : 'I confirm that I did not enter sensitive information in this form and will complete the remaining documents through the secure process.'}
                    name="secure-documents-acknowledged"
                    onChange={(value) => update('secureDocumentsAcknowledged', value)}
                    options={[{ label: isSpanish ? 'Confirmo' : 'I confirm', value: 'agreed' }]}
                    required
                    value={form.secureDocumentsAcknowledged}
                  />
                  <TextField id="applicant-signature" label={isSpanish ? 'Nombre completo como firma' : 'Full name as signature'} onChange={(value) => update('applicantSignature', value)} required value={form.applicantSignature} />
                  <TextField id="signature-date" label={isSpanish ? 'Fecha' : 'Date'} onChange={(value) => update('signatureDate', value)} required type="date" value={form.signatureDate} />
                  <TextField hint={isSpanish ? 'Solo para uso de un representante autorizado de BZ Resources.' : 'For use by an authorized BZ Resources representative only.'} id="office-use-name" label={isSpanish ? 'Representante / uso de oficina' : 'Representative / office use'} onChange={(value) => update('officeUseName', value)} value={form.officeUseName} />
                </QuestionnaireSection>
              </>
            ) : null}

            {sectionError ? <p className="form-message error" role="alert">{sectionError}</p> : null}
            {message ? <p className={status === 'error' ? 'form-message error' : 'form-message'} role="status">{message}</p> : null}

            <div className="questionnaire-actions">
              <div>
                {step > 0 ? <button className="button button-muted" onClick={goBack} type="button">{text.back}</button> : null}
              </div>
              <div className="questionnaire-actions-primary">
                {step === steps.length - 1 ? (
                  <>
                    <button className="button button-outline-dark" onClick={() => window.print()} type="button">{text.print}</button>
                    <button className="button" disabled={status === 'loading'} type="submit">
                      {status === 'loading' ? (isSpanish ? 'Enviando…' : 'Submitting…') : text.submit}
                    </button>
                  </>
                ) : (
                  <button className="button" onClick={goNext} type="button">{text.next}</button>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default NewHireApplicationPage
