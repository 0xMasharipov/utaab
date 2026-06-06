/**
 * Centralized WebGL capability detection.
 * Returns one of:
 *  - 'ok'           : hardware WebGL, large enough textures
 *  - 'software'     : context exists but renderer is SwiftShader / llvmpipe / basic
 *  - 'unavailable'  : no context, blocked by flags, or detection threw
 *
 * Memoized — runs at most once per session.
 */
export type WebGLSupport = 'ok' | 'software' | 'unavailable';

let cached: WebGLSupport | null = null;

const SOFTWARE_RENDERER_PATTERNS = [
  /swiftshader/i,
  /llvmpipe/i,
  /software/i,
  /basic render/i,
  /microsoft basic render/i,
];

export function detectWebGL(): WebGLSupport {
  if (cached !== null) return cached;
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    cached = 'unavailable';
    return cached;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (canvas.getContext('webgl') as WebGLRenderingContext | null) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) {
      cached = 'unavailable';
      return cached;
    }

    // Verify minimum texture size for our 1.4K cert template.
    const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    if (!maxTex || maxTex < 2048) {
      cached = 'unavailable';
      return cached;
    }

    // Software-renderer detection (requires WEBGL_debug_renderer_info).
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    if (dbg) {
      const renderer = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
      if (SOFTWARE_RENDERER_PATTERNS.some((re) => re.test(renderer))) {
        cached = 'software';
        return cached;
      }
    }

    cached = 'ok';
    return cached;
  } catch {
    cached = 'unavailable';
    return cached;
  }
}

/** Pre-validate an image URL via Image().decode(). Resolves true on success. */
export function preloadImage(url: string, timeoutMs = 4000): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  return new Promise((resolve) => {
    const img = new Image();
    let done = false;
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      resolve(ok);
    };
    const timer = window.setTimeout(() => finish(false), timeoutMs);
    img.onload = () => {
      window.clearTimeout(timer);
      if (img.decode) {
        img.decode().then(() => finish(true)).catch(() => finish(false));
      } else {
        finish(true);
      }
    };
    img.onerror = () => {
      window.clearTimeout(timer);
      finish(false);
    };
    img.src = url;
  });
}
