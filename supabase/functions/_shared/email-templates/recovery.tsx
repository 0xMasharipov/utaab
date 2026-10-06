/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import { Button, Heading, Text } from 'npm:@react-email/components@0.0.22'
import { UtaabEmailShell, buttonStyle, headingStyle, textStyle } from './utaab-email-shell.tsx'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <UtaabEmailShell preview={`Reset your password for ${siteName}`} disclaimer="If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.">
        <Heading style={headingStyle}>Reset your password</Heading>
        <Text style={textStyle}>
          We received a request to reset your password for {siteName}. Click
          the button below to choose a new password.
        </Text>
        <Button style={buttonStyle} href={confirmationUrl}>
          Reset Password
        </Button>
  </UtaabEmailShell>
)

export default RecoveryEmail
