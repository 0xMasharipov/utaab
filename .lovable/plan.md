

# Update MIT University Logo to Official Version

## What Changes
Replace the current approximate MIT logo SVG (`public/images/mit-logo.svg`) with an accurate recreation of the official MIT logo based on the MIT Brand Guide.

## Current Issue
The existing SVG is a rough approximation using basic rectangles that doesn't accurately match the official MIT logo geometry. The official logo (visible on brand.mit.edu) has a specific blocky letter design for "M", "I", and "T" with precise proportions.

## Plan

### 1. Replace `public/images/mit-logo.svg`
Recreate the SVG to accurately match the official MIT logo geometry using the correct rectangular block structure visible in the Brand Guide:
- **M**: Left vertical bar + top horizontal bar extending right, forming the letter M shape
- **I**: Two short horizontal bars (top and bottom) with a vertical bar in the middle -- the classic serif-I block shape
- **T**: Top horizontal bar with a centered vertical bar dropping down

All in MIT Red (#A31F34), matching the official brand color.

### 2. No other file changes needed
The `BlockchainAndMoney.tsx` component already references `/images/mit-logo.svg` with proper fallback handling -- only the SVG asset itself needs updating.

## Technical Details

The new SVG will be a hand-crafted vector using `<rect>` elements to precisely reproduce the official MIT block-letter logo proportions based on the brand guide reference. The viewBox will be adjusted to properly fit the letterforms with appropriate spacing between M, I, and T.

