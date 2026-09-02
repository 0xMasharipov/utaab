import { SignupEmail } from '../email-templates/signup.tsx'
import type { TemplateEntry } from './registry.ts'

// Branded signup confirmation used by the education signup / resend-code flows.
// Reuses the shared signup email component so auth and education signups look identical.
export const template = {
  component: SignupEmail,
  subject: 'Confirm your email',
  displayName: 'Signup confirmation',
  previewData: {
    siteName: 'utaab',
    siteUrl: 'https://utaab.org',
    recipient: 'user@example.test',
    confirmationUrl: 'https://utaab.org/education',
    token: '123456',
  },
} satisfies TemplateEntry
