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
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
  token?: string
}

const LOGO_URL = 'https://nxbjgqdehvxszqjoxumx.supabase.co/storage/v1/object/public/media/email%2Futaab-logo.png'

export const MagicLinkEmail = ({
  token,
}: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
      
    </Head>
    <Preview>Your verification code for UTAAB</Preview>
    <Body style={main}>
      <Container style={wrapper}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img src={LOGO_URL} width="160" height="auto" alt="UTAAB" style={logo} />
          </Section>
          <Text style={tagline}>CONNECT. LEARN. BUILD.</Text>
          <Heading style={h1}>Your Verification Code</Heading>
          <Text style={text}>
            Use the code below to verify your identity. This code will expire shortly.
          </Text>
          <Text style={codeStyle}>{token}</Text>
          <Text style={footer}>
            If you didn't request this code, you can safely ignore this email.
          </Text>
          <Text style={powered}>© Powered by UTAAB</Text>
        </Container>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const fontFamily = 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
const main = { backgroundColor: '#F4F7FB', fontFamily, padding: '48px 16px' }
const wrapper = { maxWidth: '480px', margin: '0 auto' }
const container = { backgroundColor: '#ffffff', borderRadius: '20px', padding: '48px 36px 40px', border: '1px solid #e8e8ec', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }
const logoSection = { textAlign: 'center' as const, marginBottom: '8px' }
const logo = { display: 'inline-block' as const }
const tagline = { fontFamily, fontSize: '11px', fontWeight: '600' as const, color: '#919199', textAlign: 'center' as const, letterSpacing: '3px', margin: '0 0 28px' }
const h1 = { fontFamily, fontSize: '24px', fontWeight: '700' as const, color: '#081020', margin: '0 0 16px', textAlign: 'center' as const }
const text = { fontFamily, fontSize: '14px', color: '#4A4A52', lineHeight: '1.7', margin: '0 0 28px', textAlign: 'center' as const }
const codeStyle = {
  fontFamily: 'Montserrat, Courier, monospace',
  fontSize: '32px',
  fontWeight: '700' as const,
  color: '#0B3C8C',
  margin: '0 0 32px',
  textAlign: 'center' as const,
  letterSpacing: '6px',
  backgroundColor: '#F5F7FA',
  borderRadius: '12px',
  padding: '16px',
}
const footer = { fontFamily, fontSize: '12px', color: '#919199', margin: '0 0 8px', textAlign: 'center' as const }
const powered = { fontFamily, fontSize: '11px', color: '#b0b0b8', margin: '0', textAlign: 'center' as const }
