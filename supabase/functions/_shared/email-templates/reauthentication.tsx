/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import { Heading, Text } from 'npm:@react-email/components@0.0.22'
import { UtaabEmailShell, codeStyle, headingStyle, textStyle } from './utaab-email-shell.tsx'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <UtaabEmailShell preview="Your verification code" disclaimer="This code will expire shortly. If you didn't request it, you can safely ignore this email.">
        <Heading style={headingStyle}>Confirm your identity</Heading>
        <Text style={textStyle}>Use the code below to continue:</Text>
        <Text style={codeStyle}>{token}</Text>
  </UtaabEmailShell>
)

export default ReauthenticationEmail
