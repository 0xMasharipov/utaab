/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

const LOGO_URL = 'https://nxbjgqdehvxszqjoxumx.supabase.co/storage/v1/object/public/media/email%2Flogo-bl.png'

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
    </Head>
    <Preview>Your verification code</Preview>
    <Body style={main}>
      <Container style={wrapper}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img src={LOGO_URL} width="160" height="auto" alt="UTAAB" style={logo} />
          </Section>
          <Text style={tagline}>CONNECT. LEARN. BUILD.</Text>
          <Heading style={h1}>Confirm Your Identity</Heading>
          <Text style={text}>Use the code below to verify your identity:</Text>
          <Text style={codeStyle}>{token}</Text>
          
          <Text style={footer}>
            This code will expire shortly. If you didn't request this, you can safely ignore this email.
          </Text>
          <Text style={powered}>© Powered by UTAAB</Text>
        </Container>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const fontFamily = 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
const main = { backgroundColor: '#081020', fontFamily, padding: '48px 16px' }
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
const divider = { fontFamily, fontSize: '14px', color: '#d0d0d8', textAlign: 'center' as const, margin: '0 0 16px' }
const footer = { fontFamily, fontSize: '12px', color: '#919199', margin: '0 0 8px', textAlign: 'center' as const }
const powered = { fontFamily, fontSize: '11px', color: '#b0b0b8', margin: '0', textAlign: 'center' as const }
