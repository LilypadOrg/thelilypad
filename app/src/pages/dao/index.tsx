import { NextPage } from 'next';
import React, { useState } from 'react';
import BrowseCoursesLink from '~/components/BrowseCoursesLink';
import CourseCarousel from '~/components/CourseCarousel';
import { CourseCardLoading } from '~/components/ui/Loaders';
import { useContentFilter } from '~/hooks/useContentFilter';
import { ContentType } from '~/types/types';
import { trpc } from '~/utils/trpc';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper';
import GovernanceTreasury from '~/components/GovernanceTreasury';

const Dao: NextPage = () => {
  //const { data: courses, isLoading: coursesLoading } = trpc.useQuery([
  //  'courses.all',
  //]);

  return (
    <div className="gradient-bg-top-courses px-[2.5rem] pt-2 lg:px-[5.5rem]">
      <h3 className="mb-2 mt-2">Froggy DAO</h3>
      <GovernanceTreasury />
    </div>
  );
};

export default Dao;
