/**
 * SECURITY: XSS test payloads for validating sanitization functions.
 * These payloads represent common XSS attack vectors that must be neutralized.
 * 
 * Run these tests regularly to ensure sanitization remains effective.
 */
export const XSS_TEST_PAYLOADS = [
  // Basic script injection
  '<script>alert("XSS")</script>',
  '<script>alert(String.fromCharCode(88,83,83))</script>',
  '<img src=x onerror="alert(1)">',
  '<img src=x onerror=alert(1)>',
  
  // Event handler injection
  '<a href="#" onclick="alert(1)">Click</a>',
  '<div onmouseover="alert(1)">Hover</div>',
  '<input onfocus="alert(1)" autofocus>',
  '<body onload="alert(1)">',
  '<svg onload="alert(1)">',
  
  // JavaScript URL schemes
  '<a href="javascript:alert(1)">Click</a>',
  '<img src="javascript:alert(1)">',
  '<form action="javascript:alert(1)"><input type="submit"></form>',
  
  // Data URL injection
  '<img src="data:text/html,<script>alert(1)</script>">',
  '<object data="data:text/html,<script>alert(1)</script>">',
  
  // SVG-based XSS
  '<svg onload="alert(1)">',
  '<svg><script>alert(1)</script></svg>',
  '<svg><animate onbegin="alert(1)">',
  
  // Style injection
  '<style>body{background:url("javascript:alert(1)")}</style>',
  '<div style="background:url(javascript:alert(1))">',
  '<link rel="stylesheet" href="javascript:alert(1)">',
  
  // Iframe injection
  '<iframe src="javascript:alert(1)">',
  '<iframe src="data:text/html,<script>alert(1)</script>">',
  
  // Object/Embed injection
  '<object data="javascript:alert(1)">',
  '<embed src="javascript:alert(1)">',
  
  // Meta refresh
  '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">',
  
  // HTML5 tags
  '<video><source onerror="alert(1)">',
  '<audio src=x onerror="alert(1)">',
  
  // Base tag manipulation
  '<base href="javascript:alert(1)//">',
  
  // Math/MathML injection
  '<math><mi xlink:href="javascript:alert(1)">click</mi></math>',
  
  // Template injection
  '<template><script>alert(1)</script></template>',
  
  // Encoding bypass attempts
  '<img src=x on\x09error="alert(1)">',
  '<img src=x on\x0Aerror="alert(1)">',
  '<img src=x on\x0Derror="alert(1)">',
  
  // Case variation bypass attempts
  '<ScRiPt>alert(1)</sCrIpT>',
  '<IMG SRC=x ONERROR=alert(1)>',
];

/**
 * Safe HTML examples that should pass through sanitization unchanged
 */
export const SAFE_HTML_EXAMPLES = [
  '<p>Hello <strong>world</strong>!</p>',
  '<a href="https://example.com">Link</a>',
  '<img src="https://example.com/image.jpg" alt="Example">',
  '<ul><li>Item 1</li><li>Item 2</li></ul>',
  '<blockquote>A quote</blockquote>',
  '<code>console.log("hello")</code>',
  '<pre>Code block</pre>',
  '<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>',
  '<p>Text with <em>emphasis</em> and <i>italic</i> and <b>bold</b></p>',
];
