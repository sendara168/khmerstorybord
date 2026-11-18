import sampleBusiness from '../../storyboards/sample-7-business-lessons.json';
import sampleScience from '../../storyboards/draft-1794985236735.json';
import type { StoryboardProject } from '../types/storyboard';

export const BUNDLED_PROJECTS: StoryboardProject[] = [
  sampleScience as unknown as StoryboardProject,
  sampleBusiness as unknown as StoryboardProject,
];
