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
        {/* White card with logo inside */}
        <Section style={card}>
          <Img src={LOGO_URL} alt={SITE_NAME} width="160" style={logo} />
          <Text style={tagline}>CONNECT · LEARN · BUILD</Text>

          <Heading style={h1}>
            {name ? `Welcome, ${name}!` : `Welcome to ${SITE_NAME}!`}
          </Heading>

          <Text style={text}>
            Thank you for joining {SITE_NAME}. We're an innovation-driven ecosystem where
            ideas evolve into real-world projects — powered by blockchain, collaboration,
            and a shared vision.
          </Text>

          <Text style={text}>
            Explore our courses, connect with the community, and start building today.
          </Text>

          <Hr style={divider} />

          <Text style={footerDisclaimer}>
            You received this email because you joined {SITE_NAME}.
          </Text>
          <Text style={footerCopy}>
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

// ── Styles ──────────────────────────────────────────────────────────
const main: React.CSSProperties = {
  backgroundColor: '#081020',
  fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  padding: '40px 0',
}

const container: React.CSSProperties = {
  maxWidth: '480px',
  margin: '0 auto',
}

const logo: React.CSSProperties = {
  margin: '0 auto 12px',
}

const tagline: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: '#919199',
  letterSpacing: '3px',
  textAlign: 'center' as const,
  margin: '0 0 32px',
}

const card: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  border: '1px solid #e8e8ec',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  padding: '40px 36px 40px',
}

const h1: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#081020',
  margin: '0 0 24px',
  textAlign: 'center' as const,
}

const text: React.CSSProperties = {
  fontSize: '15px',
  color: '#374151',
  lineHeight: '1.6',
  textAlign: 'center' as const,
  margin: '0 0 16px',
}

const divider: React.CSSProperties = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
}

const footerDisclaimer: React.CSSProperties = {
  fontSize: '12px',
  color: '#9ca3af',
  textAlign: 'center' as const,
  margin: '0 0 4px',
}

const footerCopy: React.CSSProperties = {
  fontSize: '12px',
  color: '#9ca3af',
  textAlign: 'center' as const,
  margin: 0,
}
