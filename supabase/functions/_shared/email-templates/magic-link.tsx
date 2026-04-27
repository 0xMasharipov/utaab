/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl?: string
  token?: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
  token,
}: MagicLinkEmailProps) => {
  const hasCode = typeof token === 'string' && token.length > 0
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your sign-in code for {siteName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your sign-in code</Heading>
          <Text style={text}>
            Use the 6-digit code below to finish signing in to {siteName}. This
            code expires shortly.
          </Text>
          {hasCode && (
            <Section style={codeBox}>
              <Text style={codeText}>{token}</Text>
            </Section>
          )}
          {confirmationUrl && (
            <>
              <Text style={text}>
                Or click the button to sign in directly:
              </Text>
              <Button style={button} href={confirmationUrl}>
                Sign In
              </Button>
            </>
          )}
          <Text style={footer}>
            If you didn't request this, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 25px' }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#000000',
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: '#55575d',
  lineHeight: '1.5',
  margin: '0 0 20px',
}
const codeBox = {
  background: '#0b1a3a',
  borderRadius: '10px',
  padding: '18px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}
const codeText = {
  fontSize: '28px',
  letterSpacing: '8px',
  color: '#ffffff',
  fontWeight: 'bold' as const,
  margin: 0,
}
const button = {
  backgroundColor: '#0b1a3a',
  color: '#ffffff',
  fontSize: '14px',
  borderRadius: '8px',
  padding: '12px 20px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
