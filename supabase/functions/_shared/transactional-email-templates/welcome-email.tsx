import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Img, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'UTAAB'
const LOGO_URL = 'https://nxbjgqdehvxszqjoxumx.supabase.co/storage/v1/object/public/media/email%2Futaab-logo.png'

interface WelcomeEmailProps {
  name?: string
}

const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
    </Head>
    <Preview>Welcome to {SITE_NAME} — Connect. Learn. Build.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img src={LOGO_URL} alt={SITE_NAME} width="180" style={logo} />
        </Section>

        <Section style={card}>
          <Heading style={h1}>
            {name ? `Welcome, ${name}!` : `Welcome to ${SITE_NAME}!`}
          </Heading>

          <Text style={tagline}>CONNECT · LEARN · BUILD</Text>

          <Text style={text}>
            Thank you for joining {SITE_NAME}. We're an innovation-driven ecosystem where
            ideas evolve into real-world projects — powered by blockchain, collaboration,
            and a shared vision.
          </Text>

          <Text style={text}>
            Explore our courses, connect with the community, and start building today.
          </Text>

          <Hr style={divider} />

          <Text style={footer}>
            © Powered by {SITE_NAME}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WelcomeEmail,
  subject: (data: Record<string, any>) =>
    data.name ? `Welcome to ${SITE_NAME}, ${data.name}!` : `Welcome to ${SITE_NAME}!`,
  displayName: 'Welcome email',
  previewData: { name: 'Jane' },
} satisfies TemplateEntry

// Styles — matches UTAAB auth email branding
const main: React.CSSProperties = {
  backgroundColor: '#081020',
  fontFamily: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
  padding: '40px 0',
}

const container: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
}

const logoSection: React.CSSProperties = {
  textAlign: 'center' as const,
  padding: '0 0 24px',
}

const logo: React.CSSProperties = {
  margin: '0 auto',
}

const card: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '40px 32px',
}

const h1: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#081020',
  margin: '0 0 8px',
  textAlign: 'center' as const,
}

const tagline: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: '#6366f1',
  letterSpacing: '3px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}

const text: React.CSSProperties = {
  fontSize: '15px',
  color: '#374151',
  lineHeight: '1.6',
  margin: '0 0 16px',
}

const divider: React.CSSProperties = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
}

const footer: React.CSSProperties = {
  fontSize: '12px',
  color: '#9ca3af',
  textAlign: 'center' as const,
  margin: 0,
}
