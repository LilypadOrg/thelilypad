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
export const QUESTION_NUM_BY_LEVEL: { [level: string]: number } = {
  beginnner: 5,
  intermediate: 10,
  advanced: 20,
};
export const TEST_COOLDOWN_MS = 12 * 60 * 60 * 1000; // Hours * 60 minutes * 60 seconds * 1000 milliseconds
export const TEST_DURATION_MINS = 60;

export const COURSES_HOME_ITEMS = 5;
