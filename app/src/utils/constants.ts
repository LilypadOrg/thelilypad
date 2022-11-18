import { ethers } from 'ethers';

export const SBT_MINT_FEE = ethers.utils.parseEther('0.05');
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const BIO_MIN_LENGTH = 5;
export const BIO_MAX_LENGTH = 256;
export const HOMEPAGE_COURSE_FILTERS = 8;
export const HOMEPAGE_COURSE_CAROUSEL = 10;
export const HOMEPAGE_FEATURED_ITEMS = 6;
export const BROWSE_COURSES_CAT_FILTERS = 21;
export const BROWSE_COURSES_ITEMS = 18;
export const TEST_QUESTIONS_BY_LEVEL: { [level: string]: number } = {
  beginner: 10,
  intermediate: 20,
  advanced: 30,
};
// export const TEST_COOLDOWN_MS = 12 * 60 * 60 * 1000; // Hours * 60 minutes * 60 seconds * 1000 milliseconds
export const TEST_COOLDOWN_MS = 10 * 1000; // Hours * 60 minutes * 60 seconds * 1000 milliseconds
// export const TEST_DURATION_MS = 60 * 60 * 1000;
export const TEST_DURATION_MS = 0.2 * 60 * 1000;
export const TEST_SHOW_RESULT_MS = 1 * 60 * 1000;
export const TEST_PASS_RATE = 0.75;

export const COURSES_HOME_ITEMS = 5;
