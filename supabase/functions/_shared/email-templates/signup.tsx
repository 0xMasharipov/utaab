/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Button,
  Heading,
  Link,
  Text,
} from 'npm:@react-email/components@0.0.22'
import {
  UtaabEmailShell,
  buttonStyle,
  codeStyle,
  headingStyle,
  linkStyle,
  textStyle,
} from './utaab-email-shell.tsx'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
  token?: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
  token,
}: SignupEmailProps) => (
  <UtaabEmailShell
    preview={`Confirm your email for ${siteName}`}
    disclaimer="If you didn't create this account, you can safely ignore this email."
  >
        <Heading style={headingStyle}>Confirm your email</Heading>
        <Text style={textStyle}>
          Thanks for signing up for{' '}
          <Link href={siteUrl} style={linkStyle}>
            <strong>{siteName}</strong>
          </Link>
          !
        </Text>
        <Text style={textStyle}>
          Confirm{' '}
          <Link href={`mailto:${recipient}`} style={linkStyle}>
            {recipient}
          </Link>{' '}
          using the verification code or button below.
        </Text>
        {token ? <Text style={codeStyle}>{token}</Text> : null}
        <Button style={buttonStyle} href={confirmationUrl}>
          Verify Email
        </Button>
  </UtaabEmailShell>
)

export default SignupEmail
