import { Prisma } from '@prisma/client';
import { BigNumber } from 'ethers';
import { testInstanceSelect } from '~/server/api/routers/tests';
// TODO: find replacement for this
import type { inferRouterOutputs } from '@trpc/server';
import { AppRouter } from '~/server/api/root';

type RouterOutput = inferRouterOutputs<AppRouter>;

export enum ContentType {
  COURSE = 'Course',
  RESOURCE = 'Resource',
  EVENT = 'Event',
  COMMUNITY_PROJECT = 'Community Project',
}

export type FilterOptions =
  | RouterOutput['tags']['byContentTYpe']
  | RouterOutput['levels']['byContentTYpe']
  | RouterOutput['technologies']['byContentTYpe'];

export type Resources = RouterOutput['resources']['all'];

export type Course = RouterOutput['courses']['byId'];
export type Courses = RouterOutput['courses']['all'];
export type CoursesByUser = RouterOutput['courses']['byUsername'];
export type UserProfile = RouterOutput['users']['byUsername'];
export type Tech = RouterOutput['technologies']['bySlug'];
export type Techs = RouterOutput['technologies']['all'];
export type UserCourse = RouterOutput['usercourses']['single'];
export type UserCourses = RouterOutput['usercourses']['all'];
export type Question = RouterOutput['tests']['questionById'];
export type Project = RouterOutput['projects']['byId'];

export interface TokenMedata {
  image: string;
  name: string;
  description: string;
}

// export type RoadmapCourses = {
//   beginner: CoursesByUser;
//   intermediate: CoursesByUser;
//   advanced: CoursesByUser;
// };

export type RoadmapCourses = {
  beginner: UserCourses;
  intermediate: UserCourses;
  advanced: UserCourses;
};

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

export type Accolade = Prisma.AccoladeGetPayload<{
  select: { id: true; imageUrl: true; description: true };
}>;

export interface DaoList {
  status: number | null;
  id: number;
  description: string;
  proposalId: string | null;
  eta: number | null;
  tx: string | null;
  snapshotBlock: string | null;
}

export default interface ProposalJson {
  id?: number;
  proposer?: string;
  title?: string;
  summary?: string;
  description?: string;
  targets?: string[];
  values?: string[];
  signatures?: string[];
  calldatas?: string[];
  contractFunctions?: string[];
  annex?: string[];
  proposalTimeStamp?: string;
  proposalBlock?: string;
  parameters?: string[];
  functionId?: number[];
}
