import { Level } from '@prisma/client';

export const getCourseHighestLevel = (levels: Level[]) => {
  const levelSlugs = levels.map((l) => l.slug);
  if (levelSlugs.includes('advanced')) {
    return 'advanced';
  } else if (levelSlugs.includes('intermediate')) {
    return 'intermediate';
  } else if (levelSlugs.includes('beginner')) {
    return 'beginner';
  } else {
    throw Error();
  }
};
