/**
 * WhatsApp Community Integration Configuration
 * 
 * Centralized configuration for WhatsApp community redirects after form submissions.
 * Update the communityLink here to change it across all forms.
 */

export const WHATSAPP_CONFIG = {
  // Main WhatsApp community invite link
  communityLink: 'https://chat.whatsapp.com/CK7HCwZWS8b0A9mNQIT700',
  
  // Delay before auto-redirect (in milliseconds)
  redirectDelay: 2000, // 2 seconds
  
  /**
   * Get the appropriate WhatsApp URL for the current device
   * The link works universally for mobile (opens app) and desktop (opens WhatsApp Web)
   */
  getWhatsAppUrl: () => {
    return WHATSAPP_CONFIG.communityLink;
  },
  
  /**
   * Open WhatsApp in a new tab with proper security attributes
   * Works on both mobile (opens app) and desktop (opens WhatsApp Web)
   */
  openWhatsApp: () => {
    window.open(
      WHATSAPP_CONFIG.getWhatsAppUrl(), 
      '_blank', 
      'noopener,noreferrer'
    );
  }
};
