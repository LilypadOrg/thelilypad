import { inferQueryOutput } from '~/utils/trpc';

export enum ContentType {
  COURSE = 'Course',
  RESOURCE = 'Resource',
  EVENT = 'Event',
  COMMUNITY_PROJECT = 'Community Project',
}

export type Course = inferQueryOutput<'courses.byId'>;
export type Courses = inferQueryOutput<'courses.all'>;
export type UserProfile = inferQueryOutput<'users.byUsername'>;
export type Tech = inferQueryOutput<'technologies.bySlug'>;
export type Techs = inferQueryOutput<'technologies.all'>;
