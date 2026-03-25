

# Create Proper OG Banner Image (1200×630px)

## Summary
Generate a 1200×630px OG banner with UTAAB navy background (#081624), centered logo, and tagline text, then replace `public/og-image.png`.

## Approach
Use a script to create the banner image with:
- **Background**: Solid UTAAB navy (#081624)
- **Logo**: Centered `src/assets/logo-new.png`, scaled to fit (~200px height)
- **Tagline**: "Build Your Future in Blockchain" in white Montserrat below the logo
- **Output**: 1200×630px PNG saved to `public/og-image.png`

## Technical Details
- Use Python with Pillow to composite the image
- Download Montserrat font for the tagline text
- Center everything vertically and horizontally with proper spacing
- No transparency — solid background ensures visibility on all platforms (WhatsApp, Twitter, Facebook, LinkedIn)

## Files Modified
- `public/og-image.png` — replaced with proper 1200×630 branded banner

