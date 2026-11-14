import { agrinexus } from './agrinexus';
import { ecosnap } from './ecosnap';
import { smartscan } from './smartscan';
import { videopipeline } from './videopipeline';
import { optionalProjects } from './optional';

export const projects = [agrinexus, ecosnap, smartscan, videopipeline];

export const enabledOptionalProjects = optionalProjects.filter((p) => p.enabled === true);

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug || p.id === slug) || null;
}

export { agrinexus, ecosnap, smartscan, videopipeline, optionalProjects };

