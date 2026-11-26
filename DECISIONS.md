# Build decisions

- The cinematic night gas station is the primary portfolio surface. The previous Three.js primitive scene is retired instead of being incrementally decorated.
- Poly Haven is the source for downloaded lighting and material references because its public assets are CC0 and can be refreshed by a repeatable script.
- The station and car are authored as GLB assets by Blender. Three.js is reserved for loading, lighting, camera choreography, post-processing, and explicitly requested particles/reflection effects.
- The visual system is deliberately narrow: near-black ground, cold fluorescent light, one warm orange canopy line, and a left/front wedge-car silhouette.
- The route is still content-driven through `src/content/site.ts`; demo fallbacks are allowed only where the current owner content is still bracketed.
- Blender source sketches use Y as the design-height axis, so the export pipeline applies a documented X-axis rotation before GLB export to present the assets upright in the Y-up web runtime.
- Review rounds 1–6 were kept as evidence. The current build is functional and visually coherent, but the generated car/station meshes remain the largest gap to a true award-site finish.
