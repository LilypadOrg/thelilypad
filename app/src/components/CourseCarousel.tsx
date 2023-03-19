import React from 'react';
import { Courses } from '~/types/types';
import CourseCard from './CourseCard';
import { CourseCardLoading } from './ui/Loaders';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper';
import SectionTitle from './ui/SectionTitle';

interface Props {
  bgColor?: string;
  title?: string;
  courses?: Courses;
  type?: 'simple' | 'full';
  isLoading: boolean;
}

const CourseCarousel = ({
  bgColor,
  title,
  courses,
  type = 'full',
  isLoading,
}: Props) => {
  return (
    <div className={`my-8 ${bgColor && bgColor}`}>
      {title && <SectionTitle title={title} />}
      {/* Card Container */}
      <Swiper
        style={{
          maxHeight: '500px',
          paddingBottom: '3rem',
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          585: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          680: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          1000: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 2.5,
            spaceBetween: 10,
          },
          1400: {
            slidesPerView: 2.7,
            spaceBetween: 20,
          },
        }}
        // autoplay={{
        //   delay: 2500,
        //   disableOnInteraction: false,
        // }}
        className="mySwiper"
      >
        {isLoading &&
          [1, 2, 3, 4, 5].map((i) => (
            <SwiperSlide key={`${title}-loader- course-${i}`}>
              <CourseCardLoading />
            </SwiperSlide>
          ))}
        {courses &&
          courses!.map((course) => (
            <SwiperSlide key={`${title}-course-${course.id}`}>
              <CourseCard course={course} type={type} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default CourseCarousel;
