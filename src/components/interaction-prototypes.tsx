"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { Direction } from "@/content/site";
import { site } from "@/content/site";
import styles from "./interaction-prototypes.module.css";

type PrototypeProps = {
  direction: Direction["id"];
};

export function InteractionPrototypes({ direction }: PrototypeProps) {
  const reducedMotion = useReducedMotion();
  return (
    <div className={`${styles.prototypeGrid} ${styles[direction]}`}>
      <SpecReveal reducedMotion={Boolean(reducedMotion)} />
      <RevLine reducedMotion={Boolean(reducedMotion)} />
      <GarageDoor reducedMotion={Boolean(reducedMotion)} />
    </div>
  );
}

function SpecReveal({ reducedMotion }: { reducedMotion: boolean }) {
  const [activeRow, setActiveRow] = useState(0);
  const content = site.interactionLab.specReveal;
  return (
    <section className={styles.prototype} aria-labelledby="spec-reveal-title">
      <div className={styles.prototypeHeader}>
        <span className={styles.prototypeIndex}>01</span>
        <h3 id="spec-reveal-title">{content.title.replace("01 / ", "")}</h3>
      </div>
      <p>{content.body}</p>
      <div className={styles.specRows}>
        {content.rows.map((row, index) => (
          <button
            className={`${styles.specRow} ${activeRow === index ? styles.active : ""}`}
            key={row.label}
            onFocus={() => setActiveRow(index)}
            onMouseEnter={() => setActiveRow(index)}
            type="button"
          >
            <span>{row.label}</span>
            <span>{row.value}</span>
            <motion.i
              aria-hidden="true"
              className={styles.specRule}
              initial={false}
              animate={{ scaleX: activeRow === index ? 1 : 0.18, opacity: activeRow === index ? 1 : 0.42 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

function RevLine({ reducedMotion }: { reducedMotion: boolean }) {
  const content = site.interactionLab.revLine;
  const [progress, setProgress] = useState(42);
  const activeUnit = Math.min(content.units.length - 1, Math.floor(progress / 25));
  return (
    <section className={styles.prototype} aria-labelledby="rev-line-title">
      <div className={styles.prototypeHeader}>
        <span className={styles.prototypeIndex}>02</span>
        <h3 id="rev-line-title">{content.title.replace("02 / ", "")}</h3>
      </div>
      <p>{content.body}</p>
      <div className={styles.revReadout}>
        <span>{content.label}</span>
        <strong>{String(progress).padStart(3, "0")}%</strong>
      </div>
      <div className={styles.revTrack} aria-hidden="true">
        <motion.span
          animate={{ width: `${progress}%` }}
          className={styles.revFill}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.28, ease: "easeOut" }}
        />
      </div>
      <input
        aria-label={content.label}
        className={styles.revInput}
        max="100"
        min="0"
        onChange={(event) => setProgress(Number(event.target.value))}
        type="range"
        value={progress}
      />
      <div className={styles.unitTicks}>
        {content.units.map((unit, index) => (
          <span className={index === activeUnit ? styles.active : ""} key={unit}>
            {unit}
          </span>
        ))}
      </div>
    </section>
  );
}

function GarageDoor({ reducedMotion }: { reducedMotion: boolean }) {
  const content = site.interactionLab.garageDoor;
  const [activeModel, setActiveModel] = useState(0);
  const selectedModel = content.lineup[activeModel];
  return (
    <section className={styles.prototype} aria-labelledby="garage-door-title">
      <div className={styles.prototypeHeader}>
        <span className={styles.prototypeIndex}>03</span>
        <h3 id="garage-door-title">{content.title.replace("03 / ", "")}</h3>
      </div>
      <p>{content.body}</p>
      <div className={styles.garageStage}>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className={styles.garageSelected}
            initial={{ opacity: 0, x: reducedMotion ? 0 : 20 }}
            key={selectedModel.code}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>{selectedModel.code}</span>
            <strong>{selectedModel.title}</strong>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className={styles.garageLineup} role="list" aria-label={content.trigger}>
        {content.lineup.map((model, index) => (
          <button
            aria-current={activeModel === index ? "true" : undefined}
            className={activeModel === index ? styles.active : ""}
            key={model.code}
            onClick={() => setActiveModel(index)}
            type="button"
          >
            <span>{model.code}</span>
            <span>{model.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
