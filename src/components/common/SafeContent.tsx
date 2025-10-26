import { sanitizeHTML } from '@/lib/sanitize';

interface SafeContentProps {
  content: string | null | undefined;
  className?: string;
  as?: 'div' | 'span' | 'p';
}

/**
 * SECURITY: SafeContent component for rendering user-generated HTML safely.
 * Always sanitizes content before rendering to prevent XSS attacks.
 * 
 * Usage:
 *   <SafeContent content={userGeneratedHTML} className="prose" />
 * 
 * IMPORTANT: Use this component whenever rendering content that:
 * - Comes from database fields (course descriptions, lesson content, bios, comments)
 * - May contain HTML tags
 * - Is controlled by users or admins
 * 
 * DO NOT use dangerouslySetInnerHTML directly without sanitization!
 */
export const SafeContent = ({ content, className, as: Component = 'div' }: SafeContentProps) => {
  // SECURITY: Always sanitize before rendering
  const sanitized = sanitizeHTML(content);
  
  // If content is empty after sanitization, don't render anything
  if (!sanitized) {
    return null;
  }
  
  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};
