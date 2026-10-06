/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import { Button, Heading, Link, Text } from 'npm:@react-email/components@0.0.22'
import { UtaabEmailShell, buttonStyle, headingStyle, linkStyle, textStyle } from './utaab-email-shell.tsx'

interface EmailChangeEmailProps {
  siteName: string
  // oldEmail is the user's current address (HookData.OldEmail). For the
  // NEW-recipient half of a secure email_change fanout, `email` equals the
  // recipient (NEW), so the "from" line must render oldEmail to read
  // "from OLD to NEW" instead of "from NEW to NEW".
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  oldEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <UtaabEmailShell preview={`Confirm your email change for ${siteName}`} disclaimer="If you didn't request this change, please secure your account immediately.">
        <Heading style={headingStyle}>Confirm your email change</Heading>
        <Text style={textStyle}>
          You requested to change your email address for {siteName} from{' '}
          <Link href={`mailto:${oldEmail}`} style={linkStyle}>
            {oldEmail}
          </Link>{' '}
          to{' '}
          <Link href={`mailto:${newEmail}`} style={linkStyle}>
            {newEmail}
          </Link>
          .
        </Text>
        <Text style={textStyle}>
          Click the button below to confirm this change:
        </Text>
        <Button style={buttonStyle} href={confirmationUrl}>
          Confirm Email Change
        </Button>
  </UtaabEmailShell>
)

export default EmailChangeEmail
