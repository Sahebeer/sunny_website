import type { Direction } from "@site";
import { site } from "@site";
import styles from "./developer-workbench.module.css";

export function DeveloperWorkbench({ direction }: { direction: Direction["id"] }) {
  const artifact = site.developerArtifact;
  return (
    <section className={`${styles.workbench} ${styles[direction]}`} aria-labelledby={`${direction}-workbench-title`}>
      <div className={styles.workbenchIntro}>
        <p className={styles.workbenchLabel}>{artifact.label}</p>
        <h3 id={`${direction}-workbench-title`}>{artifact.title}</h3>
        <p>{artifact.body}</p>
      </div>
      <div className={styles.artifactLayout}>
        <figure className={styles.terminalFrame}>
          <figcaption>
            <span>{artifact.terminalLabel}</span>
            <span>{artifact.terminalStatus}</span>
          </figcaption>
          <div className={styles.terminalBody}>
            <span className={styles.prompt}>{artifact.prompt}</span>
            {artifact.terminalLines.map((line, index) => (
              <span className={index === 0 ? styles.commandLine : styles.outputLine} key={line}>
                {index === 0 ? `${artifact.prompt} ${line}` : line}
              </span>
            ))}
            <span className={styles.cursorMark} aria-hidden="true">▌</span>
          </div>
        </figure>
        <div className={styles.posterWall}>
          <div className={styles.wallHeader}>
            <span>{artifact.wallLabel}</span>
            <span>{artifact.wallNote}</span>
          </div>
          <div className={styles.posterGrid}>
            {site.projects.map((project, index) => (
              <article className={`${styles.poster} ${posterClass(index)}`} key={project.code}>
                <div className={styles.posterRail}>
                  <span>{project.code}</span>
                  <span>{project.year}</span>
                </div>
                <h4>{project.title}</h4>
                <p>{project.summary}</p>
                <div className={styles.posterFooter}>
                  <span>{project.stack[0]}</span>
                  <span>{project.status}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function posterClass(index: number) {
  if (index === 0) return styles.posterOne;
  if (index === 1) return styles.posterTwo;
  return styles.posterThree;
}
