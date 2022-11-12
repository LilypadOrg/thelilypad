import React from 'react';
import { Courses } from '~/types/types';
import CourseCard from './CourseCard';
import { CourseCardLoading } from './ui/Loaders';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper';

interface Props {
  bgColor?: string;
  title?: string;
  courses?: Courses;
  type?: 'simple' | 'full';
  isLoading: boolean;
}

const loaders = [1, 2, 3, 4, 5];

const CourseCarousel = ({
  bgColor,
  title,
  courses,
  type = 'full',
  isLoading,
}: Props) => {
  return (
    <div className={`my-8 ${bgColor && bgColor}`}>
      {title && <h4 className="text-2xl md:text-3xl lg:text-4xl">{title}</h4>}
      {/* Card Container */}
      <Swiper
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
          loaders.map((i) => (
            <SwiperSlide key={`course-${i}`}>
              <CourseCardLoading />
            </SwiperSlide>
          ))}
        {courses &&
          courses!.map((course) => (
            <SwiperSlide key={`course-${course.id}`}>
              <CourseCard
                key={`course-${course.id}`}
                course={course}
                type={type}
              />
            </SwiperSlide>
          ))}
      </Swiper>

      {/* <div className="mt-8 flex space-x-8 overflow-x-auto px-2 py-2">
        {isLoading && loaders.map((i) => <CourseCardLoading key={i} />)}
        {courses &&
          courses!.map((course) => (
            <CourseCard
              key={`course-${course.id}`}
              course={course}
              type={type}
            />
          ))}
      </div> */}
    </div>
  );
};

export default CourseCarousel;
