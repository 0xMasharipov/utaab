import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  opacity?: number;
}

export const ConnectionLine = ({
  start,
  end,
  color = '#4a9eff',
  opacity = 0.4,
}: ConnectionLineProps) => {
  const lineRef = useRef<THREE.Line>(null);

  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    
    // Create a curved line with intermediate points
    const midPoint = new THREE.Vector3()
      .addVectors(startVec, endVec)
      .multiplyScalar(0.5);
    
    // Add slight curve offset
    midPoint.y += 0.2;
    midPoint.z += 0.1;
    
    const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
    return curve.getPoints(20);
  }, [start, end]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      // Subtle pulse effect
      material.opacity = opacity + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <line ref={lineRef as any}>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        linewidth={1}
      />
    </line>
  );
};
