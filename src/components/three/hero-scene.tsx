"use client";

// The 3D hero: a glossy CartWhim shopping bag you can spin, surrounded by floating gift boxes,
// coins and shapes. Built from simple geometry, so there are no 3D model files or fonts to download.

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, PresentationControls, RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

const ORANGE = "#f2622e";
const ROSE = "#f43f5e";
const INK = "#1c1a2e";
const CREAM = "#fff4ef";
const GOLD = "#f5b942";

function ShoppingBag() {
  return (
    <group>
      {/* body */}
      <RoundedBox args={[1.6, 1.9, 0.8]} radius={0.12} smoothness={6} castShadow>
        <meshPhysicalMaterial color={ORANGE} roughness={0.32} clearcoat={1} clearcoatRoughness={0.25} />
      </RoundedBox>
      {/* top band */}
      <RoundedBox args={[1.62, 0.22, 0.82]} radius={0.06} position={[0, 0.84, 0]}>
        <meshStandardMaterial color="#dc4d1b" roughness={0.4} />
      </RoundedBox>
      {/* handles */}
      {[-0.42, 0.42].map((x) => (
        <mesh key={x} position={[x, 1.02, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.26, 0.05, 16, 48, Math.PI]} />
          <meshStandardMaterial color={INK} roughness={0.35} metalness={0.2} />
        </mesh>
      ))}
      {/* logo tag on the front */}
      <RoundedBox args={[0.7, 0.7, 0.06]} radius={0.12} position={[0, 0.05, 0.42]}>
        <meshStandardMaterial color={CREAM} roughness={0.3} />
      </RoundedBox>
      {/* little cart icon made of shapes */}
      <group position={[0, 0.08, 0.46]} scale={0.9}>
        <mesh position={[0.02, 0.04, 0]}>
          <boxGeometry args={[0.34, 0.16, 0.03]} />
          <meshStandardMaterial color={ORANGE} />
        </mesh>
        <mesh position={[-0.2, 0.12, 0]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.04, 0.2, 0.03]} />
          <meshStandardMaterial color={ORANGE} />
        </mesh>
        {[-0.08, 0.12].map((x) => (
          <mesh key={x} position={[x, -0.1, 0]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color={ORANGE} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function GiftBox({ color, ribbon, size = 0.6 }: { color: string; ribbon: string; size?: number }) {
  return (
    <group>
      <RoundedBox args={[size, size, size]} radius={0.06} smoothness={4}>
        <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={0.8} />
      </RoundedBox>
      <mesh>
        <boxGeometry args={[size * 1.01, size * 1.01, size * 0.18]} />
        <meshStandardMaterial color={ribbon} roughness={0.4} />
      </mesh>
      <mesh>
        <boxGeometry args={[size * 0.18, size * 1.01, size * 1.01]} />
        <meshStandardMaterial color={ribbon} roughness={0.4} />
      </mesh>
      <mesh position={[0, size * 0.55, 0]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <torusGeometry args={[size * 0.16, size * 0.05, 12, 32]} />
        <meshStandardMaterial color={ribbon} />
      </mesh>
    </group>
  );
}

function Coin() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.28, 0.28, 0.07, 48]} />
      <meshStandardMaterial color={GOLD} metalness={0.55} roughness={0.3} emissive="#7a4a00" emissiveIntensity={0.25} />
    </mesh>
  );
}

// Gently turns the whole scene toward the pointer.
function Parallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame(({ pointer }, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += (pointer.x * 0.25 - ref.current.rotation.y) * Math.min(1, dt * 3);
    ref.current.rotation.x += (-pointer.y * 0.12 - ref.current.rotation.x) * Math.min(1, dt * 3);
  });
  return <group ref={ref}>{children}</group>;
}

function Spin({ children, speed = 0.4 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * speed; });
  return <group ref={ref}>{children}</group>;
}

export default function HeroScene({ active = true, compact = false }: { active?: boolean; compact?: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.3, compact ? 7.4 : 6.2], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      aria-hidden
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <pointLight position={[-4, -1, 3]} intensity={18} color={ROSE} />

      {/* Studio reflections made from light panels, no HDR file needed */}
      <Environment resolution={128}>
        <Lightformer intensity={2.2} position={[0, 4, -6]} scale={[10, 4, 1]} />
        <Lightformer intensity={1.4} color={ORANGE} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer intensity={1.2} color="#ffd7c2" position={[6, 0, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
      </Environment>

      <Parallax>
        <PresentationControls global={false} cursor snap rotation={[0, -0.35, 0]} polar={[-0.3, 0.3]} azimuth={[-1.2, 1.2]}>
          <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.7}>
            <group position={[0, -0.15, 0]} scale={compact ? 0.85 : 1}>
              <ShoppingBag />
            </group>
          </Float>
        </PresentationControls>

        <Float speed={2.2} rotationIntensity={1.4} floatIntensity={1.4} position={[-1.85, 0.9, -0.6]}>
          <group rotation={[0.4, 0.6, 0.1]}><GiftBox color={ROSE} ribbon="#fde68a" size={0.62} /></group>
        </Float>
        <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1.2} position={[1.9, -0.75, 0.2]}>
          <group rotation={[0.3, -0.5, 0.2]}><GiftBox color="#6366f1" ribbon="#f5f5f4" size={0.5} /></group>
        </Float>
        <Float speed={3} rotationIntensity={2} floatIntensity={2} position={[1.7, 1.15, -0.3]}>
          <Spin speed={1.2}><Coin /></Spin>
        </Float>
        <Float speed={2.6} rotationIntensity={2} floatIntensity={1.6} position={[-1.6, -0.95, 0.5]}>
          <Spin speed={-1}><group scale={0.8}><Coin /></group></Spin>
        </Float>
        <Float speed={2} floatIntensity={2} position={[-0.9, 1.6, -1.2]}>
          <mesh><sphereGeometry args={[0.16, 32, 32]} /><meshStandardMaterial color="#ffc4a8" roughness={0.2} /></mesh>
        </Float>
        <Float speed={2.4} floatIntensity={2} position={[0.95, -1.45, -0.8]}>
          <mesh rotation={[0.6, 0.2, 0]}><torusGeometry args={[0.2, 0.07, 16, 40]} /><meshStandardMaterial color="#34d399" roughness={0.25} /></mesh>
        </Float>
      </Parallax>

      <ContactShadows position={[0, -1.55, 0]} opacity={0.45} scale={7} blur={2.6} far={3} color="#000000" />
    </Canvas>
  );
}
