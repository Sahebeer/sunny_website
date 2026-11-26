import { site } from "@site";
import { GarageScene } from "./garage-scene";
import styles from "./entry-console.module.css";

export function EntryConsole() {
  const content = site.entryConsole;

  return (
    <section className={styles.entry} id="start" aria-labelledby="entry-title">
      <div className={styles.entryRail}>
        <span>{site.navigation.mark}</span>
        <span>{content.stationStatus}</span>
      </div>

      <div className={styles.entryVisual}>
        <GarageScene />
      </div>

      <div className={styles.entryGrid}>
        <div className={styles.entryCopy}>
          <p className={styles.entryEyebrow}>{content.eyebrow}</p>
          <h1 id="entry-title">{content.title}</h1>
          <p className={styles.entryBody}>{content.body}</p>
          <div className={styles.identityPlate}>
            <span className={styles.identityMark} aria-hidden="true">01</span>
            <div>
              <strong>{site.profile.name}</strong>
              <span>{site.profile.role}</span>
              <span>{site.profile.location}</span>
            </div>
          </div>
        </div>

        <div className={styles.station} aria-label={content.stationLabel}>
          <div className={styles.stationHeader}>
            <span>{content.stationLabel}</span>
            <span>{content.stationStatus}</span>
          </div>
          <div className={styles.stationScreen}>
            <span>{content.displayLabel}</span>
            <strong>{content.displayValue}</strong>
            <small>{content.displayNote}</small>
          </div>
          <div className={styles.stationPrompt}>{content.prompt}</div>
          <nav className={styles.stationRoutes} aria-label={content.prompt}>
            {site.directions.map((direction) => (
              <a href={`#direction-${direction.section}`} key={direction.id}>
                <span>{direction.section}</span>
                <strong>{direction.name}</strong>
                <small>{direction.descriptor}</small>
              </a>
            ))}
          </nav>
          <p className={styles.stationFootnote}>{content.footnote}</p>
        </div>
      </div>
    </section>
  );
}
