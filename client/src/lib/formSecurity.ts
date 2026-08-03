const invisibleCharacters =
  /(?:\u{00AD}|\u{034F}|\u{061C}|\u{115F}|\u{1160}|\u{17B4}|\u{17B5}|\u{180E}|[\u{200B}-\u{200F}]|[\u{202A}-\u{202E}]|[\u{2060}-\u{206F}]|\u{FEFF})/gu

const blockedPatterns = [
  /(?:https?:\/\/|www\.)/i,
  /\[[^\]]+\]\(\s*[^)]+\)/i,
  /<\s*\/?\s*[a-z][^>]*>/i,
  /(?:^|[\s(])(?:[a-z0-9-]+\.)+(?:app|ai|biz|co|com|dev|info|io|ly|me|net|org|us)(?:[\x2F?#:]|\b)/i,
  /\b(?:bit\.ly|buff\.ly|cutt\.ly|goo\.gl|ow\.ly|rebrand\.ly|t\.co|tinyurl\.com)\b/i,
]

export const linksNotAllowedMessage =
  'Links are not permitted in this form. Please remove the link and try again.'

export function normalizeSingleLine(value: string): string {
  return value
    .normalize('NFKC')
    .replace(invisibleCharacters, '')
    .replace(/[\t ]+/g, ' ')
    .trim()
}

export function normalizeMultiline(value: string): string {
  return value
    .normalize('NFKC')
    .replace(invisibleCharacters, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\t ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function containsBlockedContent(value: string): boolean {
  const canonical = value.normalize('NFKC').replace(invisibleCharacters, '')
  return blockedPatterns.some((pattern) => pattern.test(canonical))
}

export function containsBlockedContentDeep(value: unknown, key = ''): boolean {
  if (typeof value === 'string') {
    return !key.toLowerCase().includes('email') && containsBlockedContent(value)
  }
  if (Array.isArray(value)) {
    return value.some((item) => containsBlockedContentDeep(item, key))
  }
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).some(([itemKey, item]) =>
      containsBlockedContentDeep(item, itemKey),
    )
  }
  return false
}

export function normalizeEmail(value: string): string {
  const candidate = normalizeSingleLine(value)
  const separator = candidate.lastIndexOf('@')
  if (separator < 1) return candidate
  return `${candidate.slice(0, separator)}@${candidate.slice(separator + 1).toLowerCase()}`
}

export function focusFirstInvalidField(form: HTMLFormElement | null) {
  window.requestAnimationFrame(() => {
    form
      ?.querySelector<HTMLElement>('[aria-invalid="true"], .form-message.error')
      ?.focus()
  })
}
