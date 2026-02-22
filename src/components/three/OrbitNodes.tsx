import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { Group, Vector3, BufferGeometry, Float32BufferAttribute, LineBasicMaterial } from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

interface NodeDef {
  ringIdx: number;
  angle: number;
  yOff: number;
  radius: number;
  speed: number;
  tiltX: number;
}

const TWO_PI = Math.PI * 2;

// Cluster bias: nudge angles toward 0 (right) and PI (left) for visible clusters
const clusterBias = (baseAngle: number): number => {
  const nearest = Math.round(baseAngle / Math.PI) * Math.PI;
  return baseAngle + (nearest - baseAngle) * 0.25;
};

const buildNodes = (isMobile: boolean): NodeDef[] => {
  const rings = [
    { radius: 1.8, speed: 0.12, count: isMobile ? 4 : 8, tiltX: 0 },
    { radius: 3.0, speed: -0.08, count: isMobile ? 6 : 12, tiltX: 0 },
    { radius: 4.2, speed: 0.05, count: isMobile ? 5 : 10, tiltX: Math.PI / 12 },
  ];
  const nodes: NodeDef[] = [];
  rings.forEach((r, ri) => {
    for (let i = 0; i < r.count; i++) {
      const base = (i / r.count) * TWO_PI + (Math.random() - 0.5) * 0.4;
      nodes.push({
        ringIdx: ri,
        angle: clusterBias(base),
        yOff: (Math.random() - 0.5) * 0.6,
        radius: r.radius,
        speed: r.speed,
        tiltX: r.tiltX,
      });
    }
  });
  return nodes;
};

const MAX_LINES = 80;
const DIST_THRESHOLD = 2.5;
const tmp1 = new Vector3();
const tmp2 = new Vector3();

const OrbitNodes = () => {
  const isMobile = useIsMobile();
  const maxLines = isMobile ? 40 : MAX_LINES;

  const nodes = useMemo(() => buildNodes(isMobile), [isMobile]);
  const nodeCount = nodes.length;

  // Refs for each node group to read world positions
  const nodeRefs = useRef<(Group | null)[]>([]);

  // Pre-allocate line buffer
  const lineGeoRef = useRef<BufferGeometry>(null);
  const lineMatRef = useRef<LineBasicMaterial>(null);
  const positions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);

  // Orbit group refs per ring (3 rings)
  const ringRefs = useRef<(Group | null)[]>([null, null, null]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Rotate rings
    const speeds = [0.12, -0.08, 0.05];
    for (let i = 0; i < 3; i++) {
      const g = ringRefs.current[i];
      if (g) g.rotation.y = t * speeds[i];
    }

    // Pulse: cycle through nodes
    const pulseIdx = Math.floor(t * 0.5) % nodeCount;
    for (let i = 0; i < nodeCount; i++) {
      const ref = nodeRefs.current[i];
      if (!ref) continue;
      if (i >= pulseIdx && i < pulseIdx + 3) {
        const phase = Math.sin((t - i * 0.3) * Math.PI);
        const s = 1 + phase * 0.25;
        ref.scale.setScalar(s);
      } else {
        ref.scale.setScalar(1);
      }
    }

    // Compute world positions & build connections
    const worldPos: Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const ref = nodeRefs.current[i];
      if (!ref) { worldPos.push(new Vector3()); continue; }
      const v = new Vector3();
      ref.getWorldPosition(v);
      worldPos.push(v);
    }

    // Find pairs within threshold
    const pairs: { d: number; a: number; b: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const d = worldPos[i].distanceTo(worldPos[j]);
        if (d < DIST_THRESHOLD) {
          pairs.push({ d, a: i, b: j });
        }
      }
    }
    pairs.sort((a, b) => a.d - b.d);
    const count = Math.min(pairs.length, maxLines);

    for (let i = 0; i < count; i++) {
      const p = pairs[i];
      const off = i * 6;
      positions[off] = worldPos[p.a].x;
      positions[off + 1] = worldPos[p.a].y;
      positions[off + 2] = worldPos[p.a].z;
      positions[off + 3] = worldPos[p.b].x;
      positions[off + 4] = worldPos[p.b].y;
      positions[off + 5] = worldPos[p.b].z;
    }

    if (lineGeoRef.current) {
      const attr = lineGeoRef.current.getAttribute('position') as Float32BufferAttribute;
      attr.set(positions);
      attr.needsUpdate = true;
      lineGeoRef.current.setDrawRange(0, count * 2);
    }

    // Breathing opacity
    if (lineMatRef.current) {
      lineMatRef.current.opacity = 0.13 + Math.sin(t * 0.8) * 0.05;
    }
  });

  // Group nodes by ring for rotation
  const ringNodes = useMemo(() => {
    const grouped: NodeDef[][] = [[], [], []];
    nodes.forEach((n) => grouped[n.ringIdx].push(n));
    return grouped;
  }, [nodes]);

  let globalIdx = 0;

  return (
    <group>
      {/* Connection lines */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={lineGeoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={maxLines * 2}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMatRef}
          color="#4a9eff"
          transparent
          opacity={0.13}
          depthWrite={false}
        />
      </lineSegments>

      {/* Orbit rings */}
      {ringNodes.map((ringGroup, ri) => (
        <group
          key={ri}
          ref={(el) => { ringRefs.current[ri] = el; }}
          rotation={[ringGroup[0]?.tiltX || 0, 0, 0]}
        >
          {ringGroup.map((node) => {
            const idx = globalIdx++;
            const x = Math.cos(node.angle) * node.radius;
            const z = Math.sin(node.angle) * node.radius;
            return (
              <group
                key={idx}
                ref={(el) => { nodeRefs.current[idx] = el; }}
                position={[x, node.yOff, z]}
              >
                {/* Glow shell */}
                <mesh>
                  <boxGeometry args={[0.2, 0.2, 0.2]} />
                  <meshBasicMaterial
                    color="#6baeff"
                    transparent
                    opacity={0.1}
                  />
                </mesh>
                {/* Block node */}
                <RoundedBox args={[0.12, 0.12, 0.12]} radius={0.02} smoothness={2}>
                  <meshPhysicalMaterial
                    color="#ffffff"
                    transmission={0.6}
                    roughness={0.3}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    ior={1.4}
                    thickness={0.1}
                  />
                </RoundedBox>
              </group>
            );
          })}
        </group>
      ))}
    </group>
  );
};

export default OrbitNodes;
