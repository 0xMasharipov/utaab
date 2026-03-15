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
}

const LOGO_URL = 'https://nxbjgqdehvxszqjoxumx.supabase.co/storage/v1/object/public/media/email%2Flogo.png'

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your login link for {siteName}</Preview>
    <Body style={main}>
      <Container style={wrapper}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img src={LOGO_URL} width="140" height="auto" alt={siteName} style={logo} />
          </Section>
          <Heading style={h1}>Your login link</Heading>
          <Text style={text}>
            Click the button below to sign in to {siteName}. This link will expire
            shortly.
          </Text>
          <Section style={buttonSection}>
            <Button style={button} href={confirmationUrl}>
              Sign In to {siteName}
            </Button>
          </Section>
          <Text style={footer}>
            If you didn't request this link, you can safely ignore this email.
          </Text>
          <Text style={powered}>Powered by {siteName}</Text>
        </Container>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = {
  backgroundColor: '#081020',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '40px 0',
}
const wrapper = { maxWidth: '480px', margin: '0 auto' }
const container = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '40px 32px',
  border: '1px solid #e8e8ec',
}
const logoSection = { textAlign: 'center' as const, marginBottom: '24px' }
const logo = { display: 'inline-block' as const }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#081020', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#4A4A52', lineHeight: '1.6', margin: '0 0 25px' }
const buttonSection = { textAlign: 'center' as const, margin: '0 0 25px' }
const button = {
  backgroundColor: '#0B3C8C',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600' as const,
  borderRadius: '16px',
  padding: '12px 24px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#919199', margin: '30px 0 0' }
const powered = { fontSize: '11px', color: '#b0b0b8', margin: '12px 0 0', textAlign: 'center' as const }
