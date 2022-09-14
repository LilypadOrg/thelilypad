import { useForm, SubmitHandler } from 'react-hook-form';
import { UserProfile } from '~/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  BIO_MAX_LENGTH,
  BIO_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '~/utils/constants';

const EditProfileModal = ({
  open,
  userProfile,
}: {
  open: boolean;
  userProfile: UserProfile;
}) => {
  type Inputs = {
    username: string;
    bio: string;
  };

  const schema = z.object({
    username: z
      .string()
      .min(USERNAME_MIN_LENGTH, {
        message: `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
      })
      .max(USERNAME_MAX_LENGTH, {
        message: `Username can be maximum ${USERNAME_MAX_LENGTH} characters`,
      }),
    bio: z
      .string()
      .min(BIO_MIN_LENGTH, {
        message: `Bio must be at least ${BIO_MIN_LENGTH} characters`,
      })
      .max(BIO_MAX_LENGTH, {
        message: `Username can be maximum ${BIO_MAX_LENGTH} characters`,
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Background backdrop, show/hide based on modal state. */}
      <div
        className={`${
          open ? 'fixed' : 'hidden'
        } inset-0 bg-gray-500 bg-opacity-75 transition-opacity`}
      ></div>

      <div
        className={`${open ? 'fixed' : 'hidden'} inset-0 z-10 overflow-y-auto`}
      >
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          {/* Modal panel, show/hide based on modal state. */}
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-900"
                    id="modal-title"
                  >
                    Edit Profile
                  </h3>
                  <div className="mt-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="flex flex-col gap-2">
                        <label>Username</label>
                        <input
                          placeholder="Username"
                          value={
                            userProfile?.username === userProfile?.address
                              ? ''
                              : userProfile?.username
                          }
                          {...register('username')}
                        />
                        {errors.username && (
                          <span>{errors.username.message}</span>
                        )}
                        <label>Bio</label>
                        <textarea placeholder="Bio" {...register('bio')}>
                          {userProfile?.bio}
                        </textarea>
                        {errors.bio && <span>{errors.bio.message}</span>}
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Save Profile
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
