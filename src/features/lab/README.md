# Character Lab & Test Track (`src/features/lab`)

## What It Renders
The `/lab` route ("Test Track & Cast Dyno Lab"), showcasing all three original characters (`Dudu`, `Old Gasket`, `Pip`) in both `side` (`480x270`) and `front` (`360x270`) views across all 7 acting moods (`neutral`, `curious`, `proud`, `nervous`, `sleepy`, `shocked`, `celebrating`), with live controls for wheel speed, chassis pitch, rubber stamp state, Night Drive headlights, and reduced motion.

## Content Keys Read
- `site.mascotName`
- `site.inspectorName`
- `site.sidekickName`

## What It Must Not Touch
Imports only from `src/actors/CarActor`, `src/design/ui`, `src/lib`, and `src/content/site`. Never imports from other feature folders.
