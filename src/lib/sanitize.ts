import DOMPurify from 'dompurify';

// Strict allowlist configuration
const ALLOWED_TAGS = [
  'p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 
  'blockquote', 'code', 'pre', 'img', 'h1', 'h2', 'h3', 'br'
];

const ALLOWED_ATTR = ['href', 'title', 'rel', 'target', 'src', 'alt'];

// Configure DOMPurify
DOMPurify.setConfig({
  ALLOWED_TAGS,
  ALLOWED_ATTR,
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'link', 'svg', 'math'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'srcset'],
});

// URL validation and security attribute enforcement
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  // Enforce HTTPS for links
  if (node.tagName === 'A') {
    const href = node.getAttribute('href');
    if (href && !href.startsWith('https://') && !href.startsWith('#') && !href.startsWith('/')) {
      node.removeAttribute('href');
    }
    // Add security attributes
    node.setAttribute('rel', 'noopener noreferrer');
  }
  
  // Enforce HTTPS for images (except data: URIs)
  if (node.tagName === 'IMG') {
    const src = node.getAttribute('src');
    if (src && !src.startsWith('https://') && !src.startsWith('data:image/')) {
      node.removeAttribute('src');
    }
  }
});

/**
 * SECURITY: Sanitizes HTML content using a strict allowlist approach.
 * Only allows safe tags and attributes, blocks all event handlers and dangerous content.
 * 
 * @param dirty - The HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHTML(dirty: string | null | undefined): string {
  if (!dirty) return '';
  
  return DOMPurify.sanitize(dirty, {
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM: false,
  });
}

/**
 * SECURITY: Sanitizes Markdown content by converting to HTML first, then sanitizing.
 * For now, this is a passthrough to sanitizeHTML. If you add a Markdown library,
 * convert Markdown to HTML first, then sanitize the result.
 * 
 * @param markdown - The Markdown string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeMarkdown(markdown: string | null | undefined): string {
  if (!markdown) return '';
  return sanitizeHTML(markdown);
}
