/**
 * Client-side fingerprinting utilities for UTAAB Anti-bot system
 * Collects non-invasive browser fingerprint data
 */

export interface BrowserFingerprint {
  hash: string;
  webglRenderer?: string;
  screenResolution?: string;
  timezone?: number;
  languages?: string[];
  hardwareConcurrency?: number;
  deviceMemory?: number;
  touchSupport?: boolean;
  canvas?: string;
  audioContext?: boolean;
}

// Generate canvas fingerprint
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    canvas.width = 200;
    canvas.height = 50;

    // Draw text with various styles
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('UTAAB 🔒', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('UTAAB 🔒', 4, 17);

    return canvas.toDataURL();
  } catch {
    return '';
  }
}

// Get WebGL renderer info
function getWebGLRenderer(): string | undefined {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return undefined;

    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'Unknown';

    return (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  } catch {
    return undefined;
  }
}

// Check audio context availability
function hasAudioContext(): boolean {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return false;
    
    const ctx = new AudioContext();
    ctx.close();
    return true;
  } catch {
    return false;
  }
}

// Hash a string using SHA-256
async function hashString(str: string): Promise<string> {
  const data = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Collect browser fingerprint data
 */
export async function collectFingerprint(): Promise<BrowserFingerprint> {
  const canvas = getCanvasFingerprint();
  const webglRenderer = getWebGLRenderer();
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const timezone = new Date().getTimezoneOffset();
  const languages = navigator.languages ? [...navigator.languages] : [navigator.language];
  const hardwareConcurrency = navigator.hardwareConcurrency;
  const deviceMemory = (navigator as any).deviceMemory;
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const audioContext = hasAudioContext();

  // Create hash from all fingerprint components
  const fingerprintString = [
    canvas,
    webglRenderer,
    screenResolution,
    timezone,
    languages.join(','),
    hardwareConcurrency,
    deviceMemory,
    touchSupport,
    audioContext,
    navigator.userAgent,
    navigator.platform
  ].join('|');

  const hash = await hashString(fingerprintString);

  return {
    hash,
    webglRenderer,
    screenResolution,
    timezone,
    languages,
    hardwareConcurrency,
    deviceMemory,
    touchSupport,
    canvas: canvas.substring(0, 100), // Truncate for storage
    audioContext
  };
}

/**
 * Detect potential headless browser
 */
export function detectHeadlessBrowser(): boolean {
  const indicators: boolean[] = [];

  // Check for webdriver
  indicators.push(!!(navigator as any).webdriver);

  // Check for phantom
  indicators.push(!!(window as any).phantom || !!(window as any)._phantom);

  // Check for selenium
  indicators.push(!!document.documentElement.getAttribute('webdriver'));

  // Check for automation controlled
  indicators.push(!!(navigator as any).webdriver);

  // Chrome headless specific
  const userAgent = navigator.userAgent.toLowerCase();
  indicators.push(userAgent.includes('headless'));

  // Check for missing plugins in Chrome
  if (userAgent.includes('chrome')) {
    indicators.push(navigator.plugins.length === 0);
  }

  // Check for missing languages
  indicators.push(!navigator.languages || navigator.languages.length === 0);

  return indicators.filter(Boolean).length >= 2;
}
