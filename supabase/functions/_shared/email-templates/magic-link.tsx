/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import { Button, Heading, Text } from 'npm:@react-email/components@0.0.22'
import { UtaabEmailShell, buttonStyle, headingStyle, textStyle } from './utaab-email-shell.tsx'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <UtaabEmailShell preview={`Your login link for ${siteName}`} disclaimer="If you didn't request this link, you can safely ignore this email.">
        <Heading style={headingStyle}>Your login link</Heading>
        <Text style={textStyle}>
          Click the button below to log in to {siteName}. This link will expire
          shortly.
        </Text>
        <Button style={buttonStyle} href={confirmationUrl}>
          Log In
        </Button>
  </UtaabEmailShell>
)

export default MagicLinkEmail
