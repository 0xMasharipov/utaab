# Contributor artwork

Archived: contributor-match now uses the previous white 3D UTAAB icon and a focused student journey. These generated illustrations are retained for reference and are not loaded by the page. The section assignments below document the earlier design.

Seven white porcelain illustrations generated with the built-in `image_gen.imagegen` tool on 2026-09-23. The exact shared prompt, individual subjects, and section assignments are recorded in [prompts.json](./prompts.json).

Original transparent PNGs are retained in `originals/`. Production assets live in `public/contributor-art/` as alpha-preserving WebP files: 640px for the six contribution objects and 640px/1000px responsive versions of the birds. The eight web files total 305,872 bytes. Originals are outside the public directory and are not included in the deployed site.

The hero and closing use birds for shared purpose. The process uses a notebook for perspective, a knight for choices, and architecture for a starting point. Each contribution card has its own relevant object. The assessment repeats the notebook, analysis uses the handshake, and the result heading uses architecture. The original UTAAB mark remains as a small hero signature.

Cropping, layering, grid backgrounds, text shadows, and dark scrims are implemented in `src/components/contributor/contributor.css`. Images retain their original alpha; no backgrounds are painted into them. Only transform properties animate continuously, with offscreen pause and live CSS reduced-motion support. Avoid adding animated filters or per-frame React state.
