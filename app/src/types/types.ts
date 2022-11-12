import { Prisma } from '@prisma/client';
import { BigNumber } from 'ethers';
import { testInstanceSelect } from '~/server/routers/tests';
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
export type UserCourse = inferQueryOutput<'usercourses.single'>;
export type UserCourses = inferQueryOutput<'usercourses.all'>;
export type Question = inferQueryOutput<'tests.questionById'>;

export interface TokenMedata {
  image: string;
  name: string;
  description: string;
}

export interface OnChainProfile {
  DAO: boolean;
  pathChosen: boolean;
  xp: BigNumber;
  level: BigNumber;
  tokenId: BigNumber;
  tokenUri: string | undefined | null;
  badges?: Array<string>;
  completedEvents?: Array<number>;
  tokenMetadata: TokenMedata | undefined;
  sbtImageUrl: string | undefined | null;
}

export interface ContentFilter {
  [x: string]: string | string[] | undefined;
}

export type TestFormInputs = {
  [question: string]: string;
};

export type TestInstanceExt = Prisma.TestinstanceGetPayload<{
  select: typeof testInstanceSelect;
}> & { coolDownTime: number; expiryTime: number };
