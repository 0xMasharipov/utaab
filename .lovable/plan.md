
# Fix Logo Composition and Add Connected Network Ecosystem

## A) Fix Center 3D Logo — Tighter Spacing

**Problem**: Block offset is currently `0.75` units, making the 4 diamonds look like separate floating tiles instead of one unified symbol.

**Changes in `Logo3D.tsx`**:
- Reduce block offset from `0.75` to `0.38` so blocks nearly touch with only a small negative-space cross in the middle
- Reduce block size from `[0.6, 0.6, 0.15]` to `[0.45, 0.45, 0.12]` so the logo doesn't overpower the text
- Keep all other properties (material, Float, micro-tilt) the same

Updated positions:
```
top:    [0, 0.38, 0]
right:  [0.38, 0, 0]
bottom: [0, -0.38, 0]
left:   [-0.38, 0, 0]
```

## B) Rebuild OrbitNodes as Connected Ecosystem Network

**Problem**: Current nodes orbit independently with no connections — feels like random floating squares.

**Complete rewrite of `OrbitNodes.tsx`** with the following architecture:

### Node System
- All nodes stored in a single flat array with pre-computed ring assignments
- 3 rings with different radii and speeds:
  - Inner ring (r=1.8): 8 nodes desktop / 4 mobile, speed=0.12
  - Mid ring (r=3.0): 12 nodes desktop / 6 mobile, speed=-0.08
  - Outer ring (r=4.2): 10 nodes desktop / 5 mobile, speed=0.05, tilted 15deg
- Each node gets a random Y offset (small, +/-0.3) and angle offset for organic feel
- Nodes rendered as small `RoundedBox` with frosted glass material (same as current)

### Connection Lines (key new feature)
- On every frame, compute world positions of all nodes
- Use a proximity-based connection system: connect pairs within a distance threshold (~2.5 units)
- Cap total connections at 60 max (40 on mobile)
- Render connections using a single `<line>` primitive with a `BufferGeometry` updated each frame
- Line color: `#4a9eff` at low opacity (~0.15), with gentle sine-wave opacity breathing

### Pulse Animation
- A few nodes (3-4 at a time) get a soft scale pulse (1.0 to 1.3 over 2s) cycling through the node set
- Simulates blockchain validation/activity

### Cluster Bias
- Add slight angular clustering near the left (~PI) and right (~0) sides of the logo so visible network clusters form in those areas, giving an immediate "connected ecosystem" perception

### Performance
- Use `useRef` for node world position array — no allocations per frame
- Single shared `BufferGeometry` for all connection lines, updated in `useFrame`
- Node count automatically reduced on mobile via `useIsMobile()`
- Connection distance check is O(n^2) but with n=30 max nodes, that's only ~450 checks — trivial

## C) HeroScene.tsx — Minor Update
- No structural changes needed
- Camera, lighting, and container remain the same

## Technical Details

### Connection line rendering approach
```text
1. Maintain a Float32Array buffer for line positions (maxLines * 6 floats)
2. Each frame:
   - Compute world position of each node
   - Find pairs within distance threshold
   - Sort by distance, take top N pairs
   - Write start/end positions into buffer
   - Update drawRange on the BufferGeometry
3. Material: LineBasicMaterial, transparent, opacity oscillates 0.08-0.18
```

### Files summary

| File | Action |
|------|--------|
| `src/components/three/Logo3D.tsx` | Update — reduce block spacing and size |
| `src/components/three/OrbitNodes.tsx` | Rewrite — ecosystem rings + proximity connections + pulse |
| `src/components/three/HeroScene.tsx` | No changes needed |
