import { useForm, SubmitHandler } from 'react-hook-form';
import { Techs, UserProfile } from '~/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  BIO_MAX_LENGTH,
  BIO_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '~/utils/constants';
import { useCallback, useEffect, useRef, useState } from 'react';
import { trpc } from '~/utils/trpc';
import LevelPill from './ui/LevelPill';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { MAIN_CONTRACT_ABI, MAIN_CONTRACT_ADDRESS } from '~/utils/contracts';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

const EditProfileModal = ({
  open,
  mode,
  userProfile,
  closeModal,
}: {
  open: boolean;
  mode: 'update' | 'create';
  userProfile: NonNullable<UserProfile>;
  closeModal: () => void;
}) => {
  type Inputs = {
    username: string;
    bio: string;
  };

  const router = useRouter();
  const utils = trpc.useContext();
  const modalRef = useRef(null);

  const { data: techs } = trpc.useQuery(['technologies.all']);
  const { mutate: updateProfile, isLoading: isLoadingUpateProfile } =
    trpc.useMutation(['users.updateProfile'], {
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: (data) => {
        const changeRoute = userProfile.username !== data.username;
        utils.invalidateQueries([
          'users.byUsername',
          { username: data.username },
        ]);
        utils.invalidateQueries([
          'users.byAddress',
          { address: userProfile.address },
        ]);
        if (changeRoute) router.replace(`/profiles/${data.username}`);
        closeModal();
      },
    });

  const [selectedSkills, setSelectedSkills] = useState<
    typeof userProfile.technologies
  >(userProfile.technologies);

  const [availableSkills, setAvailableSkills] = useState<NonNullable<Techs>>(
    []
  );

  const { data: createMemberSignature } = trpc.useQuery(
    [
      'blockend.signCreateMember',
      {
        xp: userProfile?.xp || 0,
        courses: userProfile?.courses.map((c) => c.courseId) || [],
      },
    ],
    {
      enabled: mode === 'create',
    }
  );

  const { config: createMemberConfig } = usePrepareContractWrite({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'createMember',
    args: [
      userProfile.xp, // _initialXP
      userProfile.courses.filter((c) => c.completed).map((c) => c.courseId), // -completedEvents
      [], // _badges
      createMemberSignature, // _sig
    ],
    enabled: !!createMemberSignature,
  });

  console.log('userProfile.courses');
  console.log(userProfile.courses.filter((c) => c.completed));

  const { data: createMemberRes, write: createMember } =
    useContractWrite(createMemberConfig);

  const { isLoading: isLoadingCreateMember } = useWaitForTransaction({
    hash: createMemberRes?.hash,
    onSuccess: () => {
      const data = getValues();
      updateProfile({
        username: data.username,
        bio: data.bio,
        technologies: selectedSkills.map((t) => t.id),
      });
    },
  });

  /* ---- Modal Stuff ----- */

  const hideModal = (e: React.MouseEvent<HTMLElement>) => {
    console.log('Hello');

    if (modalRef.current === e.target) {
      console.log('Hello');
      closeModal();
    }
  };

  const keyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        closeModal();
        console.log('Esc pressed');
      }
    },
    [closeModal, open]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyPress);
    return () => document.removeEventListener('keydown', keyPress);
  }, [keyPress]);

  /* ---- Modal Stuff ----- */

  useEffect(() => {
    if (techs) {
      const selectedSkillsIds = selectedSkills.map((s) => s.id);
      setAvailableSkills(
        techs.filter((t) => !selectedSkillsIds.includes(t.id))
      );
    }
  }, [techs]);

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
    getValues,
    formState: { errors },
  } = useForm<Inputs>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<Inputs> = ({ username, bio }) => {
    if (mode === 'create') {
      if (createMember) createMember({});
    } else {
      updateProfile({
        username,
        bio,
        technologies: selectedSkills.map((t) => t.id),
      });
    }
  };

  const handleSkillSelected = (id: number) => {
    if (!techs) return;
    const newTech = techs.find((t) => t.id === id);
    if (!newTech) return;
    setSelectedSkills(selectedSkills.concat(newTech));
    setAvailableSkills(availableSkills.filter((t) => t.id !== id));
  };

  const handleSkillRemoved = (id: number) => {
    if (!techs) return;
    const newTech = techs.find((t) => t.id === id);
    if (!newTech) return;
    setAvailableSkills(availableSkills.concat(newTech));
    setSelectedSkills(selectedSkills.filter((t) => t.id !== id));
  };

  return (
    <div
      className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center overflow-auto bg-[rgba(0,0,0,0.5)] p-1"
      ref={modalRef}
      onClick={hideModal}
    >
      <div className="relative mt-20 transform overflow-hidden rounded-lg bg-secondary-400 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="bg-secondary-400 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
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
                  <div className="flex flex-col gap-4">
                    <label className="font-bold uppercase tracking-widest">
                      Username
                    </label>
                    <input
                      className="rounded-lg bg-secondary-300 p-2 placeholder:text-gray-500"
                      placeholder="Username"
                      defaultValue={
                        userProfile?.username === userProfile?.address
                          ? ''
                          : userProfile?.username || ''
                      }
                      {...register('username')}
                    />
                    {errors.username && <span>{errors.username.message}</span>}
                    <label className="font-bold uppercase tracking-widest">
                      Bio
                    </label>
                    <textarea
                      className="rounded-lg bg-secondary-300 p-2 placeholder:text-gray-500"
                      placeholder="Bio"
                      {...register('bio')}
                      defaultValue={userProfile.bio || ''}
                    />
                    {errors.bio && <span>{errors.bio.message}</span>}
                    <label className="font-bold uppercase tracking-widest">
                      Your Skills
                    </label>

                    <div className="flex flex-wrap">
                      {selectedSkills.map((ts) => (
                        <button
                          key={`selected-skill-${ts.id}`}
                          onClick={() => handleSkillRemoved(ts.id)}
                        >
                          <LevelPill
                            key={`selected-skill-${ts.id}`}
                            level={ts.name}
                            noColor={true}
                            classes="justify-self-start bg-white"
                          />
                        </button>
                      ))}
                    </div>
                    <div className="font-bold uppercase tracking-widest">
                      Select Skills
                    </div>
                    <div>
                      {availableSkills?.map((ts) => (
                        <button
                          key={`available-skill-${ts.id}`}
                          onClick={() => handleSkillSelected(ts.id)}
                        >
                          <LevelPill
                            level={ts.name}
                            classes="justify-self-start"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-transparent px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    {/* TODO: Show spinner in button when loading */}
                    <button
                      disabled={
                        (mode === 'create' && !createMember) ||
                        isLoadingCreateMember ||
                        isLoadingUpateProfile
                      }
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Save Profile
                    </button>
                    <button
                      onClick={closeModal}
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
  );
};

export default EditProfileModal;
