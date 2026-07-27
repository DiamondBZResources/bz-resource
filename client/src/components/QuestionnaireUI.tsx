import type { ChangeEvent, ReactNode } from 'react'

type Option = {
  label: string
  value: string
  hint?: string
}

type CommonFieldProps = {
  error?: string
  hint?: string
  id: string
  label: string
  required?: boolean
}

type TextFieldProps = CommonFieldProps & {
  autoComplete?: string
  inputMode?: 'decimal' | 'email' | 'numeric' | 'search' | 'tel' | 'text' | 'url'
  maxLength?: number
  min?: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'date' | 'email' | 'number' | 'tel' | 'text'
  value: string
}

export function TextField({
  autoComplete,
  error,
  hint,
  id,
  inputMode,
  label,
  maxLength,
  min,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  value,
}: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <label className="question-field" htmlFor={id}>
      <span className="question-label">
        {label}
        {required ? <span aria-hidden="true" className="required-mark"> *</span> : null}
      </span>
      {hint ? <span className="question-hint" id={hintId}>{hint}</span> : null}
      <input
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        autoComplete={autoComplete}
        id={id}
        inputMode={inputMode}
        maxLength={maxLength}
        min={min}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
      {error ? <span className="field-error" id={errorId}>{error}</span> : null}
    </label>
  )
}

type TextAreaFieldProps = CommonFieldProps & {
  maxLength?: number
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  value: string
}

export function TextAreaField({
  error,
  hint,
  id,
  label,
  maxLength,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  value,
}: TextAreaFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <label className="question-field question-field-wide" htmlFor={id}>
      <span className="question-label">
        {label}
        {required ? <span aria-hidden="true" className="required-mark"> *</span> : null}
      </span>
      {hint ? <span className="question-hint" id={hintId}>{hint}</span> : null}
      <textarea
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        id={id}
        maxLength={maxLength}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        value={value}
      />
      {error ? <span className="field-error" id={errorId}>{error}</span> : null}
    </label>
  )
}

type RadioFieldsetProps = CommonFieldProps & {
  name: string
  onChange: (value: string) => void
  options: Option[]
  value: string
}

export function RadioFieldset({
  error,
  hint,
  id,
  label,
  name,
  onChange,
  options,
  required = false,
  value,
}: RadioFieldsetProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <fieldset
      aria-describedby={describedBy}
      aria-invalid={Boolean(error)}
      className="question-field question-choice-field"
      id={id}
    >
      <legend className="question-label">
        {label}
        {required ? <span aria-hidden="true" className="required-mark"> *</span> : null}
      </legend>
      {hint ? <span className="question-hint" id={hintId}>{hint}</span> : null}
      <div className="question-options">
        {options.map((option) => (
          <label className="choice-option" key={option.value}>
            <input
              checked={value === option.value}
              name={name}
              onChange={() => onChange(option.value)}
              required={required}
              type="radio"
              value={option.value}
            />
            <span>
              <strong>{option.label}</strong>
              {option.hint ? <small>{option.hint}</small> : null}
            </span>
          </label>
        ))}
      </div>
      {error ? <span className="field-error" id={errorId}>{error}</span> : null}
    </fieldset>
  )
}

type CheckboxFieldsetProps = CommonFieldProps & {
  onChange: (value: string[]) => void
  options: Option[]
  value: string[]
}

export function CheckboxFieldset({
  error,
  hint,
  id,
  label,
  onChange,
  options,
  required = false,
  value,
}: CheckboxFieldsetProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  function toggle(optionValue: string) {
    const nextValue = value.includes(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue]
    onChange(nextValue)
  }

  return (
    <fieldset
      aria-describedby={describedBy}
      aria-invalid={Boolean(error)}
      className="question-field question-choice-field question-field-wide"
      id={id}
    >
      <legend className="question-label">
        {label}
        {required ? <span aria-hidden="true" className="required-mark"> *</span> : null}
      </legend>
      {hint ? <span className="question-hint" id={hintId}>{hint}</span> : null}
      <div className="question-options question-options-grid">
        {options.map((option) => (
          <label className="choice-option" key={option.value}>
            <input
              checked={value.includes(option.value)}
              onChange={() => toggle(option.value)}
              type="checkbox"
              value={option.value}
            />
            <span>
              <strong>{option.label}</strong>
              {option.hint ? <small>{option.hint}</small> : null}
            </span>
          </label>
        ))}
      </div>
      {error ? <span className="field-error" id={errorId}>{error}</span> : null}
    </fieldset>
  )
}

type StepProgressProps = {
  currentStep: number
  labels: string[]
}

export function StepProgress({ currentStep, labels }: StepProgressProps) {
  return (
    <nav aria-label="Questionnaire progress" className="question-progress">
      <ol>
        {labels.map((label, index) => {
          const state = index < currentStep ? 'complete' : index === currentStep ? 'current' : 'upcoming'
          return (
            <li className={state} key={label}>
              <span aria-hidden="true" className="question-step-number">
                {index < currentStep ? '✓' : index + 1}
              </span>
              <span>{label}</span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

type SectionProps = {
  children: ReactNode
  description?: string
  title: string
}

export function QuestionnaireSection({ children, description, title }: SectionProps) {
  return (
    <section className="questionnaire-section">
      <div className="questionnaire-section-heading">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="questionnaire-field-grid">{children}</div>
    </section>
  )
}

type ReviewItem = {
  label: string
  value: string
}

type ReviewGroupProps = {
  items: ReviewItem[]
  title: string
}

export function ReviewGroup({ items, title }: ReviewGroupProps) {
  return (
    <section className="question-review-group">
      <h3>{title}</h3>
      <dl>
        {items.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value || 'Not provided'}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
