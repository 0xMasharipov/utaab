# Security Guidelines

## XSS Prevention

This project implements comprehensive XSS (Cross-Site Scripting) prevention measures to protect against malicious content injection.

### Content Sanitization

All user-generated content is sanitized before rendering using a strict allowlist approach:

**Allowed HTML tags:**
- Text formatting: `p`, `b`, `i`, `em`, `strong`, `br`
- Links: `a` (HTTPS only)
- Lists: `ul`, `ol`, `li`
- Headings: `h1`, `h2`, `h3`
- Code: `code`, `pre`, `blockquote`
- Images: `img` (HTTPS or data:image/ only)

**Allowed attributes:**
- `a[href, title, rel, target]` - Links (HTTPS only, rel="noopener noreferrer" enforced)
- `img[src, alt, title]` - Images (HTTPS or data:image/ only)

**Forbidden content:**
- All JavaScript: `<script>` tags, `javascript:` URLs, event handlers (`onclick`, `onerror`, etc.)
- Dangerous tags: `<iframe>`, `<object>`, `<embed>`, `<link>`, `<style>`, `<svg>`, `<math>`, `<form>`
- Non-HTTPS URLs in links and images (except data:image/ for images)

### Safe Content Rendering

**✅ CORRECT - Use SafeContent component:**
```typescript
import { SafeContent } from '@/components/common/SafeContent';

<SafeContent 
  content={userGeneratedHTML} 
  className="prose"
  as="div"
/>
```

**✅ CORRECT - Use sanitizeHTML utility:**
```typescript
import { sanitizeHTML } from '@/lib/sanitize';

const cleanContent = sanitizeHTML(userInput);
```

**❌ NEVER DO THIS:**
```typescript
// DO NOT use dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userContent }} />
```

### When to Use SafeContent

Use the `SafeContent` component whenever rendering content that:
1. Comes from database fields (course descriptions, lesson content, instructor bios, review comments)
2. May contain HTML tags
3. Is controlled by users or admins
4. Could potentially contain malicious content

**Examples:**
- Course titles, descriptions, outcomes, prerequisites
- Lesson titles, descriptions, content
- Instructor biographies
- Review comments
- Any rich text editor output

### Content Security Policy (CSP)

The application enforces a strict Content Security Policy to prevent inline script execution:

```
default-src 'self';
script-src 'self' 'nonce-{RANDOM}';
style-src 'self' 'nonce-{RANDOM}' 'unsafe-inline';
img-src 'self' https: data:;
font-src 'self' data:;
connect-src 'self' https://*.supabase.co https://ai.gateway.lovable.dev;
media-src 'self' https:;
object-src 'none';
frame-ancestors 'none';
base-uri 'none';
form-action 'self';
upgrade-insecure-requests;
```

### Security Headers

The following security headers are enforced:

- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `Referrer-Policy: no-referrer-when-downgrade` - Controls referrer information
- `Permissions-Policy: geolocation=(), microphone=(), camera=()` - Restricts browser features

### Cookie Security

All cookies use secure flags:
- `HttpOnly: true` - Prevents JavaScript access
- `Secure: true` - HTTPS only (production)
- `SameSite: Lax` - Prevents CSRF attacks

### Database Security

**Row-Level Security (RLS):**
All tables have RLS enabled with appropriate policies to ensure users can only access their own data or public content.

**Input Validation:**
Server-side validation using Zod schemas ensures all inputs meet expected formats before database insertion.

**Sanitization Triggers:**
Database triggers automatically sanitize content on INSERT/UPDATE for:
- `courses` table: title, subtitle, description, outcomes, prerequisites
- `lessons` table: title, description
- `instructors` table: bio fields
- `reviews` table: comment field

### Testing for XSS

Run XSS tests regularly to ensure sanitization remains effective:

```bash
npm test src/__tests__/security/
```

The test suite includes 40+ common XSS attack vectors including:
- Script injection
- Event handler injection
- JavaScript URLs
- Data URL injection
- SVG-based XSS
- Style injection
- Encoding bypass attempts

### Incident Response

**If you discover a security vulnerability:**

1. **DO NOT** create a public GitHub issue
2. Email security concerns to: [security contact]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

**If you detect an XSS attack:**

1. Check `security_events` table for suspicious activity
2. Review `audit_log` for unauthorized content modifications
3. Check CSP violation reports in edge function logs
4. Disable affected admin accounts if compromised
5. Review and sanitize all recent content changes

### Security Monitoring

**Audit Logging:**
All admin actions and content modifications are logged in the `audit_log` table.

**Security Events:**
XSS attempts, rate limit violations, and suspicious activity are logged in the `security_events` table.

**CSP Violations:**
Content Security Policy violations are reported to `/csp-report` endpoint for analysis.

### Best Practices for Developers

1. **Never trust user input** - Always sanitize content from users or admins
2. **Use SafeContent component** - Don't use dangerouslySetInnerHTML directly
3. **Validate on server-side** - Client-side validation is not enough
4. **Keep dependencies updated** - Regularly update sanitization libraries
5. **Test with XSS payloads** - Run security tests before deploying
6. **Review RLS policies** - Ensure database access is properly restricted
7. **Enable CSP** - Always enforce Content Security Policy
8. **Log security events** - Monitor for suspicious activity
9. **Use HTTPS everywhere** - Never allow HTTP content
10. **Principle of least privilege** - Grant minimum necessary permissions

### References

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Security Contact

For security concerns, please contact: [Add security contact email]

**Last Updated:** 2025-10-26
