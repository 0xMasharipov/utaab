

# Animate and Style Blog Post Content with Glass Background

## What
Wrap the blog post content area (text + gallery + attachments) in a centered glass card with blurred background, rounded corners, and staggered entrance animations for each content block and gallery image.

## Changes

### `src/pages/BlogPost.tsx`

1. **Glass container**: Wrap the content section (lines 184-232) inside a `GlassCard` with `variant="default"` centered with `max-w-4xl mx-auto`, giving the whole content area a blurred glass background with rounded corners.

2. **Animated content blocks**: Wrap each `RenderBlock` in a `motion.div` with staggered fade-up animation:
   ```tsx
   <motion.div
     initial={{ opacity: 0, y: 20 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true }}
     transition={{ delay: i * 0.05, duration: 0.4 }}
   >
     <RenderBlock key={i} block={block} />
   </motion.div>
   ```

3. **Animated gallery images**: Wrap each gallery image in `motion.div` with staggered scale-in animation:
   ```tsx
   <motion.div
     initial={{ opacity: 0, scale: 0.9 }}
     whileInView={{ opacity: 1, scale: 1 }}
     viewport={{ once: true }}
     transition={{ delay: i * 0.08, duration: 0.4 }}
   >
   ```

4. **Gallery heading**: Animate the "Gallery" heading with fade-in.

5. **Center and round gallery images**: Add `mx-auto` to the gallery grid container, ensure images have `rounded-2xl` for more pronounced rounding.

### Summary

| Element | Animation | Style |
|---------|-----------|-------|
| Content wrapper | - | GlassCard with backdrop blur, rounded-2xl, padding |
| Content blocks | Staggered fade-up | Centered within glass card |
| Gallery heading | Fade-in | - |
| Gallery images | Staggered scale-in | rounded-2xl, centered grid |
| Attachments/Share | Fade-in | Inside glass card |

One file changed: `src/pages/BlogPost.tsx`.

