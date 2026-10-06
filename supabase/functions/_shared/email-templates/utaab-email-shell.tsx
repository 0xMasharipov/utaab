/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

const LOGO_URL = 'https://nxbjgqdehvxszqjoxumx.supabase.co/storage/v1/object/public/media/email%2Futaab-logo.png'

interface UtaabEmailShellProps {
  preview: string
  disclaimer: string
  children: React.ReactNode
}

export const UtaabEmailShell = ({ preview, disclaimer, children }: UtaabEmailShellProps) => (
  <Html lang="en" dir="ltr">
    <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
    </Head>
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={card}>
          <Img src={LOGO_URL} alt="UTAAB" width="160" style={logo} />
          <Text style={tagline}>CONNECT · LEARN · BUILD</Text>
          {children}
          <Hr style={divider} />
          <Text style={footerDisclaimer}>{disclaimer}</Text>
          <Text style={footerCopy}>© Powered by UTAAB</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const headingStyle: React.CSSProperties = {
  color: '#081020',
  fontSize: '24px',
  fontWeight: 700,
  margin: '0 0 20px',
  textAlign: 'center',
}

export const textStyle: React.CSSProperties = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 20px',
  textAlign: 'center',
}

export const linkStyle: React.CSSProperties = {
  color: '#081020',
  fontWeight: 600,
  textDecoration: 'underline',
}

export const buttonStyle: React.CSSProperties = {
  backgroundColor: '#081020',
  borderRadius: '10px',
  color: '#ffffff',
  display: 'block',
  fontSize: '14px',
  fontWeight: 700,
  margin: '4px auto 24px',
  padding: '14px 28px',
  textAlign: 'center',
  textDecoration: 'none',
}

export const codeStyle: React.CSSProperties = {
  backgroundColor: '#081020',
  borderRadius: '10px',
  color: '#ffffff',
  fontFamily: "'Montserrat', monospace",
  fontSize: '30px',
  fontWeight: 700,
  letterSpacing: '10px',
  margin: '4px 0 24px',
  padding: '18px 12px',
  textAlign: 'center',
}

const main: React.CSSProperties = {
  backgroundColor: '#081020',
  fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  padding: '40px 12px',
}

const container: React.CSSProperties = { margin: '0 auto', maxWidth: '480px' }
const card: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e8e8ec',
  borderRadius: '20px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  padding: '40px 36px',
}
const logo: React.CSSProperties = { margin: '0 auto 12px' }
const tagline: React.CSSProperties = {
  color: '#919199',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '3px',
  margin: '0 0 32px',
  textAlign: 'center',
}
const divider: React.CSSProperties = { borderColor: '#e5e7eb', margin: '24px 0' }
const footerDisclaimer: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0 0 4px',
  textAlign: 'center',
}
const footerCopy: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: 0,
  textAlign: 'center',
}