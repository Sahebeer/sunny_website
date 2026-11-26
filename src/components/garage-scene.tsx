"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { featuredProject, site } from "@site";
import styles from "./garage-scene.module.css";

export function GarageScene() {
  const reducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const content = site.entryConsole;

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    setTilt({ x: y * -3, y: x * 4 });
  }

  return (
    <figure className={styles.sceneFigure}>
      <div className={styles.sceneHud}>
        <span>{content.sceneLabel}</span>
        <span>{site.profile.location}</span>
      </div>
      <div
        className={styles.sceneViewport}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        onPointerMove={handlePointerMove}
      >
        <motion.div
          animate={reducedMotion ? undefined : { y: [0, -3, 0] }}
          className={styles.sceneCamera}
          style={{ rotateX: tilt.x, rotateY: tilt.y }}
          transition={reducedMotion ? { duration: 0 } : { duration: 7, ease: "easeInOut", repeat: Infinity }}
        >
          <div className={styles.sceneWorld}>
            <div className={styles.sceneSky} />
            <div className={styles.canopy}>
              <span className={styles.canopyEdge} />
              <span className={styles.canopyLight} />
              <span className={styles.canopyLight} />
              <span className={styles.canopyLight} />
            </div>
            <div className={`${styles.stationColumn} ${styles.columnLeft}`} />
            <div className={`${styles.stationColumn} ${styles.columnRight}`} />
            <div className={styles.pumpUnit}>
              <span className={styles.pumpTop}>S-01</span>
              <strong>03</strong>
              <span className={styles.pumpReadout}>{content.displayLabel}</span>
              <i className={styles.pumpSlot} />
              <i className={styles.pumpSlot} />
              <i className={styles.pumpSlot} />
            </div>
            <div className={styles.projectCapsule}>
              <span>{featuredProject.code}</span>
              <strong>{featuredProject.title}</strong>
              <small>{featuredProject.metric.label} / {featuredProject.metric.value}</small>
            </div>
            <div className={styles.groundPlane} />
          </div>
        </motion.div>
        <span className={styles.sceneCrosshair} aria-hidden="true" />
        <span className={styles.sceneCoordinates} aria-hidden="true">00 / 03 / 26</span>
      </div>
      <figcaption className={styles.sceneCaption}>{content.sceneNote}</figcaption>
    </figure>
  );
}
