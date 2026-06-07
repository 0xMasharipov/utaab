/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

const LOGO_URL =
  'https://nxbjgqdehvxszqjoxumx.supabase.co/storage/v1/object/public/media/email%2Futaab-logo.png'
const TAGLINE = 'CONNECT · LEARN · BUILD'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => {
  const brand = siteName || 'UTAAB'
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>You're invited to join {brand}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            <Img src={LOGO_URL} alt={brand} width="160" style={logo} />
            <Text style={tagline}>{TAGLINE}</Text>

            <Heading style={h1}>You're invited to {brand}</Heading>

            <Text style={text}>
              You've been invited to join{' '}
              <Link href={siteUrl} style={brandLink}>
                <strong>{brand}</strong>
              </Link>
              . Accept the invitation to create your account and start
              building with the community.
            </Text>

            <Section style={buttonWrap}>
              <Button style={button} href={confirmationUrl}>
                Accept Invitation
              </Button>
            </Section>


            <Hr style={divider} />

            <Text style={footerDisclaimer}>
              If you weren't expecting this invitation, you can safely ignore
              this email.
            </Text>
            <Text style={footerCopy}>© Powered by {brand}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default InviteEmail

const main: React.CSSProperties = {
  backgroundColor: '#081020',
  fontFamily:
    "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  padding: '40px 0',
}
const container: React.CSSProperties = { maxWidth: '480px', margin: '0 auto' }
const card: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  border: '1px solid #e8e8ec',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  padding: '40px 36px 40px',
}
const logo: React.CSSProperties = { margin: '0 auto 12px' }
const tagline: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: '#919199',
  letterSpacing: '3px',
  textAlign: 'center' as const,
  margin: '0 0 32px',
}
const h1: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#081020',
  margin: '0 0 20px',
  textAlign: 'center' as const,
}
const text: React.CSSProperties = {
  fontSize: '15px',
  color: '#374151',
  lineHeight: '1.6',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}
const brandLink: React.CSSProperties = {
  color: '#081020',
  textDecoration: 'underline',
}
const buttonWrap: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '0 0 24px',
}
const button: React.CSSProperties = {
  backgroundColor: '#081020',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 700,
  borderRadius: '10px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block',
}
const divider: React.CSSProperties = { borderColor: '#e5e7eb', margin: '24px 0' }
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
