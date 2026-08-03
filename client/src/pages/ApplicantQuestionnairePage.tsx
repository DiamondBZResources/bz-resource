import { useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import SecureFormControls from '../components/SecureFormControls'
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
import {
  containsBlockedContentDeep,
  focusFirstInvalidField,
  linksNotAllowedMessage,
} from '../lib/formSecurity'

type Language = 'en' | 'es'

type ApplicantState = {
  applicantName: string
  applicationStatus: string
  availableDate: string
  commitments: string[]
  commitmentHours: string
  contactNumber: string
  drugTest: string
  equipment: string[]
  fastPaced: string
  hotLaundry: string
  lastDayWorked: string
  liftRange: string
  overtime: string
  physicalTasks: string
  position: string
  preferredWorkStyle: string
  referredBy: string
  repetitiveMotion: string
  scannerUse: string
  shifts: string[]
  signatureDate: string
  signatureName: string
  standing: string
  temperatureEnvironment: string
  terminated: string
  terminationExplanation: string
  weekend: string
  workEnvironmentSensitivity: string
  workExperienceNotes: string
  reasonForLeaving: string
  desiredPay: string
  consent: string
}

type ApplicantErrors = Partial<Record<keyof ApplicantState, string>>

type SubmissionResponse = {
  message: string
  ok: boolean
}

const initialState: ApplicantState = {
  applicantName: '',
  applicationStatus: 'new',
  availableDate: '',
  commitments: [],
  commitmentHours: '',
  contactNumber: '',
  drugTest: '',
  equipment: [],
  fastPaced: '',
  hotLaundry: '',
  lastDayWorked: '',
  liftRange: '',
  overtime: '',
  physicalTasks: '',
  position: '',
  preferredWorkStyle: '',
  referredBy: '',
  repetitiveMotion: '',
  scannerUse: '',
  shifts: [],
  signatureDate: '',
  signatureName: '',
  standing: '',
  temperatureEnvironment: '',
  terminated: '',
  terminationExplanation: '',
  weekend: '',
  workEnvironmentSensitivity: '',
  workExperienceNotes: '',
  reasonForLeaving: '',
  desiredPay: '',
  consent: '',
}

const copy = {
  en: {
    title: 'Applicant Questionnaire',
    intro:
      'Complete the questionnaire below so BZ Resources can better understand your availability, work preferences, and experience.',
    steps: ['Basics', 'Availability', 'Work environment', 'Review'],
    next: 'Continue',
    back: 'Back',
    submit: 'Submit Questionnaire',
    print: 'Print / Save PDF',
    required: 'Please complete this field.',
    chooseOne: 'Please choose an option.',
    chooseAtLeastOne: 'Please choose at least one option.',
    success: 'Your applicant questionnaire was submitted successfully.',
    noSave:
      'Your answers stay in this browser tab while you complete the form. They are not saved to this device.',
  },
  es: {
    title: 'Cuestionario del Solicitante',
    intro:
      'Complete el siguiente cuestionario para que BZ Resources pueda conocer mejor su disponibilidad, preferencias de trabajo y experiencia.',
    steps: ['Información', 'Disponibilidad', 'Ambiente laboral', 'Revisión'],
    next: 'Continuar',
    back: 'Atrás',
    submit: 'Enviar Cuestionario',
    print: 'Imprimir / Guardar PDF',
    required: 'Complete este campo.',
    chooseOne: 'Seleccione una opción.',
    chooseAtLeastOne: 'Seleccione al menos una opción.',
    success: 'Su cuestionario fue enviado correctamente.',
    noSave:
      'Sus respuestas permanecen en esta pestaña mientras completa el formulario. No se guardan en este dispositivo.',
  },
} as const

const yesNo = {
  en: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ],
  es: [
    { label: 'Sí', value: 'yes' },
    { label: 'No', value: 'no' },
  ],
}

function validateStep(
  form: ApplicantState,
  language: Language,
  step: number,
): ApplicantErrors {
  const messages = copy[language]
  const errors: ApplicantErrors = {}
  const requireText = (field: keyof ApplicantState) => {
    const value = form[field]
    if (typeof value === 'string' && !value.trim()) errors[field] = messages.required
  }
  const requireChoice = (field: keyof ApplicantState) => {
    if (!form[field]) errors[field] = messages.chooseOne
  }

  if (step === 0) {
    requireText('availableDate')
    requireText('applicantName')
    requireText('contactNumber')
    requireText('position')
    requireText('desiredPay')
  }

  if (step === 1) {
    if (form.shifts.length === 0) errors.shifts = messages.chooseAtLeastOne
    requireChoice('overtime')
    requireChoice('weekend')
    requireChoice('drugTest')
  }

  if (step === 2) {
    requireChoice('physicalTasks')
    requireChoice('liftRange')
    requireChoice('temperatureEnvironment')
    requireChoice('hotLaundry')
    requireChoice('scannerUse')
    requireChoice('preferredWorkStyle')
    requireChoice('fastPaced')
    requireChoice('repetitiveMotion')
    requireChoice('standing')
    requireChoice('workEnvironmentSensitivity')
  }

  if (step === 3) {
    requireChoice('terminated')
    requireText('reasonForLeaving')
    requireText('lastDayWorked')
    requireText('workExperienceNotes')
    requireText('signatureName')
    requireText('signatureDate')
    requireChoice('consent')
    if (form.workExperienceNotes.trim().length < 20) {
      errors.workExperienceNotes = isSpanishMessage(language)
    }
    if (form.terminated === 'yes' && !form.terminationExplanation.trim()) {
      errors.terminationExplanation = messages.required
    }
  }

  return errors
}

function isSpanishMessage(language: Language) {
  return language === 'es'
    ? 'Incluya al menos 20 caracteres.'
    : 'Please include at least 20 characters.'
}

function ApplicantQuestionnairePage() {
  const { language: languageParam } = useParams()
  const language = languageParam as Language
  const [form, setForm] = useState<ApplicantState>(initialState)
  const [errors, setErrors] = useState<ApplicantErrors>({})
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileResetKey, setTurnstileResetKey] = useState(0)
  const [securityErrors, setSecurityErrors] = useState<{
    consent?: string
    turnstile?: string
  }>({})
  const [startedAt] = useState(() => Date.now())
  const formRef = useRef<HTMLFormElement>(null)

  const labels = useMemo(() => copy[language]?.steps ?? copy.en.steps, [language])

  if (language !== 'en' && language !== 'es') {
    return <Navigate replace to="/forms" />
  }

  const text = copy[language]
  const isSpanish = language === 'es'
  document.title = isSpanish ? 'Cuestionario del Solicitante | BZ Resources' : 'Applicant Questionnaire | BZ Resources'
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', isSpanish ? 'Complete el cuestionario de solicitante de BZ Resources en inglés o español.' : 'Complete the BZ Resources applicant questionnaire in English or Spanish.')

  function update<K extends keyof ApplicantState>(field: K, value: ApplicantState[K]) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus('idle')
    setMessage('')
  }

  function goNext() {
    const nextErrors = validateStep(form, language, step)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      focusFirstInvalidField(formRef.current)
      return
    }
    setStep((current) => Math.min(current + 1, labels.length - 1))
    window.scrollTo({ behavior: 'smooth', top: 0 })
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0))
    setErrors({})
    window.scrollTo({ behavior: 'smooth', top: 0 })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateStep(form, language, 3)
    setErrors(nextErrors)
    const nextSecurityErrors = {
      ...(!privacyConsent
        ? { consent: isSpanish ? 'Debe aceptar antes de enviar.' : 'You must agree before submitting.' }
        : {}),
      ...(!turnstileToken
        ? { turnstile: isSpanish ? 'Complete la verificación de seguridad.' : 'Complete the security verification.' }
        : {}),
    }
    setSecurityErrors(nextSecurityErrors)
    if (containsBlockedContentDeep(form)) {
      setStatus('error')
      setMessage(linksNotAllowedMessage)
      focusFirstInvalidField(formRef.current)
      return
    }
    if (Object.keys(nextErrors).length > 0 || Object.keys(nextSecurityErrors).length > 0) {
      focusFirstInvalidField(formRef.current)
      return
    }

    setStatus('loading')
    setMessage('')
    setTurnstileToken('')
    setTurnstileResetKey((current) => current + 1)

    try {
      const result = await postJson<
        {
          language: Language
          questionnaire: ApplicantState
          security: {
            consent: boolean
            startedAt: number
            turnstileToken: string
            website: string
          }
        },
        SubmissionResponse
      >(
        'api/forms/applicant-questionnaire',
        {
          language,
          questionnaire: form,
          security: {
            consent: privacyConsent,
            startedAt,
            turnstileToken,
            website: honeypot,
          },
        },
      )
      setStatus(result.ok ? 'success' : 'error')
      setMessage(result.message || text.success)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'The questionnaire could not be submitted.')
    }
  }

  return (
    <div className="questionnaire-page">
      <section className="questionnaire-hero">
        <div className="section-inner questionnaire-hero-inner">
          <div>
            <p className="eyebrow">{isSpanish ? 'Formularios para solicitantes' : 'Applicant forms'}</p>
            <h1>{text.title}</h1>
            <p>{text.intro}</p>
          </div>
          <div className="language-switch" aria-label={isSpanish ? 'Seleccionar idioma' : 'Select language'}>
            <Link className={language === 'en' ? 'active' : ''} to="/forms/applicant-questionnaire/en">
              English
            </Link>
            <Link className={language === 'es' ? 'active' : ''} to="/forms/applicant-questionnaire/es">
              Español
            </Link>
          </div>
        </div>
      </section>

      <section className="section questionnaire-workspace-section">
        <div className="section-inner questionnaire-workspace">
          <aside className="questionnaire-sidebar">
            <Link className="questionnaire-back-link" to="/forms">
              ← {isSpanish ? 'Todos los formularios' : 'All forms'}
            </Link>
            <StepProgress currentStep={step} labels={[...labels]} />
            <div className="questionnaire-privacy-note">
              <strong>{isSpanish ? 'Privacidad' : 'Privacy'}</strong>
              <p>{text.noSave}</p>
            </div>
          </aside>

          <form className="questionnaire-form" noValidate onSubmit={handleSubmit} ref={formRef}>
            {step === 0 ? (
              <>
                <QuestionnaireSection
                  description={isSpanish ? 'Cuéntenos cuándo puede comenzar y qué tipo de trabajo busca.' : 'Tell us when you can start and what kind of work you are seeking.'}
                  title={isSpanish ? 'Información del solicitante' : 'Applicant information'}
                >
                  <TextField
                    error={errors.availableDate}
                    id="available-date"
                    label={isSpanish ? 'Fecha disponible' : 'Date available'}
                    onChange={(value) => update('availableDate', value)}
                    required
                    type="date"
                    value={form.availableDate}
                  />
                  <TextField
                    autoComplete="name"
                    error={errors.applicantName}
                    id="applicant-name"
                    label={isSpanish ? 'Nombre completo del solicitante' : 'Applicant full name'}
                    onChange={(value) => update('applicantName', value)}
                    required
                    value={form.applicantName}
                  />
                  <RadioFieldset
                    id="application-status"
                    label={isSpanish ? 'Tipo de solicitud' : 'Application type'}
                    name="application-status"
                    onChange={(value) => update('applicationStatus', value)}
                    options={isSpanish
                      ? [{ label: 'Nueva', value: 'new' }, { label: 'Actualizar información', value: 'update' }]
                      : [{ label: 'New application', value: 'new' }, { label: 'Update my information', value: 'update' }]}
                    value={form.applicationStatus}
                  />
                  <TextField
                    autoComplete="tel"
                    error={errors.contactNumber}
                    id="contact-number"
                    inputMode="tel"
                    label={isSpanish ? 'Número de contacto' : 'Contact number'}
                    onChange={(value) => update('contactNumber', value)}
                    required
                    type="tel"
                    value={form.contactNumber}
                  />
                  <TextField
                    error={errors.position}
                    id="position"
                    label={isSpanish ? 'Posición solicitada' : 'Position requested'}
                    onChange={(value) => update('position', value)}
                    required
                    value={form.position}
                  />
                  <TextField
                    error={errors.desiredPay}
                    id="desired-pay"
                    inputMode="decimal"
                    label={isSpanish ? 'Pago deseado' : 'Desired pay'}
                    onChange={(value) => update('desiredPay', value)}
                    placeholder={isSpanish ? 'Por ejemplo, $18 por hora' : 'For example, $18 per hour'}
                    required
                    value={form.desiredPay}
                  />
                  <TextField
                    id="referred-by"
                    label={isSpanish ? 'Referido por' : 'Referred by'}
                    onChange={(value) => update('referredBy', value)}
                    value={form.referredBy}
                  />
                </QuestionnaireSection>
              </>
            ) : null}

            {step === 1 ? (
              <QuestionnaireSection
                description={isSpanish ? 'Seleccione todos los turnos y compromisos que correspondan.' : 'Select every shift and scheduling item that applies.'}
                title={isSpanish ? 'Disponibilidad y horario' : 'Availability and schedule'}
              >
                <CheckboxFieldset
                  error={errors.shifts}
                  id="shifts"
                  label={isSpanish ? 'Turnos disponibles' : 'Available shifts'}
                  onChange={(value) => update('shifts', value)}
                  options={[
                    { label: isSpanish ? 'Primer turno' : 'First shift', value: 'first' },
                    { label: isSpanish ? 'Segundo turno' : 'Second shift', value: 'second' },
                    { label: isSpanish ? 'Tercer turno' : 'Third shift', value: 'third' },
                  ]}
                  required
                  value={form.shifts}
                />
                <RadioFieldset
                  error={errors.overtime}
                  id="overtime"
                  label={isSpanish ? '¿Puede trabajar horas extras?' : 'Are you available for overtime?'}
                  name="overtime"
                  onChange={(value) => update('overtime', value)}
                  options={yesNo[language]}
                  required
                  value={form.overtime}
                />
                <RadioFieldset
                  error={errors.weekend}
                  id="weekend"
                  label={isSpanish ? '¿Puede trabajar fines de semana?' : 'Are you available on weekends?'}
                  name="weekend"
                  onChange={(value) => update('weekend', value)}
                  options={yesNo[language]}
                  required
                  value={form.weekend}
                />
                <CheckboxFieldset
                  id="commitments"
                  label={isSpanish ? 'Otros compromisos de horario' : 'Other scheduling commitments'}
                  onChange={(value) => update('commitments', value)}
                  options={[
                    { label: isSpanish ? 'Escuela' : 'School', value: 'school' },
                    { label: isSpanish ? 'Segundo trabajo' : 'Second job', value: 'second-job' },
                    { label: isSpanish ? 'Trabajo a corto plazo' : 'Short-term work', value: 'short-term' },
                    { label: isSpanish ? 'Trabajo a largo plazo' : 'Long-term work', value: 'long-term' },
                  ]}
                  value={form.commitments}
                />
                <TextField
                  id="commitment-hours"
                  label={isSpanish ? 'Horario o detalles de esos compromisos' : 'Hours or details for those commitments'}
                  onChange={(value) => update('commitmentHours', value)}
                  value={form.commitmentHours}
                />
                <RadioFieldset
                  error={errors.drugTest}
                  id="drug-test"
                  label={isSpanish ? '¿Se sometería a un examen de drogas cuando la ley y la política aplicable lo permitan?' : 'Would you submit to drug testing when permitted by applicable law and policy?'}
                  name="drug-test"
                  onChange={(value) => update('drugTest', value)}
                  options={yesNo[language]}
                  required
                  value={form.drugTest}
                />
              </QuestionnaireSection>
            ) : null}

            {step === 2 ? (
              <QuestionnaireSection
                description={isSpanish ? 'Estas preguntas ayudan a identificar asignaciones compatibles con sus capacidades y preferencias.' : 'These questions help identify assignments compatible with your abilities and preferences.'}
                title={isSpanish ? 'Ambiente y tareas de trabajo' : 'Work environment and tasks'}
              >
                <RadioFieldset
                  error={errors.physicalTasks}
                  hint={isSpanish ? 'Incluye transportar objetos, agacharse, girar, ponerse en cuclillas, alcanzar, apilar y envolver tarimas.' : 'Includes carrying items, bending, twisting, squatting, reaching, stacking, and wrapping pallets.'}
                  id="physical-tasks"
                  label={isSpanish ? '¿Puede realizar las funciones esenciales de este tipo de trabajo, con o sin una adaptación razonable?' : 'Can you perform the essential functions of this type of work, with or without reasonable accommodation?'}
                  name="physical-tasks"
                  onChange={(value) => update('physicalTasks', value)}
                  options={yesNo[language]}
                  required
                  value={form.physicalTasks}
                />
                <RadioFieldset
                  error={errors.liftRange}
                  id="lift-range"
                  label={isSpanish ? '¿Qué rango de peso puede transportar repetidamente?' : 'What weight range can you repeatedly carry?'}
                  name="lift-range"
                  onChange={(value) => update('liftRange', value)}
                  options={[
                    { label: '5–10 lbs', value: '5-10' },
                    { label: '11–20 lbs', value: '11-20' },
                    { label: '21–39 lbs', value: '21-39' },
                    { label: '40+ lbs', value: '40-plus' },
                    { label: isSpanish ? 'Necesito hablar sobre una adaptación' : 'I need to discuss an accommodation', value: 'accommodation' },
                  ]}
                  required
                  value={form.liftRange}
                />
                <RadioFieldset
                  error={errors.temperatureEnvironment}
                  id="temperature-environment"
                  label={isSpanish ? '¿Puede trabajar en ambientes calientes o refrigerados?' : 'Can you work in hot or refrigerated environments?'}
                  name="temperature-environment"
                  onChange={(value) => update('temperatureEnvironment', value)}
                  options={yesNo[language]}
                  required
                  value={form.temperatureEnvironment}
                />
                <RadioFieldset
                  error={errors.hotLaundry}
                  id="hot-laundry"
                  label={isSpanish ? '¿Puede trabajar a ritmo rápido doblando artículos calientes, como ropa de cama o toallas?' : 'Can you work at a fast pace folding warm items such as linens or towels?'}
                  name="hot-laundry"
                  onChange={(value) => update('hotLaundry', value)}
                  options={yesNo[language]}
                  required
                  value={form.hotLaundry}
                />
                <RadioFieldset
                  error={errors.scannerUse}
                  id="scanner-use"
                  label={isSpanish ? '¿Puede utilizar repetidamente un lector RF o una pistola de etiquetas?' : 'Can you repeatedly use an RF scanner or tagging gun?'}
                  name="scanner-use"
                  onChange={(value) => update('scannerUse', value)}
                  options={yesNo[language]}
                  required
                  value={form.scannerUse}
                />
                <RadioFieldset
                  error={errors.preferredWorkStyle}
                  id="preferred-work-style"
                  label={isSpanish ? '¿Cómo prefiere trabajar?' : 'How do you prefer to work?'}
                  name="preferred-work-style"
                  onChange={(value) => update('preferredWorkStyle', value)}
                  options={isSpanish
                    ? [{ label: 'Solo/a', value: 'alone' }, { label: 'En grupo', value: 'group' }, { label: 'Ambos', value: 'both' }]
                    : [{ label: 'Independently', value: 'alone' }, { label: 'With a team', value: 'group' }, { label: 'Either', value: 'both' }]}
                  required
                  value={form.preferredWorkStyle}
                />
                <RadioFieldset
                  error={errors.fastPaced}
                  id="fast-paced"
                  label={isSpanish ? '¿Puede trabajar en un ambiente de ritmo rápido?' : 'Can you work in a fast-paced environment?'}
                  name="fast-paced"
                  onChange={(value) => update('fastPaced', value)}
                  options={yesNo[language]}
                  required
                  value={form.fastPaced}
                />
                <RadioFieldset
                  error={errors.repetitiveMotion}
                  id="repetitive-motion"
                  label={isSpanish ? '¿Puede realizar tareas que impliquen movimientos repetitivos?' : 'Can you perform tasks involving repetitive motion?'}
                  name="repetitive-motion"
                  onChange={(value) => update('repetitiveMotion', value)}
                  options={yesNo[language]}
                  required
                  value={form.repetitiveMotion}
                />
                <RadioFieldset
                  error={errors.standing}
                  id="standing"
                  label={isSpanish ? '¿Puede permanecer de pie durante períodos prolongados?' : 'Can you stand for extended periods?'}
                  name="standing"
                  onChange={(value) => update('standing', value)}
                  options={yesNo[language]}
                  required
                  value={form.standing}
                />
                <RadioFieldset
                  error={errors.workEnvironmentSensitivity}
                  id="environment-sensitivity"
                  label={isSpanish ? '¿Es sensible a vapores químicos o partículas en el aire?' : 'Are you sensitive to chemical fumes or airborne particles?'}
                  name="environment-sensitivity"
                  onChange={(value) => update('workEnvironmentSensitivity', value)}
                  options={yesNo[language]}
                  required
                  value={form.workEnvironmentSensitivity}
                />
              </QuestionnaireSection>
            ) : null}

            {step === 3 ? (
              <>
                <QuestionnaireSection
                  description={isSpanish ? 'Revise su experiencia reciente y confirme que la información es correcta.' : 'Review your recent experience and confirm that the information is accurate.'}
                  title={isSpanish ? 'Experiencia y confirmación' : 'Experience and confirmation'}
                >
                  <RadioFieldset
                    error={errors.terminated}
                    id="terminated"
                    label={isSpanish ? '¿Ha sido despedido/a de un trabajo?' : 'Have you ever been terminated from a job?'}
                    name="terminated"
                    onChange={(value) => update('terminated', value)}
                    options={yesNo[language]}
                    required
                    value={form.terminated}
                  />
                  {form.terminated === 'yes' ? (
                    <TextAreaField
                      error={errors.terminationExplanation}
                      id="termination-explanation"
                      label={isSpanish ? 'Explique brevemente' : 'Please briefly explain'}
                      onChange={(value) => update('terminationExplanation', value)}
                      required
                      value={form.terminationExplanation}
                    />
                  ) : null}
                  <TextAreaField
                    error={errors.reasonForLeaving}
                    id="reason-for-leaving"
                    label={isSpanish ? '¿Por qué dejó su último trabajo?' : 'Why did you leave your most recent job?'}
                    onChange={(value) => update('reasonForLeaving', value)}
                    required
                    value={form.reasonForLeaving}
                  />
                  <TextField
                    error={errors.lastDayWorked}
                    id="last-day-worked"
                    label={isSpanish ? 'Último día de trabajo' : 'Last day worked'}
                    onChange={(value) => update('lastDayWorked', value)}
                    required
                    type="date"
                    value={form.lastDayWorked}
                  />
                  <CheckboxFieldset
                    id="equipment"
                    label={isSpanish ? 'Equipo que tiene disponible' : 'Equipment you currently have'}
                    onChange={(value) => update('equipment', value)}
                    options={[
                      { label: isSpanish ? 'Botas con casquillo' : 'Steel-toe work boots', value: 'steel-toe-boots' },
                      { label: isSpanish ? 'Faja de trabajo' : 'Work support belt', value: 'support-belt' },
                      { label: isSpanish ? 'Botas antideslizantes' : 'Slip-resistant shoes', value: 'slip-resistant' },
                    ]}
                    value={form.equipment}
                  />
                  <TextAreaField
                    error={errors.workExperienceNotes}
                    hint={isSpanish ? 'Incluya experiencia relevante, certificaciones, tipos de maquinaria o cualquier detalle que ayude a encontrar una asignación adecuada.' : 'Include relevant experience, certifications, machinery, or anything else that may help identify a suitable assignment.'}
                    id="work-experience-notes"
                    label={isSpanish ? 'Experiencia laboral y notas' : 'Work experience and notes'}
                    maxLength={2000}
                    onChange={(value) => update('workExperienceNotes', value)}
                    required
                    rows={6}
                    value={form.workExperienceNotes}
                  />
                </QuestionnaireSection>

                <div className="questionnaire-review">
                  <ReviewGroup
                    items={[
                      { label: isSpanish ? 'Solicitante' : 'Applicant', value: form.applicantName },
                      { label: isSpanish ? 'Posición' : 'Position', value: form.position },
                      { label: isSpanish ? 'Fecha disponible' : 'Available date', value: form.availableDate },
                      { label: isSpanish ? 'Turnos' : 'Shifts', value: form.shifts.join(', ') },
                    ]}
                    title={isSpanish ? 'Resumen' : 'Summary'}
                  />
                </div>

                <QuestionnaireSection
                  description={isSpanish ? 'Escriba su nombre completo para confirmar electrónicamente este cuestionario.' : 'Type your full name to electronically confirm this questionnaire.'}
                  title={isSpanish ? 'Confirmación del solicitante' : 'Applicant confirmation'}
                >
                  <TextField
                    error={errors.signatureName}
                    id="signature-name"
                    label={isSpanish ? 'Nombre completo como firma' : 'Full name as signature'}
                    onChange={(value) => update('signatureName', value)}
                    required
                    value={form.signatureName}
                  />
                  <TextField
                    error={errors.signatureDate}
                    id="signature-date"
                    label={isSpanish ? 'Fecha' : 'Date'}
                    onChange={(value) => update('signatureDate', value)}
                    required
                    type="date"
                    value={form.signatureDate}
                  />
                  <RadioFieldset
                    error={errors.consent}
                    hint={isSpanish ? 'Confirmo que mis respuestas son verdaderas y completas según mi leal saber y entender.' : 'I confirm that my answers are true and complete to the best of my knowledge.'}
                    id="consent"
                    label={isSpanish ? 'Confirmación' : 'Confirmation'}
                    name="consent"
                    onChange={(value) => update('consent', value)}
                    options={[{ label: isSpanish ? 'Acepto' : 'I agree', value: 'agreed' }]}
                    required
                    value={form.consent}
                  />
                </QuestionnaireSection>
                <QuestionnaireSection
                  title={isSpanish ? 'Privacidad y seguridad' : 'Privacy and security'}
                >
                  <SecureFormControls
                    action="applicant-questionnaire"
                    consent={privacyConsent}
                    consentError={securityErrors.consent}
                    honeypot={honeypot}
                    language={language}
                    onConsentChange={(checked) => {
                      setPrivacyConsent(checked)
                      setSecurityErrors((current) => ({ ...current, consent: undefined }))
                    }}
                    onHoneypotChange={setHoneypot}
                    onTurnstileTokenChange={(token) => {
                      setTurnstileToken(token)
                      setSecurityErrors((current) => ({ ...current, turnstile: undefined }))
                    }}
                    turnstileResetKey={turnstileResetKey}
                    turnstileError={securityErrors.turnstile}
                  />
                </QuestionnaireSection>
              </>
            ) : null}

            {message ? (
              <p
                aria-live="polite"
                className={status === 'error' ? 'form-message error' : 'form-message'}
                role={status === 'error' ? 'alert' : 'status'}
                tabIndex={-1}
              >
                {message}
              </p>
            ) : null}

            <div className="questionnaire-actions">
              <div>
                {step > 0 ? (
                  <button className="button button-muted" onClick={goBack} type="button">
                    {text.back}
                  </button>
                ) : null}
              </div>
              <div className="questionnaire-actions-primary">
                {step === labels.length - 1 ? (
                  <>
                    <button className="button button-outline-dark" onClick={() => window.print()} type="button">
                      {text.print}
                    </button>
                    <button className="button" disabled={status === 'loading'} type="submit">
                      {status === 'loading' ? (isSpanish ? 'Enviando…' : 'Submitting…') : text.submit}
                    </button>
                  </>
                ) : (
                  <button className="button" onClick={goNext} type="button">
                    {text.next}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default ApplicantQuestionnairePage
