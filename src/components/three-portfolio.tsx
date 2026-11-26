"use client";

import * as THREE from "three";
import { useEffect, useRef, useState, type RefObject } from "react";
import { site, type Project } from "@site";
import styles from "./three-portfolio.module.css";

type Section = "home" | "projects" | "about" | "contact";
type Palette = "signal" | "paper" | "acid";

type RouteState = {
  portfolioRoute: true;
  view: Section;
  project: number;
  scrollY: number;
};

type ProjectEntry = {
  group: THREE.Group;
  mesh: THREE.Mesh;
  index: number;
};

type SceneRefs = {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  projectEntries: ProjectEntry[];
  selectedCar: THREE.Group;
};

const accent = 0xff6338;
const pale = 0xd5e5e5;
const dark = 0x081010;

function routeFromLocation() {
  if (typeof window === "undefined") return { view: "home" as Section, project: 0 };
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  const project = Number(params.get("project"));
  return {
    view: view === "projects" || view === "about" || view === "contact" ? view : "home",
    project: Number.isInteger(project) && project >= 0 && project < site.projects.length ? project : 0,
  };
}

export function ThreePortfolio() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneRefs | null>(null);
  const activeSectionRef = useRef<Section>("home");
  const selectedProjectRef = useRef(0);
  const panelRef = useRef<HTMLElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [started, setStarted] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [selectedProject, setSelectedProject] = useState(0);
  const [palette, setPalette] = useState<Palette>("signal");

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    selectedProjectRef.current = selectedProject;
  }, [selectedProject]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const initial = routeFromLocation();
    activeSectionRef.current = initial.view;
    selectedProjectRef.current = initial.project;
    setActiveSection(initial.view);
    setSelectedProject(initial.project);
    window.history.scrollRestoration = "manual";
    const state: RouteState = {
      portfolioRoute: true,
      view: initial.view,
      project: initial.project,
      scrollY: window.scrollY,
    };
    window.history.replaceState(state, "", window.location.href);

    function handlePopState(event: PopStateEvent) {
      const next = routeFromLocation();
      activeSectionRef.current = next.view;
      selectedProjectRef.current = next.project;
      setActiveSection(next.view);
      setSelectedProject(next.project);
      window.requestAnimationFrame(() => window.scrollTo(0, typeof event.state?.scrollY === "number" ? event.state.scrollY : 0));
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (activeSection === "home") {
      window.requestAnimationFrame(() => {
        openerRef.current?.focus({ preventScroll: true });
        openerRef.current = null;
      });
      return;
    }
    window.requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === "home") return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closePanel();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [activeSection]);

  useEffect(() => {
    if (!started) return;
    const mount = mountRef.current;
    if (!mount) return;
    const container = mount;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(dark);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(-11, 6.5, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const ambient = new THREE.HemisphereLight(0xc2dce0, 0x050707, 1.5);
    scene.add(ambient);
    const coolLight = new THREE.DirectionalLight(0xb8d3d5, 2.2);
    coolLight.position.set(-5, 10, 8);
    scene.add(coolLight);
    const warmLight = new THREE.PointLight(accent, 1.7, 18);
    warmLight.position.set(0, 6.5, -1);
    scene.add(warmLight);
    const frontFill = new THREE.PointLight(0x9fc8ca, 2.4, 16);
    frontFill.position.set(-4, 3.5, 8);
    scene.add(frontFill);

    const world = new THREE.Group();
    scene.add(world);

    const makeMaterial = (color: number, roughness = 0.72, metalness = 0.08) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness });

    const addBox = (
      parent: THREE.Object3D,
      size: [number, number, number],
      position: [number, number, number],
      color: number,
      options?: { roughness?: number; metalness?: number },
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), makeMaterial(color, options?.roughness, options?.metalness));
      mesh.position.set(...position);
      parent.add(mesh);
      return mesh;
    };

    addBox(world, [44, 0.2, 44], [0, -0.1, 0], 0x101a1b);
    const grid = new THREE.GridHelper(40, 20, 0x263536, 0x172526);
    grid.position.y = 0.015;
    world.add(grid);

    const canopy = new THREE.Group();
    canopy.position.y = 6.8;
    world.add(canopy);
    addBox(canopy, [19, 0.34, 8], [0, 0, 0], 0x182526, { metalness: 0.38, roughness: 0.54 });
    addBox(canopy, [19.2, 0.1, 0.16], [0, -0.2, 3.96], accent, { roughness: 0.45, metalness: 0.24 });
    addBox(canopy, [19.2, 0.1, 0.16], [0, -0.2, -3.96], accent, { roughness: 0.45, metalness: 0.24 });
    addBox(canopy, [18.4, 0.58, 0.22], [0, -0.44, 3.78], 0x2b4141, { metalness: 0.34 });
    const stationSign = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 0.42, 0.05),
      new THREE.MeshBasicMaterial({ map: makeStationTexture(site.entryConsole.stationLabel) }),
    );
    stationSign.position.set(0, -0.42, 3.91);
    canopy.add(stationSign);
    [-5.5, 0, 5.5].forEach((x) => {
      addBox(canopy, [3.6, 0.06, 0.7], [x, -0.22, 0], pale, { roughness: 0.34 });
      const canopyLight = new THREE.PointLight(0xcfe4e5, 3.4, 8);
      canopyLight.position.set(x, -0.65, 0.5);
      canopy.add(canopyLight);
    });
    [-7.9, 7.9].forEach((x) => {
      [-3.4, 3.4].forEach((z) => {
        addBox(world, [0.38, 6.8, 0.38], [x, 3.3, z], 0x2d4041, { metalness: 0.44, roughness: 0.56 });
        addBox(world, [0.56, 0.1, 0.56], [x, 0.06, z], accent, { roughness: 0.48 });
      });
    });

    const island = new THREE.Group();
    island.position.set(0, 0.25, -0.8);
    world.add(island);
    addBox(island, [9.4, 0.32, 2.65], [0, 0, 0], 0x263b3c, { metalness: 0.34, roughness: 0.48 });
    addBox(island, [9.1, 0.08, 2.34], [0, 0.21, 0], accent, { metalness: 0.1, roughness: 0.46 });
    addBox(island, [8.9, 0.12, 2.12], [0, 0.28, 0], 0x162324, { metalness: 0.28 });

    [-2.55, 2.55].forEach((x) => {
      const dispenser = new THREE.Group();
      dispenser.position.set(x, 2.0, -0.05);
      island.add(dispenser);
      addBox(dispenser, [1.7, 3.2, 1.2], [0, 0, 0], 0x789395, { metalness: 0.32, roughness: 0.52 });
      addBox(dispenser, [1.38, 1.02, 0.08], [0, 0.8, 0.64], 0x0b1718, { metalness: 0.2 });
      addBox(dispenser, [1.06, 0.06, 0.08], [0, 0.84, 0.7], accent, { roughness: 0.38 });
      [-0.34, 0, 0.34].forEach((nozzleX) => {
        addBox(dispenser, [0.13, 0.92, 0.12], [nozzleX, -0.64, 0.65], 0x172324, { metalness: 0.44 });
        addBox(dispenser, [0.08, 0.3, 0.07], [nozzleX, -0.18, 0.7], pale, { roughness: 0.38 });
      });
      const hosePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.68, 0.42, 0.7),
        new THREE.Vector3(1.08, -0.08, 0.72),
        new THREE.Vector3(0.82, -0.65, 0.72),
      ]);
      dispenser.add(new THREE.Mesh(new THREE.TubeGeometry(hosePath, 18, 0.045, 8, false), makeMaterial(accent, 0.58, 0.18)));
    });

    const posterEntries: ProjectEntry[] = [];
    const posterColors = [0x243031, 0x203436, 0x2c2c2a];
    site.projects.forEach((project, index) => {
      const poster = new THREE.Group();
      poster.position.set(1.5 + index * 3.65, 3.25, -0.9);
      poster.rotation.y = (index - 1) * -0.045;
      poster.userData.projectIndex = index;
      world.add(poster);
      addBox(poster, [3.35, 2.25, 0.12], [0, 0, -0.08], 0x060a0a, { metalness: 0.25 });
      const texture = makePosterTexture(project, posterColors[index % posterColors.length]);
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(3.15, 2.05, 0.08),
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.76, metalness: 0.05 }),
      );
      mesh.userData.projectIndex = index;
      poster.add(mesh);
      addBox(poster, [2.85, 0.05, 0.05], [0, -1.15, 0.05], accent, { roughness: 0.5 });
      posterEntries.push({ group: poster, mesh, index });
    });

    const car = createProjectCar();
    car.position.set(2.3, 0.45, 3.2);
    world.add(car);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const cameraTargets: Record<Section, THREE.Vector3> = {
      home: new THREE.Vector3(-11, 6.2, 15),
      projects: new THREE.Vector3(-8.5, 4.9, 11),
      about: new THREE.Vector3(-13, 5.8, 13),
      contact: new THREE.Vector3(-3, 7.5, 17),
    };
    const lookTargets: Record<Section, THREE.Vector3> = {
      home: new THREE.Vector3(-0.5, 2.4, 0.8),
      projects: new THREE.Vector3(-0.2, 2.7, -0.5),
      about: new THREE.Vector3(-2.8, 2.5, 0),
      contact: new THREE.Vector3(-0.5, 2.5, 0),
    };

    function resize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    function pickProject(event: PointerEvent) {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(posterEntries.map((entry) => entry.mesh), false)[0];
      return typeof hit?.object.userData.projectIndex === "number" ? hit.object.userData.projectIndex : null;
    }

    function handlePointerMove(event: PointerEvent) {
      const picked = pickProject(event);
      renderer.domElement.style.cursor = picked === null ? "default" : "pointer";
    }

    function handlePointerDown(event: PointerEvent) {
      const picked = pickProject(event);
      if (picked === null) return;
      selectedProjectRef.current = picked;
      setSelectedProject(picked);
      activeSectionRef.current = "projects";
      setActiveSection("projects");
    }

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", resize);

    let frame = 0;
    const clock = new THREE.Clock();
    function animate() {
      frame = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const section = activeSectionRef.current;
      camera.position.lerp(cameraTargets[section], reducedMotion ? 0.08 : 0.035);
      camera.lookAt(lookTargets[section]);
      if (!reducedMotion) {
        car.rotation.y = Math.sin(elapsed * 0.18) * 0.015;
        car.position.y = 0.45 + Math.sin(elapsed * 0.55) * 0.025;
      }
      posterEntries.forEach(({ group, index }) => {
        const selected = selectedProjectRef.current === index;
        const targetZ = selected ? 0.6 : -0.9;
        const targetY = selected ? 3.45 : 3.25;
        group.position.z += (targetZ - group.position.z) * (reducedMotion ? 0.1 : 0.045);
        group.position.y += (targetY - group.position.y) * (reducedMotion ? 0.1 : 0.045);
      });
      renderer.render(scene, camera);
    }
    resize();
    animate();

    sceneRef.current = { camera, renderer, projectEntries: posterEntries, selectedCar: car };
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerdown", handlePointerDown);
      posterEntries.forEach(({ mesh }) => {
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.map?.dispose();
        material.dispose();
        mesh.geometry.dispose();
      });
      renderer.dispose();
      container.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, [started]);

  function changeSection(section: Section, project = selectedProjectRef.current, replace = false) {
    const sameView = section === activeSectionRef.current && (section !== "projects" || project === selectedProjectRef.current);
    if (sameView) return;
    if (section !== "home" && activeSectionRef.current === "home") {
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
    const applyRoute = () => {
      const url = new URL(window.location.href);
      url.searchParams.set("view", section);
      if (section === "projects") url.searchParams.set("project", String(project));
      else url.searchParams.delete("project");
      const nextState: RouteState = { portfolioRoute: true, view: section, project, scrollY: window.scrollY };
      if (replace) window.history.replaceState(nextState, "", url.toString());
      else window.history.pushState(nextState, "", url.toString());
      activeSectionRef.current = section;
      selectedProjectRef.current = project;
      setActiveSection(section);
      setSelectedProject(project);
    };
    const documentWithTransitions = document as Document & { startViewTransition?: (update: () => void) => void };
    if (documentWithTransitions.startViewTransition) documentWithTransitions.startViewTransition(applyRoute);
    else applyRoute();
  }

  function closePanel() {
    if (activeSectionRef.current === "home") return;
    if (window.history.state?.portfolioRoute && window.history.state.view !== "home") {
      window.history.back();
      return;
    }
    changeSection("home", selectedProjectRef.current, true);
  }

  function chooseProject(index: number) {
    changeSection("projects", index);
  }

  const selected = site.projects[selectedProject];
  const world = site.world;

  return (
    <main className={`${styles.world} ${styles[`palette-${palette}`]}`} data-started={started ? "true" : "false"}>
      <div ref={mountRef} className={styles.canvas} aria-label={world.sceneLabel} />

      {!started ? (
        <section className={styles.boot} aria-labelledby="boot-title">
          <div className={styles.bootFrame}>
            <p>{world.bootKicker}</p>
            <h1 id="boot-title">{world.bootTitle}</h1>
            <p>{world.bootBody}</p>
            <button type="button" onClick={() => setStarted(true)}>{world.bootAction}</button>
          </div>
        </section>
      ) : (
        <>
          <header className={styles.header}>
            <button className={styles.mark} type="button" onClick={() => changeSection("home")}>
              {site.navigation.mark}
            </button>
            <nav className={styles.nav} aria-label={world.sceneLabel}>
              <NavButton label={world.nav.home} active={activeSection === "home"} onClick={() => changeSection("home")} />
              <NavButton label={world.nav.projects} active={activeSection === "projects"} onClick={() => changeSection("projects")} />
              <NavButton label={world.nav.about} active={activeSection === "about"} onClick={() => changeSection("about")} />
              <NavButton label={world.nav.contact} active={activeSection === "contact"} onClick={() => changeSection("contact")} />
            </nav>
            <span className={styles.status}>{world.sceneStatus}</span>
          </header>

          <PaletteSwitcher palette={palette} onChange={setPalette} />

          <section className={styles.identity} aria-labelledby="identity-title">
            <p>{site.profile.role}</p>
            <h1 id="identity-title">{site.profile.name}</h1>
            <span>{site.profile.location}</span>
          </section>

          <p className={styles.sceneHint}>{world.sceneHint}</p>

          {activeSection !== "home" ? <button className={styles.panelScrim} type="button" aria-label={world.closeLabel} onClick={closePanel} /> : null}
          {activeSection === "projects" ? (
            <ProjectPanel panelRef={panelRef} selected={selected} selectedIndex={selectedProject} onChoose={chooseProject} onClose={closePanel} />
          ) : null}
          {activeSection === "about" ? <AboutPanel panelRef={panelRef} onClose={closePanel} /> : null}
          {activeSection === "contact" ? <ContactPanel panelRef={panelRef} onClose={closePanel} /> : null}

          <div className={styles.bottomBar}>
            <span>{site.profile.availability}</span>
            <span>{site.entryConsole.sceneNote}</span>
            <span>{String(selectedProject + 1).padStart(2, "0")} / {String(site.projects.length).padStart(2, "0")}</span>
          </div>
        </>
      )}
    </main>
  );
}

function NavButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
      <button className={active ? styles.navActive : undefined} type="button" aria-current={active ? "page" : undefined} onClick={onClick}>
      {label}
    </button>
  );
}

function PaletteSwitcher({ palette, onChange }: { palette: Palette; onChange: (palette: Palette) => void }) {
  return (
    <aside className={styles.paletteSwitcher} aria-label={site.world.sceneLabel}>
      <span>{site.world.palettes.find((option) => option.id === palette)?.note}</span>
      <div>
        {site.world.palettes.map((option) => (
          <button key={option.id} type="button" aria-pressed={option.id === palette} onClick={() => onChange(option.id)}>
            {option.label}
          </button>
        ))}
      </div>
    </aside>
  );
}

type PanelProps = {
  panelRef: RefObject<HTMLElement | null>;
  onClose: () => void;
};

function PanelActions({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.panelActions}>
      <button type="button" onClick={onClose}>{site.world.backLabel}</button>
      <button type="button" onClick={onClose} aria-label={site.world.closeLabel}>{site.world.closeLabel}</button>
    </div>
  );
}

function ProjectPanel({ panelRef, selected, selectedIndex, onChoose, onClose }: PanelProps & { selected: Project; selectedIndex: number; onChoose: (index: number) => void }) {
  const world = site.world;
  return (
    <aside ref={panelRef} className={`${styles.panel} ${styles.pumpPanel}`} tabIndex={-1} aria-labelledby="projects-title">
      <div className={styles.pumpTop}>
        <span>{site.entryConsole.stationLabel}</span>
        <span>{site.entryConsole.stationStatus}</span>
        <button className={styles.panelClose} type="button" onClick={onClose} aria-label={world.closeLabel}>{world.closeLabel}</button>
      </div>
      <div className={styles.pumpScreen}>
        <div className={styles.panelHeader}>
          <div>
            <p>{world.sceneLabel}</p>
            <h2 id="projects-title">{world.projectsTitle}</h2>
          </div>
          <span>{world.projectsNote}</span>
        </div>
        <div className={styles.projectList} role="list" aria-label={world.projectsTitle}>
          {site.projects.map((project, index) => (
            <button className={selectedIndex === index ? styles.projectActive : undefined} key={project.slug} type="button" onClick={() => onChoose(index)}>
              <span>{project.code}</span>
              <strong>{project.title}</strong>
              <small>{project.status}</small>
            </button>
          ))}
        </div>
        <article className={styles.projectDetail} aria-live="polite">
          <p>{selected.code} / {selected.year}</p>
          <h3>{selected.title}</h3>
          <p>{selected.summary}</p>
          <dl>
            <div><dt>{world.specLabels.stack}</dt><dd>{selected.stack.join(" · ")}</dd></div>
            <div><dt>{world.specLabels.role}</dt><dd>{selected.role}</dd></div>
            <div><dt>{selected.metric.label}</dt><dd>{selected.metric.value}</dd></div>
          </dl>
          <TerminalTrace projectCode={selected.code} />
        </article>
      </div>
      <div className={styles.pumpNozzles} aria-hidden="true">
        <i /><i /><i />
      </div>
      <div className={styles.pumpBase} aria-hidden="true" />
    </aside>
  );
}

function AboutPanel({ panelRef, onClose }: PanelProps) {
  const world = site.world;
  return (
    <aside ref={panelRef} className={styles.panel} tabIndex={-1} aria-labelledby="about-title">
      <PanelActions onClose={onClose} />
      <div className={styles.panelHeader}>
        <div><p>{site.profile.role}</p><h2 id="about-title">{world.aboutTitle}</h2></div>
        <span>{site.profile.location}</span>
      </div>
      <div className={styles.aboutCopy}>
        {site.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <dl className={styles.currently}>
        <div><dt>Learning</dt><dd>{site.about.currently.learning}</dd></div>
        <div><dt>Building</dt><dd>{site.about.currently.building}</dd></div>
        <div><dt>Reading</dt><dd>{site.about.currently.reading}</dd></div>
      </dl>
    </aside>
  );
}

function ContactPanel({ panelRef, onClose }: PanelProps) {
  const world = site.world;
  return (
    <aside ref={panelRef} className={styles.panel} tabIndex={-1} aria-labelledby="contact-title">
      <PanelActions onClose={onClose} />
      <div className={styles.panelHeader}>
        <div><p>{site.profile.availability}</p><h2 id="contact-title">{world.contactTitle}</h2></div>
        <span>{site.profile.email}</span>
      </div>
      <p className={styles.contactNote}>{world.contactNote}</p>
      <div className={styles.contactRows}>
        <div><span>{world.specLabels.email}</span><strong>{site.profile.email}</strong></div>
        <div><span>{world.specLabels.social}</span><strong>{site.profile.socials.join(" / ")}</strong></div>
        <div><span>{world.specLabels.resume}</span><strong>{site.profile.resumeUrl}</strong></div>
      </div>
    </aside>
  );
}

function makePosterTexture(project: Project, background: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 520;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  const color = `#${background.toString(16).padStart(6, "0")}`;
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#ff6338";
  context.lineWidth = 6;
  context.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);
  context.fillStyle = "#9fb4b5";
  context.font = "28px monospace";
  context.fillText(project.code, 64, 86);
  context.fillStyle = "#f0eee7";
  context.font = "600 74px Arial";
  context.fillText(project.title, 64, 260);
  context.fillStyle = "#9fb4b5";
  context.font = "24px monospace";
  context.fillText(`${project.metric.label} / ${project.metric.value}`, 64, 390);
  context.fillText(project.status.toUpperCase(), 64, 438);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeStationTexture(label: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 100;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  context.fillStyle = "#172526";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#ff6338";
  context.fillRect(0, 0, canvas.width, 5);
  context.fillStyle = "#d5e5e5";
  context.font = "600 34px monospace";
  context.fillText(label.toUpperCase(), 46, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createProjectCar() {
  const car = new THREE.Group();
  const material = new THREE.MeshPhysicalMaterial({ color: 0x1d3435, roughness: 0.25, metalness: 0.62, clearcoat: 0.58, clearcoatRoughness: 0.16 });
  const glassMaterial = new THREE.MeshPhysicalMaterial({ color: 0x2d5355, roughness: 0.16, metalness: 0.42, clearcoat: 0.7, clearcoatRoughness: 0.12 });
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x050707, roughness: 0.82, metalness: 0.2 });
  const rimMaterial = new THREE.MeshStandardMaterial({ color: 0x91a8a9, roughness: 0.33, metalness: 0.7 });
  const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xd5e5e5, roughness: 0.28, metalness: 0.18 });
  const accentMaterial = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.38, metalness: 0.28 });

  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-3.5, 0.08);
  bodyShape.lineTo(-3.25, 0.42);
  bodyShape.lineTo(-2.4, 0.52);
  bodyShape.lineTo(-1.38, 1.05);
  bodyShape.lineTo(1.2, 1.08);
  bodyShape.lineTo(2.1, 0.82);
  bodyShape.lineTo(3.25, 0.66);
  bodyShape.lineTo(3.5, 0.3);
  bodyShape.lineTo(3.2, 0.08);
  bodyShape.closePath();
  const body = extrudeCarShape(bodyShape, 2.5, material);
  body.position.y = 0.25;
  car.add(body);
  const frontSplitter = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.11, 2.72), accentMaterial);
  frontSplitter.position.set(-3.4, 0.29, 0);
  car.add(frontSplitter);

  const cabinShape = new THREE.Shape();
  cabinShape.moveTo(-1.14, 0.98);
  cabinShape.lineTo(-0.62, 1.7);
  cabinShape.lineTo(1.16, 1.63);
  cabinShape.lineTo(1.75, 1.03);
  cabinShape.closePath();
  const cabin = extrudeCarShape(cabinShape, 1.98, glassMaterial);
  cabin.position.y = 0.28;
  car.add(cabin);

  const windowShape = new THREE.Shape();
  windowShape.moveTo(-0.94, 1.05);
  windowShape.lineTo(-0.5, 1.56);
  windowShape.lineTo(0.92, 1.52);
  windowShape.lineTo(1.38, 1.08);
  windowShape.closePath();
  [-1, 1].forEach((side) => {
    const window = new THREE.Mesh(new THREE.ShapeGeometry(windowShape), new THREE.MeshStandardMaterial({ color: 0x0b1718, roughness: 0.12, metalness: 0.72 }));
    window.position.set(0, 0.28, side * 1.01);
    window.scale.y = 0.92;
    car.add(window);
  });

  const roofLine = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.05, 2.08), accentMaterial);
  roofLine.position.set(0.28, 1.94, 0);
  roofLine.rotation.z = -0.04;
  car.add(roofLine);

  [-2.7, -2.3].forEach((x, index) => {
    const light = new THREE.Mesh(new THREE.BoxGeometry(index === 0 ? 0.16 : 0.1, 0.12, 0.7), lightMaterial);
    light.position.set(x, 0.62, 1.12);
    light.rotation.z = -0.12;
    car.add(light);
  });
  const frontLightBar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 1.82), lightMaterial);
  frontLightBar.position.set(-3.46, 0.58, 0);
  frontLightBar.rotation.z = -0.06;
  car.add(frontLightBar);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 1.7), accentMaterial);
  tail.position.set(3.42, 0.62, 0);
  car.add(tail);

  [-1, 1].forEach((side) => {
    const sideBlade = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.12, 0.08), accentMaterial);
    sideBlade.position.set(-0.05, 0.36, side * 1.28);
    sideBlade.rotation.z = side * 0.02;
    car.add(sideBlade);
  });

  [-1, 1].forEach((side) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.75, 0.12), material);
    post.position.set(2.65, 1.05, side * 0.74);
    car.add(post);
  });
  const spoiler = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.09, 2.1), material);
  spoiler.position.set(2.78, 1.45, 0);
  spoiler.rotation.x = -0.06;
  car.add(spoiler);

  [-2.05, 2.05].forEach((x) => {
    [-1, 1].forEach((side) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.3, 16), wheelMaterial);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, 0.4, side * 1.15);
      car.add(wheel);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.32, 12), rimMaterial);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(x, 0.4, side * 1.17);
      car.add(rim);
    });
  });
  return car;
}

function extrudeCarShape(shape: THREE.Shape, depth: number, material: THREE.Material) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.06,
    bevelThickness: 0.06,
    curveSegments: 2,
    depth,
  });
  geometry.translate(0, 0, -depth / 2);
  return new THREE.Mesh(geometry, material);
}
