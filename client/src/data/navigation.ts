export const requestProposalUrl =
  'https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=bebad846-c42a-43cb-9add-4757b2bb6eef&env=na4&acct=223cd06d-c6f4-4f8d-b4c1-a549cd5222ea&v=2'

export const contactEmail = 'ceo@bz-resources.com'
export const phoneDisplay = '(800) 418-6889'
export const phoneHref = 'tel:8004186889'

export const primaryNavigation = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about-us' },
  { label: 'Why BZ', path: '/why-choose-bz' },
  { label: 'Services', path: '/services' },
  { label: 'Resources', path: '/resources' },
  { label: 'Forms', path: '/forms' },
  { label: 'Contact', path: '/contact' },
] as const

export const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/BZ-Resources-103903385502299' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/52196209/' },
  { label: 'Instagram', href: 'https://www.instagram.com/bzresourcesstaffing/' },
]

export const corporateOffice = {
  label: 'Corporate Office',
  labelEs: 'Oficina principal',
  city: 'Ocala, Florida',
  lines: ['1026 SW 9th St, Suite B', 'Ocala, FL 34471'],
} as const
