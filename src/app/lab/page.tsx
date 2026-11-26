import { site, featuredProject, type Direction } from "@site";
import { EntryConsole } from "@/components/entry-console";
import { DeveloperWorkbench } from "@/components/developer-workbench";
import { InteractionPrototypes } from "@/components/interaction-prototypes";
import styles from "./lab.module.css";

export default function LabPage() {
  return (
    <main>
      <header className={styles.labHeader}>
        <div className={styles.headerInner}>
          <a className={styles.wordmark} href="#top" aria-label={`${site.profile.name} — ${site.navigation.labLabel}`}>
            {site.navigation.mark}
          </a>
          <p>{site.navigation.labIntro}</p>
          <a className={styles.headerHint} href="#direction-01">
            {site.navigation.scrollHint}
          </a>
        </div>
      </header>
      <div id="top" className={styles.labBody}>
        <EntryConsole />
        {site.directions.map((direction) => (
          <DirectionSection direction={direction} key={direction.id} />
        ))}
      </div>
      <footer className={styles.labFooter}>
        <span>{site.navigation.footerNote}</span>
        <span>{site.profile.name}</span>
      </footer>
    </main>
  );
}

function DirectionSection({ direction }: { direction: Direction }) {
  return (
    <section
      className={`${styles.direction} ${styles[direction.id]} ${tokenClassForDirection(direction.id)}`}
      id={`direction-${direction.section}`}
    >
      <div className={styles.directionGrid}>
        <div className={styles.directionMasthead}>
          <span className={styles.sectionNo}>{direction.section}</span>
          <div>
            <p className={styles.directionKicker}>{direction.heroKicker}</p>
            <h2>{direction.name}</h2>
            <p className={styles.directionDescriptor}>{direction.descriptor}</p>
          </div>
          <p className={styles.studioNote}>{direction.studioNote}</p>
        </div>

        <div className={styles.hero}>
          <p className={styles.heroEyebrow}>{direction.heroKicker}</p>
          <h1>{direction.heroTitle}</h1>
          <p className={styles.heroBody}>{direction.heroBody}</p>
          <p className={styles.profileStatement}>{site.profile.statement}</p>
          <div className={styles.heroMeta}>
            <span>{site.profile.name}</span>
            <span>{site.profile.role}</span>
            <span>{site.profile.location}</span>
          </div>
        </div>

        <aside className={styles.tokenPanel} aria-label={`${direction.name} token set`}>
          <div className={styles.panelLabel}>{direction.signature}</div>
          <dl>
            {direction.tokens.map((token) => (
              <div className={styles.tokenRow} key={token.label}>
                <dt>
                  {token.swatch ? <i aria-hidden="true" style={{ backgroundColor: token.swatch }} /> : null}
                  {token.label}
                </dt>
                <dd>{token.value}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className={styles.statusLine}>
          <span>{direction.signal}</span>
          <span>{site.profile.availability}</span>
        </div>

        <div className={styles.projectBlock}>
          <div className={styles.blockHeading}>
            <p>Featured work / {featuredProject.code}</p>
            <span>{featuredProject.year}</span>
          </div>
          <DeveloperWorkbench direction={direction.id} />
          <article className={`${styles.projectSheet} ${styles.projectSheetSecondary}`}>
            <div className={`${styles.projectPlate} ${styles[`plate-${featuredProject.cover}`]}`} role="img" aria-label={featuredProject.coverAlt}>
              <span>{featuredProject.code}</span>
              <strong>{featuredProject.title}</strong>
              <small>DEMO / PROJECT PLATE</small>
            </div>
            <div className={styles.projectInfo}>
              <div className={styles.projectTitleLine}>
                <div>
                  <p className={styles.projectCode}>{featuredProject.code}</p>
                  <h3>{featuredProject.title}</h3>
                </div>
                <span className={styles.projectStatus}>{featuredProject.status}</span>
              </div>
              <p className={styles.projectSummary}>{featuredProject.summary}</p>
              <dl className={styles.specSheet}>
                <SpecRow label="Stack" value={featuredProject.stack.join(" · ")} />
                <SpecRow label="Role" value={featuredProject.role} />
                <SpecRow label="Year" value={featuredProject.year} />
                <SpecRow label={featuredProject.metric.label} value={featuredProject.metric.value} />
              </dl>
            </div>
          </article>
        </div>

        <div className={styles.prototypeBlock}>
          <div className={styles.blockHeading}>
            <p>{site.interactionLab.eyebrow}</p>
            <span>{site.interactionLab.intro}</span>
          </div>
          <InteractionPrototypes direction={direction.id} />
        </div>

        <p className={styles.uniqueNote}>{direction.uniqueNote}</p>
      </div>
    </section>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function tokenClassForDirection(id: Direction["id"]) {
  if (id === "concours") return "directionConcours";
  if (id === "telemetry") return "directionTelemetry";
  return "directionAtelier";
}
