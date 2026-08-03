import payrollImage from '../assets/generated/payroll'
import recruitmentImage from '../assets/generated/recruitment'
import screeningImage from '../assets/generated/screening'
import trackingImage from '../assets/generated/tracking'
import trainingImage from '../assets/generated/training'
import workersCompImage from '../assets/generated/workers-comp'
import type { ResponsiveImageSource } from '../components/ResponsiveImage'

export type Service = {
  title: string
  image: ResponsiveImageSource
  alt: string
  description: string
}

export const services: Service[] = [
  {
    title: 'Recruiting',
    image: recruitmentImage,
    alt: 'Recruitment professional greeting a candidate',
    description:
      'BZ Resources matches top-tier talent with each company culture and role requirement. The team searches for candidates who align with business needs so placements can support the organization from the start.',
  },
  {
    title: 'Screening',
    image: screeningImage,
    alt: 'Professional candidates prepared for screening',
    description:
      'The screening process helps save time by assessing qualifications, skills, and fit before candidates are presented. Employers receive a refined selection of people suited to the role and company values.',
  },
  {
    title: 'Training',
    image: trainingImage,
    alt: 'Workplace training presentation',
    description:
      'Training solutions support onboarding and skill development so employees can become productive, confident, and ready to contribute to a stronger team.',
  },
  {
    title: 'Tracking',
    image: trackingImage,
    alt: 'Business professional managing workforce tracking',
    description:
      'Tracking support gives employers insight into recruiting and HR activity, helping teams monitor candidate progress, streamline communication, and make informed decisions.',
  },
  {
    title: 'Payroll',
    image: payrollImage,
    alt: 'Payroll calculations and financial paperwork',
    description:
      'Payroll service helps manage processing, tax compliance, and timely payments so employers can focus on core business activity while employees receive dependable support.',
  },
  {
    title: "Workers' Comp",
    image: workersCompImage,
    alt: 'Safety helmet representing workers compensation',
    description:
      'Workers compensation support helps protect employees and the business in the event of workplace injuries, giving teams more peace of mind while they do their work.',
  },
]
