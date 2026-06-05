Two visual fixes:

### 1. Remove transparency on coin assets
- Hero back-layer cluster (line 242 in `FloatingDevice`): drop `opacity-70 blur-[1px]` → render fully opaque, sharp.
- Metrics decorations (line ~879): drop `opacity-80` → fully opaque.

### 2. Move the BTC coin off the text
The hero-front BTC (lines 310-317) is currently `absolute right-2 md:right-6 bottom-16`. On mobile that pins it to the right edge where the column transitions overlap the body copy.
- New placement: `-right-6 md:-right-14 bottom-2 md:bottom-6 w-14 md:w-20` — tucks it outside the phone's bottom-right corner, away from the headline/body text.