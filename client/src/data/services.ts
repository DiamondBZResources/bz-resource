import { assetPath } from '../lib/assets'

export type Service = {
  title: string
  image: string
  width: number
  height: number
  alt: string
  description: string
}

export const services: Service[] = [
  {
    title: 'Recruiting',
    image: assetPath('images/Recruitment.jpg'),
    width: 6016,
    height: 4016,
    alt: 'Recruitment professional greeting a candidate',
    description:
      'BZ Resources matches top-tier talent with each company culture and role requirement. The team searches for candidates who align with business needs so placements can support the organization from the start.',
  },
  {
    title: 'Screening',
    image: assetPath('images/screening.jpg'),
    width: 6000,
    height: 4000,
    alt: 'Professional candidates prepared for screening',
    description:
      'The screening process helps save time by assessing qualifications, skills, and fit before candidates are presented. Employers receive a refined selection of people suited to the role and company values.',
  },
  {
    title: 'Training',
    image: assetPath('images/training.jpg'),
    width: 6583,
    height: 4389,
    alt: 'Workplace training presentation',
    description:
      'Training solutions support onboarding and skill development so employees can become productive, confident, and ready to contribute to a stronger team.',
  },
  {
    title: 'Tracking',
    image: assetPath('images/tracking.jpg'),
    width: 3800,
    height: 2138,
    alt: 'Business professional managing workforce tracking',
    description:
      'Tracking support gives employers insight into recruiting and HR activity, helping teams monitor candidate progress, streamline communication, and make informed decisions.',
  },
  {
    title: 'Payroll',
    image: assetPath('images/payroll.jpg'),
    width: 5184,
    height: 3888,
    alt: 'Payroll calculations and financial paperwork',
    description:
      'Payroll service helps manage processing, tax compliance, and timely payments so employers can focus on core business activity while employees receive dependable support.',
  },
  {
    title: "Workers' Comp",
    image: assetPath('images/workersComp.jpg'),
    width: 7508,
    height: 5005,
    alt: 'Safety helmet representing workers compensation',
    description:
      'Workers compensation support helps protect employees and the business in the event of workplace injuries, giving teams more peace of mind while they do their work.',
  },
]
