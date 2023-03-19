import { NextPage } from 'next';
import { useRouter } from 'next/router';
import AccoladeCard from '~/components/AccoladeCard';
import CourseCard from '~/components/CourseCard';
import { api } from '~/utils/api';

const UserAccolades: NextPage = () => {
  const router = useRouter();
  const username = router.query.username as string;

  const { data: userCourses } = api.usercourses.all.useQuery({ username });

  return (
    <div className="gradient-bg-top-courses px-[2.5rem] pt-2 lg:px-[5.5rem]">
      <h3 className="mb-8 mt-4">{username} Accolades</h3>
      {userCourses && (
        <div>
          {userCourses.map((c) => (
            <div key={`course-${c.course.id}`}>
              <div className="flex">
                <CourseCard course={c.course} type="simple" actions={false} />
                {c.course.accolades.map((a) => (
                  <AccoladeCard
                    key={`${c.course.id}-accolade-${a.id}`}
                    accolade={a}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAccolades;
