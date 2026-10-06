/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import { Button, Heading, Link, Text } from 'npm:@react-email/components@0.0.22'
import { UtaabEmailShell, buttonStyle, headingStyle, linkStyle, textStyle } from './utaab-email-shell.tsx'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <UtaabEmailShell preview={`You've been invited to join ${siteName}`} disclaimer="If you weren't expecting this invitation, you can safely ignore this email.">
        <Heading style={headingStyle}>You've been invited</Heading>
        <Text style={textStyle}>
          You've been invited to join{' '}
          <Link href={siteUrl} style={linkStyle}>
            <strong>{siteName}</strong>
          </Link>
          . Click the button below to accept the invitation and create your
          account.
        </Text>
        <Button style={buttonStyle} href={confirmationUrl}>
          Accept Invitation
        </Button>
  </UtaabEmailShell>
)

export default InviteEmail
