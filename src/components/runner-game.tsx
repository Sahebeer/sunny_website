"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject, type PointerEvent as ReactPointerEvent } from "react";
import { site } from "@site";
import styles from "./runner-game.module.css";

const lanes = [-2.4, 0, 2.4];

function RunnerCamera() {
  const { camera } = useThree();
  useFrame(() => camera.lookAt(0, 0.7, -7));
  return null;
}

function CarModel({ targetLane, groupRef }: { targetLane: MutableRefObject<number>; groupRef: MutableRefObject<THREE.Group | null> }) {
  const { scene } = useGLTF(site.miniGame.modelPath, true);
  const car = useMemo(() => {
    const clone = scene.clone(true);
    const sourceBounds = new THREE.Box3().setFromObject(clone);
    const sourceSize = sourceBounds.getSize(new THREE.Vector3());
    const sourceCenter = sourceBounds.getCenter(new THREE.Vector3());
    clone.position.sub(sourceCenter);
    // The lane width, not the car's long axis, determines the playable scale.
    clone.scale.setScalar(1.45 / Math.max(sourceSize.z, 0.001));
    const normalizedBounds = new THREE.Box3().setFromObject(clone);
    clone.position.y -= normalizedBounds.min.y;
    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      if (Array.isArray(object.material)) object.material = object.material.map((material) => material.clone());
      else object.material = object.material.clone();
      const objectName = object.name.toUpperCase();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        if (!(material instanceof THREE.MeshStandardMaterial)) return;
        material.envMapIntensity = 1.8;
        if (objectName.includes("GLASS")) {
          material.color.set("#62c5cf");
          material.roughness = 0.12;
          material.metalness = 0.2;
        } else if (objectName.includes("WHEEL") || objectName.includes("RUBBER")) {
          material.color.set("#152426");
          material.roughness = 0.52;
        } else {
          material.color.set("#2d7077");
          material.roughness = 0.3;
          material.metalness = 0.65;
        }
      });
    });
    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetX = lanes[targetLane.current];
    const blend = 1 - Math.pow(0.0001, delta);
    const difference = targetX - groupRef.current.position.x;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, blend);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -difference * 0.08, blend);
  });

  return <group ref={groupRef} position={[0, 0.06, 3.8]} rotation={[0, -Math.PI / 2, 0]}><primitive object={car} /></group>;
}

function LaneRunScene({ round, gameOver, targetLane, onScore, onGameOver }: { round: number; gameOver: boolean; targetLane: MutableRefObject<number>; onScore: (score: number) => void; onGameOver: () => void }) {
  const carRef = useRef<THREE.Group | null>(null);
  const stripeRefs = useRef<Array<THREE.Mesh | null>>([]);
  const obstacleRefs = useRef<Array<THREE.Mesh | null>>([]);
  const obstacles = useMemo(() => Array.from({ length: 6 }, (_, index) => ({ lane: (index + round) % 3, z: -12 - index * 10 })), [round]);
  const distance = useRef(0);
  const scoreRef = useRef(0);

  useFrame((_, delta) => {
    if (gameOver || document.visibilityState === "hidden") return;
    const speed = 5.8 + Math.min(scoreRef.current * 0.06, 9);
    distance.current += speed * delta;
    const nextScore = Math.floor(distance.current / 2);
    if (nextScore !== scoreRef.current) {
      scoreRef.current = nextScore;
      onScore(nextScore);
    }

    stripeRefs.current.forEach((stripe) => {
      if (!stripe) return;
      stripe.position.z += speed * delta;
      if (stripe.position.z > 7) stripe.position.z -= 42;
    });

    const carBounds = carRef.current ? new THREE.Box3().setFromObject(carRef.current).expandByScalar(-0.08) : null;
    obstacles.forEach((obstacle, index) => {
      const mesh = obstacleRefs.current[index];
      if (!mesh) return;
      obstacle.z += speed * delta;
      if (obstacle.z > 7) {
        obstacle.z = -52 - Math.random() * 14;
        obstacle.lane = (obstacle.lane + 1 + Math.floor(Math.random() * 2)) % lanes.length;
      }
      mesh.position.set(lanes[obstacle.lane], 0.68, obstacle.z);
      if (carBounds && carBounds.intersectsBox(new THREE.Box3().setFromObject(mesh).expandByScalar(-0.1))) onGameOver();
    });
  });

  return <>
    <color attach="background" args={["#040809"]} />
    <fog attach="fog" args={["#040809", 12, 36]} />
    <ambientLight intensity={1.05} color="#b8d7db" />
    <directionalLight castShadow color="#d7f4f5" intensity={4.5} position={[-5, 8, 5]} />
    <pointLight color="#ff6338" intensity={12} distance={18} position={[0, 2.5, -12]} />
    <pointLight color="#7feaf0" intensity={5} distance={8} position={[0, 1.4, 4.4]} />
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.04, -12]} receiveShadow>
      <planeGeometry args={[10.5, 48]} />
      <meshStandardMaterial color="#182b2d" roughness={0.78} metalness={0.3} />
    </mesh>
    {[-5.05, 5.05].map((x) => <mesh key={x} position={[x, 0.03, -12]}>
      <boxGeometry args={[0.08, 0.035, 48]} />
      <meshBasicMaterial color="#ff6338" transparent opacity={0.82} />
    </mesh>)}
    {[-1.2, 1.2].map((x) => Array.from({ length: 14 }, (_, index) => <mesh key={`${x}-${index}`} ref={(mesh) => { stripeRefs.current[(x < 0 ? 0 : 14) + index] = mesh; }} position={[x, 0.015, -33 + index * 3]}>
      <boxGeometry args={[0.06, 0.025, 1.25]} />
      <meshBasicMaterial color="#cfebea" transparent opacity={0.72} />
    </mesh>))}
    {obstacles.map((obstacle, index) => <mesh key={`${round}-${index}`} ref={(mesh) => { obstacleRefs.current[index] = mesh; }} position={[lanes[obstacle.lane], 0.68, obstacle.z]} castShadow>
      <coneGeometry args={[0.72, 1.35, 6]} />
      <meshStandardMaterial color={index % 2 ? "#ff6338" : "#75cbd0"} emissive={index % 2 ? "#6b170c" : "#163f42"} emissiveIntensity={0.35} roughness={0.42} metalness={0.28} />
    </mesh>)}
    <CarModel targetLane={targetLane} groupRef={carRef} />
    <RunnerCamera />
  </>;
}

export default function RunnerGame({ onClose }: { onClose: () => void }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    if (typeof window === "undefined") return 0;
    const stored = Number(window.localStorage.getItem("sunny-lane-run-best") || 0);
    return Number.isFinite(stored) ? stored : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const targetLane = useRef(1);

  const changeLane = useCallback((direction: -1 | 1) => {
    if (gameOver) return;
    targetLane.current = Math.max(0, Math.min(lanes.length - 1, targetLane.current + direction));
  }, [gameOver]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight", "a", "d", "A", "D"].includes(event.key)) return;
      event.preventDefault();
      changeLane(event.key === "ArrowLeft" || event.key === "a" || event.key === "A" ? -1 : 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [changeLane]);

  const handleScore = useCallback((nextScore: number) => {
    setScore(nextScore);
    setBest((currentBest) => {
      if (nextScore <= currentBest) return currentBest;
      window.localStorage.setItem("sunny-lane-run-best", String(nextScore));
      return nextScore;
    });
  }, []);

  const restart = () => {
    targetLane.current = 1;
    setScore(0);
    setGameOver(false);
    setRound((value) => value + 1);
  };

  const handlePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    changeLane(event.clientX < bounds.left + bounds.width / 2 ? -1 : 1);
  };

  return <section className={styles.game} aria-labelledby="lane-run-title">
    <div className={styles.gameHeader}>
      <div><span className={styles.gameEyebrow}>{site.miniGame.title}</span><h2 id="lane-run-title">{site.miniGame.body}</h2></div>
      <button type="button" className={styles.gameClose} onClick={onClose} aria-label={site.miniGame.closeLabel}>×</button>
    </div>
    <div className={styles.gameHud} aria-live="polite"><span>{site.miniGame.scoreLabel} <strong>{score.toString().padStart(3, "0")}</strong></span><span>{site.miniGame.bestLabel} <strong>{best.toString().padStart(3, "0")}</strong></span></div>
    <div className={styles.gameCanvas} onPointerDown={handlePointer} role="application" aria-label={site.miniGame.controlsLabel}>
      <Canvas dpr={[1, 1.5]} shadows gl={{ antialias: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }} camera={{ fov: 40, near: 0.1, far: 80, position: [0, 4.2, 11] }}>
        <LaneRunScene round={round} gameOver={gameOver} targetLane={targetLane} onScore={handleScore} onGameOver={() => setGameOver(true)} />
      </Canvas>
      {gameOver && <div className={styles.gameOver} role="status"><span>{site.miniGame.gameOverLabel}</span><strong>{score.toString().padStart(3, "0")}</strong><button type="button" onClick={restart}>{site.miniGame.restartLabel}</button></div>}
    </div>
    <div className={styles.gameControls}>
      <span>{site.miniGame.controlsLabel}</span>
      <div><button type="button" onClick={() => changeLane(-1)} aria-label={site.miniGame.leftLabel}>←</button><button type="button" onClick={() => changeLane(1)} aria-label={site.miniGame.rightLabel}>→</button></div>
    </div>
  </section>;
}
