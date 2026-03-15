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

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

const LOGO_URL = 'https://nxbjgqdehvxszqjoxumx.supabase.co/storage/v1/object/public/media/email%2Flogo.png'

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to {siteName} — confirm your email</Preview>
    <Body style={main}>
      <Container style={wrapper}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img src={LOGO_URL} width="140" height="auto" alt={siteName} style={logo} />
          </Section>
          <Heading style={h1}>Welcome to {siteName}</Heading>
          <Text style={text}>
            Thanks for signing up! Please confirm your email address (
            <Link href={`mailto:${recipient}`} style={link}>
              {recipient}
            </Link>
            ) by clicking the button below:
          </Text>
          <Section style={buttonSection}>
            <Button style={button} href={confirmationUrl}>
              Get Started
            </Button>
          </Section>
          <Text style={footer}>
            If you didn't create an account, you can safely ignore this email.
          </Text>
          <Text style={powered}>Powered by {siteName}</Text>
        </Container>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = {
  backgroundColor: '#081020',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '40px 0',
}
const wrapper = {
  maxWidth: '480px',
  margin: '0 auto',
}
const container = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '40px 32px',
  border: '1px solid #e8e8ec',
}
const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '24px',
}
const logo = {
  display: 'inline-block' as const,
}
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#081020',
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: '#4A4A52',
  lineHeight: '1.6',
  margin: '0 0 25px',
}
const link = { color: '#0B3C8C', textDecoration: 'underline' }
const buttonSection = {
  textAlign: 'center' as const,
  margin: '0 0 25px',
}
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
