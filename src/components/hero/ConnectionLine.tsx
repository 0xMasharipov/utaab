import { useMemo } from 'react';
import { Line } from '@react-three/drei';
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
  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    
    // Create a curved line with intermediate points
    const midPoint = new THREE.Vector3()
      .addVectors(startVec, endVec)
      .multiplyScalar(0.5);
    
    // Add slight curve offset for visual interest
    midPoint.y += 0.2;
    midPoint.z += 0.1;
    
    const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
    return curve.getPoints(20);
  }, [start, end]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={opacity}
    />
  );
};
