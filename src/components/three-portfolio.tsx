"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { Environment, Html, MeshReflectorMaterial, Preload, useGLTF, useProgress } from "@react-three/drei";
import gsap from "gsap";
import dynamic from "next/dynamic";
import * as THREE from "three";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject, type WheelEvent as ReactWheelEvent } from "react";
import { site, type Project } from "@site";
import styles from "./three-portfolio.module.css";

const RunnerGame = dynamic(() => import("./runner-game"), { ssr: false });

type Section = "home" | "projects" | "about" | "contact";
type Palette = "signal" | "paper" | "acid";
type RouteState = { portfolioRoute: true; view: Section; project: number; scrollY: number };

const sections: Section[] = ["home", "projects", "about", "contact"];
const fallbackProfile = site.profile.name.startsWith("[") ? site.demoProfile : site.profile;

function readRoute() {
  if (typeof window === "undefined") return { view: "home" as Section, project: -1 };
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  const rawProject = params.get("project");
  const project = rawProject === null ? -1 : Number(rawProject);
  return {
    view: sections.includes(view as Section) ? (view as Section) : "home",
    project: Number.isInteger(project) && project >= 0 && project < site.projects.length ? project : -1,
  };
}

function routeUrl(view: Section, project: number) {
  const params = new URLSearchParams();
  if (view !== "home") params.set("view", view);
  if (project >= 0) params.set("project", String(project));
  const query = params.toString();
  return `${window.location.pathname}${query ? `?${query}` : ""}`;
}

function ProgressReporter({ onProgress }: { onProgress: (value: number) => void }) {
  const { progress } = useProgress();
  useEffect(() => onProgress(Math.round(progress)), [onProgress, progress]);
  return null;
}

function normalizeTextureChannels(material: THREE.Material) {
  if (!(material instanceof THREE.MeshStandardMaterial)) return;
  [material.map, material.normalMap, material.roughnessMap, material.metalnessMap, material.aoMap, material.emissiveMap, material.bumpMap, material.displacementMap, material.alphaMap, material.lightMap].forEach((texture) => {
    if (texture) texture.channel = 0;
  });
}

function Model({ path, name, ...props }: { path: string; name: string; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number }) {
  const { scene } = useGLTF(path);
  const clone = useMemo(() => {
    const next = scene.clone(true);
    next.name = name;
    next.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      const materialName = object.name.toUpperCase();
      const materialLabel = object.material instanceof THREE.Material ? object.material.name.toUpperCase() : "";
      if (object.material instanceof THREE.MeshStandardMaterial) normalizeTextureChannels(object.material);
      if (materialName.includes("COLD_EMISSIVE") || materialName.includes("CAR_NOSE_LIGHT") || materialLabel.includes("COLD FLUORESCENT")) {
        object.material = new THREE.MeshBasicMaterial({ color: "#c9f5ff" });
      } else if (materialName.includes("CAR_REAR_LIGHT") || materialLabel.includes("REAR RED")) {
        object.material = new THREE.MeshBasicMaterial({ color: "#ff402b" });
      } else if (materialName.includes("ORANGE_EDGE") || materialName.includes("SIDE_LIVERY") || materialLabel.includes("WARM ORANGE") || materialLabel.includes("CAR ORANGE")) {
        object.material = new THREE.MeshBasicMaterial({ color: "#ff6338" });
      } else if (object.material instanceof THREE.MeshStandardMaterial) {
        object.material.envMapIntensity = 1.2;
        if (name === "car" && !materialName.includes("GLASS") && !materialName.includes("WHEEL") && !materialLabel.includes("RUBBER")) {
          // Keep the homepage hero white while retaining geometry, normals, and the authored orange trim.
          object.material.color.set("#eef1eb");
          object.material.roughness = 0.28;
          object.material.metalness = 0.62;
          object.material.map = null;
        }
        else if (name === "station" && !materialName.includes("SNOW")) object.material.color.set("#3a5d61");
        if (materialName.includes("CAR_WEDGE") || materialLabel.includes("CAR DARK")) object.material.color.set("#d8ded9");
        else if (materialName.includes("CAR_GLASS") || materialLabel.includes("SMOKED GLASS")) { object.material.color.set("#76bac4"); object.material.transparent = true; object.material.opacity = 0.65; object.material.roughness = 0.08; }
        else if (materialName.includes("CAR_RECESSED") || materialName.includes("CAR_WHEEL")) object.material.color.set("#020708");
        else if (materialName.includes("CANOPY") || materialName.includes("PILLAR") || materialName.includes("JUNCTION")) object.material.color.set("#20383c");
        else if (materialName.includes("PUMP") || materialName.includes("BOLLARD")) object.material.color.set("#496b6d");
        else object.material.color.multiplyScalar(1.45);
      }
      if (object.material instanceof THREE.Material) object.material.side = THREE.DoubleSide;
    });
    return next;
  }, [name, scene]);
  return <primitive object={clone} {...props} />;
}

function Snow({ reducedMotion }: { reducedMotion: boolean }) {
  const { viewport } = useThree();
  const count = viewport.width < 6 ? 180 : 520;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const flakes = useMemo(() => Array.from({ length: count }, (_, index) => ({
    x: ((index * 37) % 100) / 100 * 24 - 12,
    y: ((index * 61) % 100) / 100 * 12,
    z: ((index * 17) % 100) / 100 * 18 - 9,
    speed: 0.6 + ((index * 13) % 10) / 12,
    drift: ((index * 7) % 10) / 25,
  })), [count]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    flakes.forEach((flake, index) => {
      if (!reducedMotion) {
        flake.y -= delta * flake.speed;
        flake.x += Math.sin(flake.y * 0.4 + index) * delta * flake.drift;
        if (flake.y < -1) flake.y = 12;
        if (flake.x > 13) flake.x = -13;
      }
      dummy.position.set(flake.x, flake.y, flake.z);
      dummy.scale.setScalar(index % 7 === 0 ? 0.032 : 0.018);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}><sphereGeometry args={[1, 5, 5]} /><meshBasicMaterial color="#d8eff4" transparent opacity={0.72} /></instancedMesh>;
}

function Ground() {
  const { viewport } = useThree();
  return <mesh rotation-x={-Math.PI / 2} position={[0, -0.58, 0]} receiveShadow><planeGeometry args={[Math.max(40, viewport.width * 3), 40]} /><MeshReflectorMaterial blur={[280, 80]} resolution={512} mixBlur={1} mixStrength={1.25} roughness={0.82} depthScale={1.4} minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#0b1618" metalness={0.38} /></mesh>;
}

function LightRig({ reducedMotion }: { reducedMotion: boolean }) {
  const coldLeft = useRef<THREE.RectAreaLight>(null);
  const coldRight = useRef<THREE.RectAreaLight>(null);
  const warm = useRef<THREE.PointLight>(null);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    elapsed.current += delta;
    if (reducedMotion || elapsed.current > 2.4) return;
    const pulse = elapsed.current > 0.55 && elapsed.current < 0.9 ? 0.25 : 1;
    if (coldLeft.current) coldLeft.current.intensity = 8 * pulse;
    if (coldRight.current) coldRight.current.intensity = 7 * (elapsed.current > 1.1 ? 1 : 0.35);
    if (warm.current) warm.current.intensity = 1.6 * (elapsed.current > 1.5 ? 1 : 0.2);
  });
  return <><ambientLight intensity={0.72} color="#b6d3d8" /><directionalLight color="#c4e8ed" intensity={8} position={[-6, 9, 10]} /><rectAreaLight ref={coldLeft} color="#bcecff" intensity={24} width={9} height={1.2} position={[-3.8, 6.4, -0.2]} rotation={[-Math.PI / 2, 0, 0]} /><rectAreaLight ref={coldRight} color="#d5f5ff" intensity={22} width={9} height={1.2} position={[4.4, 6.4, -0.2]} rotation={[-Math.PI / 2, 0, 0]} /><pointLight ref={warm} color="#ff6338" intensity={5} distance={16} position={[0, 6.5, -4.3]} /><pointLight color="#b7e5ee" intensity={16} distance={24} position={[-5, 3.5, 8]} /></>;
}

const cameraTargets: Record<Section, { position: [number, number, number]; lookAt: [number, number, number] }> = {
  home: { position: [-22, 4.7, 28], lookAt: [0, 2.8, 0] },
  projects: { position: [-15, 4.1, 18], lookAt: [0, 2.2, -0.8] },
  about: { position: [-12.5, 2.4, 18], lookAt: [1.0, 0.9, 5.0] },
  contact: { position: [4, 8.2, 21], lookAt: [0, 6.7, -3.8] },
};

function CameraRig({ view, reducedMotion, pointer }: { view: Section; reducedMotion: boolean; pointer: MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3(...cameraTargets.home.lookAt));
  useEffect(() => {
    const target = cameraTargets[view];
    if (reducedMotion) {
      camera.position.set(...target.position);
      lookAt.current.set(...target.lookAt);
      return;
    }
    gsap.to(camera.position, { x: target.position[0], y: target.position[1], z: target.position[2], duration: 1.5, ease: "power3.inOut", overwrite: true });
    gsap.to(lookAt.current, { x: target.lookAt[0], y: target.lookAt[1], z: target.lookAt[2], duration: 1.5, ease: "power3.inOut", overwrite: true });
  }, [camera, reducedMotion, view]);
  useFrame(() => camera.lookAt(lookAt.current.x + (reducedMotion ? 0 : pointer.current.x * 0.18), lookAt.current.y + (reducedMotion ? 0 : pointer.current.y * 0.18), lookAt.current.z));
  return null;
}

function Scene({ view, reducedMotion, pointer, onReady }: { view: Section; reducedMotion: boolean; pointer: MutableRefObject<{ x: number; y: number }>; onReady: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onReady, reducedMotion ? 120 : 1050);
    return () => window.clearTimeout(timer);
  }, [onReady, reducedMotion]);
  return <><Environment files="/assets/hdri-moonlit_golf.hdr" background={false} /><color attach="background" args={["#030708"]} /><fog attach="fog" args={["#071013", 10, 33]} /><CameraRig view={view} reducedMotion={reducedMotion} pointer={pointer} /><LightRig reducedMotion={reducedMotion} /><Model path="/models/station.glb" name="station" position={[0, -0.35, -1.5]} scale={0.82} /><Model path="/models/car.glb" name="car" position={[2.25, 0.12, 6]} rotation={[0, -0.38, 0]} scale={1.05} /><Ground /><Snow reducedMotion={reducedMotion} /><EffectComposer multisampling={0}><Bloom luminanceThreshold={0.8} mipmapBlur intensity={0.9} radius={0.62} /><Vignette eskil={false} offset={0.18} darkness={0.84} /><Noise premultiply opacity={0.1} /><ChromaticAberration offset={new THREE.Vector2(0.00045, 0.00045)} radialModulation modulationOffset={0.35} /></EffectComposer><Preload all /></>;
}

function TerminalTrace() {
  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; });
  return <div className={styles.terminal} aria-label={site.developerArtifact.terminalLabel}><div className={styles.terminalTop}><span>{site.developerArtifact.terminalLabel}</span><span>{site.developerArtifact.terminalStatus}</span></div><div className={styles.terminalLog} ref={logRef} role="log" aria-live="polite" tabIndex={0}>{site.developerArtifact.terminalLines.map((line) => <div key={line}><span className={styles.prompt}>{site.developerArtifact.prompt}</span> {line}</div>)}<div><span className={styles.prompt}>{site.developerArtifact.prompt}</span><span className={styles.cursor} aria-hidden="true" /></div></div></div>;
}

function HomeWorkbench() {
  return <section className={styles.homeWorkbench} aria-labelledby="workbench-title">
    <div className={styles.homeWorkbenchCopy}>
      <span className={styles.homeWorkbenchKicker}>Operator profile / 001</span>
      <h3 id="workbench-title">A developer who likes useful edges.</h3>
      <p>{site.about.paragraphs[0]}</p>
      <div className={styles.stackBlock}>
        <span>Working stack</span>
        <div className={styles.stackList}>{site.about.techStack.map((item) => <span key={item}>{item}</span>)}</div>
      </div>
    </div>
    <TerminalTrace />
  </section>;
}

function ProjectSpec({ project }: { project: Project }) {
  return <div className={styles.projectSpec}><div className={styles.specVisual}><span>{project.code}</span><strong>{project.title}</strong><small>{project.summary}</small></div><dl><div><dt>{site.world.specLabels.stack}</dt><dd>{project.stack.join(" / ")}</dd></div><div><dt>{site.world.specLabels.role}</dt><dd>{project.role}</dd></div><div><dt>Year</dt><dd>{project.year}</dd></div><div><dt>Status</dt><dd>{project.status}</dd></div><div><dt>{project.metric.label}</dt><dd>{project.metric.value}</dd></div></dl></div>;
}

function ProjectScreen({ project, index, onOpen }: { project: Project; index: number; onOpen: (index: number, target: HTMLElement) => void }) {
  return <Html position={[(-3.5 + index * 3.5) * 0.82, 2.15, -1.5 + -1.42 * 0.82]} transform distanceFactor={7} occlude={false}><button className={styles.projectScreen} type="button" onClick={(event) => onOpen(index, event.currentTarget)}><span>{project.code} / SCREEN {String(index + 1).padStart(2, "0")}</span><strong>{project.title}</strong><small>{project.metric.label} / {project.metric.value}</small><i aria-hidden="true" /></button></Html>;
}

function Boot({ started, progress, onStart, ready }: { started: boolean; progress: number; onStart: () => void; ready: boolean }) {
  if (ready) return null;
  return <div className={`${styles.boot} ${started ? styles.bootLoading : ""}`}><div className={styles.bootInner}><span>{site.world.bootKicker}</span><h1>{site.world.bootTitle}</h1><p>{site.world.bootBody}</p>{started ? <div className={styles.bootProgress}><div><span>loading scene</span><strong>{progress}%</strong></div><i><b style={{ width: `${progress}%` }} /></i></div> : <button type="button" onClick={onStart}>{site.world.bootAction}</button>}</div></div>;
}

export function ThreePortfolio() {
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [view, setView] = useState<Section>(() => readRoute().view);
  const [project, setProject] = useState(() => readRoute().project);
  const [palette, setPalette] = useState<Palette>("signal");
  const [gamePromptVisible, setGamePromptVisible] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const gameSentinelRef = useRef<HTMLDivElement>(null);
  const gameSectionRef = useRef<HTMLDivElement>(null);
  const gameStartRef = useRef(0);
  const gameOpenRef = useRef(false);
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = useRef({ x: 0, y: 0 });
  const wheelLock = useRef(false);
  const scrollSync = useRef(false);

  const applyRoute = useCallback((next: { view: Section; project: number }, shouldScroll = true) => {
    setView(next.view);
    setProject(next.project);
    if (shouldScroll) {
      scrollSync.current = true;
      window.scrollTo({ top: sections.indexOf(next.view) * window.innerHeight, behavior: "smooth" });
      window.setTimeout(() => { scrollSync.current = false; }, 850);
    }
  }, []);
  const navigate = useCallback((nextView: Section, nextProject = -1, replace = false) => {
    const state: RouteState = { portfolioRoute: true, view: nextView, project: nextProject, scrollY: window.scrollY };
    window.history[replace ? "replaceState" : "pushState"](state, "", routeUrl(nextView, nextProject));
    applyRoute({ view: nextView, project: nextProject });
  }, [applyRoute]);
  const closePanel = useCallback(() => {
    const next = readRoute();
    const state: RouteState = { portfolioRoute: true, view: next.view, project: -1, scrollY: window.scrollY };
    window.history.pushState(state, "", routeUrl(next.view, -1));
    setProject(-1);
    window.requestAnimationFrame(() => openerRef.current?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    const initial = readRoute();
    window.history.scrollRestoration = "manual";
    window.history.replaceState({ portfolioRoute: true, ...initial, scrollY: window.scrollY } satisfies RouteState, "", routeUrl(initial.view, initial.project));
    const onPop = (event: PopStateEvent) => {
      const next = readRoute();
      applyRoute(next, false);
      window.requestAnimationFrame(() => window.scrollTo(0, typeof event.state?.scrollY === "number" ? event.state.scrollY : sections.indexOf(next.view) * window.innerHeight));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [applyRoute]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape" && project >= 0) { event.preventDefault(); closePanel(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closePanel, project]);
  useEffect(() => { if (project >= 0) window.requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true })); }, [project]);
  useEffect(() => {
    const onPointer = (event: PointerEvent) => { pointer.current.x = event.clientX / window.innerWidth * 2 - 1; pointer.current.y = -(event.clientY / window.innerHeight * 2 - 1); };
    const onScroll = () => {
      if (wheelLock.current || scrollSync.current || project >= 0 || gameOpenRef.current) return;
      const index = Math.round(window.scrollY / Math.max(window.innerHeight, 1));
      const nextView = sections[Math.max(0, Math.min(sections.length - 1, index))];
      if (nextView !== view) navigate(nextView);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("pointermove", onPointer); window.removeEventListener("scroll", onScroll); };
  }, [gameOpen, navigate, project, view]);

  useEffect(() => {
    const sentinel = gameSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setGamePromptVisible(entry.isIntersecting && !gameOpen), { rootMargin: "0px 0px 320px 0px" });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [gameOpen, ready]);

  useEffect(() => {
    if (!gameOpen) return;
    gameStartRef.current = window.scrollY;
    let revealed = false;
    const revealGame = () => {
      if (revealed || !gameSectionRef.current || gameSectionRef.current.offsetHeight === 0) return;
      revealed = true;
      gameSectionRef.current.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      resizeObserver.disconnect();
    };
    const resizeObserver = new ResizeObserver(revealGame);
    if (gameSectionRef.current) resizeObserver.observe(gameSectionRef.current);
    const revealTimer = window.setTimeout(revealGame, 1200);
    const onScroll = () => {
      if (window.scrollY + window.innerHeight * 1.5 < gameStartRef.current) setGameOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.clearTimeout(revealTimer); resizeObserver.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, [gameOpen, reducedMotion]);

  const openProject = (index: number, target: HTMLElement) => { openerRef.current = target; navigate("projects", index); };
  const onWheel = (event: ReactWheelEvent<HTMLElement>) => {
    const delta = (event.nativeEvent as WheelEvent).deltaY;
    if (Math.abs(delta) < 4 || project >= 0 || wheelLock.current) return;
    const current = sections.indexOf(view);
    const next = Math.max(0, Math.min(sections.length - 1, current + (delta > 0 ? 1 : -1)));
    if (sections[next] === view) return;
    wheelLock.current = true;
    navigate(sections[next]);
    window.setTimeout(() => { wheelLock.current = false; }, 700);
  };
  const activeProject = project >= 0 ? site.projects[project] : null;
  const openGame = () => { gameOpenRef.current = true; setGameOpen(true); setGamePromptVisible(false); };
  const closeGame = () => { gameOpenRef.current = false; setGameOpen(false); };

  return <main className={`${styles.world} ${styles[palette]} ${view === "home" ? styles.homeView : ""}`} onWheel={onWheel}><div className={styles.canvas} aria-hidden="true">{started && <Canvas frameloop={gameOpen ? "demand" : "always"} dpr={[1, 2]} shadows gl={{ antialias: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.5 }} camera={{ fov: 35, near: 0.1, far: 100, position: cameraTargets.home.position }} onCreated={({ gl }) => { gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); }}><Suspense fallback={null}><ProgressReporter onProgress={setProgress} /><Scene view={view} reducedMotion={reducedMotion} pointer={pointer} onReady={() => setReady(true)} />{view === "projects" && site.projects.map((item, index) => <ProjectScreen key={item.slug} project={item} index={index} onOpen={openProject} />)}</Suspense></Canvas>}</div><Boot started={started} progress={progress} onStart={() => setStarted(true)} ready={ready} />{ready && <><header className={styles.header}><button type="button" className={styles.mark} onClick={() => navigate("home")}>{site.navigation.mark}</button><nav aria-label="Primary navigation">{sections.map((item) => <button key={item} type="button" className={item === view ? styles.activeNav : ""} onClick={() => navigate(item)}>{site.world.nav[item]}</button>)}</nav><span className={styles.status}><i />{site.world.sceneStatus}</span></header><section className={styles.identity} aria-labelledby="portfolio-name"><span>{site.world.sceneLabel}</span><h2 id="portfolio-name">{fallbackProfile.name}</h2><p>{fallbackProfile.role} / {fallbackProfile.location}</p><p className={styles.statement}>{fallbackProfile.statement}</p></section>{view === "home" && <HomeWorkbench />}<div className={styles.sectionLabel}><span>0{sections.indexOf(view) + 1}</span><strong>{site.world.nav[view]}</strong><small>{site.world.sceneHint}</small></div><div className={styles.paletteSwitcher} aria-label="Temporary palette comparison">{site.world.palettes.map((item) => <button key={item.id} type="button" className={palette === item.id ? styles.paletteActive : ""} onClick={() => setPalette(item.id)} aria-label={item.note}>{item.label}</button>)}</div><footer className={styles.footer}><span>{fallbackProfile.availability}</span><span>{fallbackProfile.email}</span></footer><div className={styles.gameTriggerSpace} aria-hidden="true" /><div ref={gameSentinelRef} className={styles.gameSentinel} aria-hidden="true" />{gamePromptVisible && <div className={styles.gamePrompt}><span>{site.miniGame.prompt}</span><button type="button" onClick={openGame}>{site.miniGame.openLabel}</button></div>}{gameOpen && <div ref={gameSectionRef} className={styles.gameMount}><RunnerGame onClose={closeGame} /></div>}<div className={styles.scrollRail} aria-hidden="true">{sections.map((item, index) => <span key={item} className={index === sections.indexOf(view) ? styles.railActive : ""}>0{index + 1}</span>)}</div></>}{activeProject && <><button type="button" className={styles.scrim} aria-label={site.world.closeLabel} onClick={closePanel} /><aside className={styles.panel} ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="project-panel-title"><div className={styles.panelHeader}><span>{site.world.projectsTitle} / {activeProject.code}</span><button type="button" onClick={closePanel} aria-label={`${site.world.closeLabel}: ${activeProject.title}`}>×</button></div><h1 id="project-panel-title">{activeProject.title}</h1><p>{activeProject.summary}</p><ProjectSpec project={activeProject} /><TerminalTrace /><button type="button" className={styles.backButton} onClick={closePanel}>{site.world.backLabel}</button></aside></>}</main>;
}

