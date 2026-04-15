

# Set Up App Emails (Transactional)

## Summary
Set up the infrastructure to send app emails — welcome messages, notifications, confirmations, etc. — from your verified domain `notify.utaab.org`.

## What will be created

1. **Email infrastructure** — queue system, retry logic, and processing pipeline for reliable delivery
2. **Email sending system** — a single backend function that handles all app email types
3. **Sample template** — a starter React Email template matching UTAAB's brand (navy/white, Montserrat font, UTAAB logo)
4. **Unsubscribe page** — a branded page where recipients can opt out (required for compliance)
5. **Suppression handling** — automatic bounce/complaint tracking to protect sender reputation

## Steps

1. Call `setup_email_infra` to create the database queue and processing pipeline
2. Call `scaffold_transactional_email` to create the sending Edge Function, unsubscribe handler, and sample template
3. Deploy all new Edge Functions
4. Create the unsubscribe page in the app (matching UTAAB's dark theme)
5. Style the sample template to match UTAAB branding (navy background, white card, Montserrat, logo)

## After setup

You'll be able to send emails like:
- Welcome messages after signup
- Contact form confirmations
- Notification emails
- Any custom app email you need

Each new email type just needs a template file — no additional infrastructure. I can create specific templates for your use cases once the foundation is in place.

## No changes to
- Existing auth email templates
- Footer, navbar, or any other page
- Admin panel or database schema

