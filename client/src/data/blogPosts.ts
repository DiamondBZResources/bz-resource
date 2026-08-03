import blogConnecting from '../assets/generated/blog-connecting'
import blogFloridaMarket from '../assets/generated/blog-florida-market'
import blogJobAds from '../assets/generated/blog-job-ads'
import blogMidYear from '../assets/generated/blog-mid-year'
import blogNavigating from '../assets/generated/blog-navigating'
import blogSocialNetwork from '../assets/generated/blog-social-network'
import blogStaffingSimple from '../assets/generated/blog-staffing-simple'
import blogTransitioning from '../assets/generated/blog-transitioning'
import type { ResponsiveImageSource } from '../components/ResponsiveImage'

export type BlogPost = {
  title: string
  date: string
  category: string
  author: string
  excerpt: string
  image: ResponsiveImageSource
  href: string
}

export const blogPosts: BlogPost[] = [
  {
    title:
      'The Mid-Year Hiring Reality in Florida: What Employers and Job Seekers Are Dealing With Right Now',
    date: 'Jun 29, 2026',
    category: 'Hiring Tips',
    author: 'Admin',
    excerpt:
      "Florida's job market has been a consistent headline story, and for good reason. The state is growing fast, the economy...",
    image: blogMidYear,
    href: 'https://bz-resources.com/the-mid-year-hiring-reality-in-florida-what-employers-and-job-seekers-are-dealing-with-right-now/',
  },
  {
    title:
      'Florida’s Job Market in 2026: What Makes It Stand Out and What It Means for Employers and Job Seekers',
    date: 'Apr 22, 2026',
    category: 'Uncategorized',
    author: 'Admin',
    excerpt:
      'The job market across the United States continues to evolve in 2026, shaped by shifting economic conditions,...',
    image: blogFloridaMarket,
    href: 'https://bz-resources.com/floridas-job-market-in-2026-what-makes-it-stand-out-and-what-it-means-for-employers-and-job-seekers/',
  },
  {
    title:
      'Connecting Talent and Opportunity: How BZ-Resources Bridges the Gap for Companies and Job Seekers',
    date: 'Dec 11, 2024',
    category: 'Hiring Tips',
    author: 'Admin',
    excerpt:
      'In today’s dynamic job market, both businesses and job seekers face unique challenges. Companies need skilled talent...',
    image: blogConnecting,
    href: 'https://bz-resources.com/connecting-talent-and-opportunity-how-bz-resources-bridges-the-gap-for-companies-and-job-seekers/',
  },
  {
    title: 'Tapping Into the Social Network Talent Pool for Recruitment Success',
    date: 'Nov 5, 2024',
    category: 'Hiring Tips',
    author: 'Admin',
    excerpt:
      "In today's digital age, social media isn't just a place to share cat videos and vacation photos—it is a powerful tool...",
    image: blogSocialNetwork,
    href: 'https://bz-resources.com/tapping-into-the-social-network-talent-pool-for-recruitment-success/',
  },
  {
    title: 'Navigating the Turbulent Waters of Staffing',
    date: 'Sep 20, 2024',
    category: 'Hiring Tips',
    author: 'Admin',
    excerpt:
      "Staffing issues can be the Achilles' heel for any business. The workforce is the lifeblood of an organization, and...",
    image: blogNavigating,
    href: 'https://bz-resources.com/navigating-the-turbulent-waters-of-staffing/',
  },
  {
    title: 'Transitioning with Success: BZ-Resources Expands Staffing',
    date: 'Jun 21, 2024',
    category: 'Hiring Tips',
    author: 'Admin',
    excerpt:
      'Change is a natural part of growth, and at BZ-Resources.com, we are thrilled to announce our expansion from the sunny...',
    image: blogTransitioning,
    href: 'https://bz-resources.com/transitioning-with-success-bz-resources-expands-staffing/',
  },
  {
    title: 'How to Create Job Ads That Will Attract the Right Candidates',
    date: 'Oct 10, 2023',
    category: 'Hiring Tips',
    author: 'Admin',
    excerpt:
      "Finding the right candidate for your business can be challenging, and that's where staffing agencies like BZ Resources...",
    image: blogJobAds,
    href: 'https://bz-resources.com/how-to-create-job-ads-that-will-attract-the-right-candidates/',
  },
  {
    title: 'Staffing Made Simple with BZ Resources: 5 Easy Tips for Better Hiring',
    date: 'Sep 25, 2023',
    category: 'Hiring Tips',
    author: 'Admin',
    excerpt:
      'As a business owner, you’ll know that hiring new staff is one of the most...',
    image: blogStaffingSimple,
    href: 'https://bz-resources.com/staffing-made-simple-with-bz-resources-5-easy-tips-for-better-hiring/',
  },
]
