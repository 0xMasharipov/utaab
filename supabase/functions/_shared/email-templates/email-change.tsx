/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

const LOGO_URL = 'https://nxbjgqdehvxszqjoxumx.supabase.co/storage/v1/object/public/media/email%2Futaab-logo.png'

export const EmailChangeEmail = ({
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `@media (prefers-color-scheme: dark) { body, .email-bg { background-color: #081020 !important; } }` }} />
    </Head>
    <Preview>Confirm your email change for UTAAB</Preview>
    <Body style={main}>
      <Container style={wrapper}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img src={LOGO_URL} width="160" height="auto" alt="UTAAB" style={logo} />
          </Section>
          <Text style={tagline}>CONNECT. LEARN. BUILD.</Text>
          <Heading style={h1}>Confirm Email Change</Heading>
          <Text style={text}>
            You requested to change your email for UTAAB from{' '}
            <Link href={`mailto:${email}`} style={link}>{email}</Link>{' '}
            to{' '}
            <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>.
          </Text>
          <Section style={buttonSection}>
            <Button style={button} href={confirmationUrl}>
              Confirm Email Change
            </Button>
          </Section>
          <Text style={footer}>
            If you didn't request this change, please secure your account immediately.
          </Text>
          <Text style={powered}>© Powered by UTAAB</Text>
        </Container>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const fontFamily = 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
const main = { backgroundColor: '#F4F7FB', fontFamily, padding: '48px 16px' }
const wrapper = { maxWidth: '480px', margin: '0 auto' }
const container = { backgroundColor: '#ffffff', borderRadius: '20px', padding: '48px 36px 40px', border: '1px solid #e8e8ec', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }
const logoSection = { textAlign: 'center' as const, marginBottom: '8px' }
const logo = { display: 'inline-block' as const }
const tagline = { fontFamily, fontSize: '11px', fontWeight: '600' as const, color: '#919199', textAlign: 'center' as const, letterSpacing: '3px', margin: '0 0 28px' }
const h1 = { fontFamily, fontSize: '24px', fontWeight: '700' as const, color: '#081020', margin: '0 0 16px', textAlign: 'center' as const }
const text = { fontFamily, fontSize: '14px', color: '#4A4A52', lineHeight: '1.7', margin: '0 0 28px', textAlign: 'center' as const }
const link = { color: '#0B3C8C', textDecoration: 'underline' }
const buttonSection = { textAlign: 'center' as const, margin: '0 0 28px' }
const button = { fontFamily, backgroundColor: '#0B3C8C', color: '#ffffff', fontSize: '14px', fontWeight: '600' as const, borderRadius: '12px', padding: '14px 32px', textDecoration: 'none', display: 'inline-block' as const }
const footer = { fontFamily, fontSize: '12px', color: '#919199', margin: '0 0 8px', textAlign: 'center' as const }
const powered = { fontFamily, fontSize: '11px', color: '#b0b0b8', margin: '0', textAlign: 'center' as const }
