# CarActor (`src/actors/CarActor`)

**Status:** FROZEN once Phase 0 is approved. Every feature imports `<CarActor>` from here; no feature draws its own cars.

## What It Renders
Reusable inline SVG + CSS Variables character actor for the original cast of **Apex Hollow Test Fleet**:
1. **`hero`** (*Dudu*): Compact hot-hatch in cobalt (`#2F5BFF`) with sunshine-yellow (`#FFC72C`) roof/rally stripe, chunky proportions, rear spoiler, and radius-42 5-spoke wheels.
2. **`inspector`** (*Old Gasket*): Tall boxy station wagon in faded teal (`#488B86`) with wood/cream beltline trim, brass monocle bezel on the right headlight-eye, and an articulated wiper arm holding a rubber stamp (`PASSED` / `REJECTED` / `NEEDS MORE TESTING`).
3. **`pip`** (*Pip*): Tiny three-wheeled delivery scooter-van in sunshine yellow (`#FFC72C`) with cobalt trim and parcel box.

## Props
- `variant`: `'hero' | 'inspector' | 'pip'`
- `view`: `'side' | 'front'` (`480x270` side viewBox, `360x270` front portrait viewBox)
- `mood`: `'neutral' | 'curious' | 'proud' | 'nervous' | 'sleepy' | 'shocked' | 'celebrating'`
- `speed`: `0..120` (controls 5-spoke wheel rotation speed)
- `lookX`, `lookY`: optional `-6..6` pupil offset override (otherwise tracks cursor up to `6px`)
- `stampText`: optional string for Old Gasket's rubber stamp
- `headlightsOn`: boolean for Night Drive headlight beams
- `motionState`: `'idle' | 'accelerate' | 'brake' | 'stop'`

## Content Keys Read
None directly (accepts props from parent feature).

## What It Must Not Touch
Must never import from `src/features/*`.
