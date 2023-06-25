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
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import LevelPill from '../ui/LevelPill';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { getLilyPadABI, getLilyPadAddress } from '~/utils/contracts';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { BigNumber } from 'ethers';
import Modal from './Modal';
import { Dialog } from '@headlessui/react';

//TODO: MAKE UPDATE PROFILE WORK
const EditProfileModal = ({
  open,
  setOpen,
  mode,
  userProfile,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: 'update' | 'create';
  userProfile: NonNullable<UserProfile>;
}) => {
  type Inputs = {
    username: string;
    bio: string;
  };

  const router = useRouter();
  const utils = api.useContext();

  const { data: techs } = api.technologies.all.useQuery();
  const { mutate: updateProfile, isLoading: isLoadingUpateProfile } =
    api.users.updateProfile.useMutation({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: (data) => {
        utils.users.byUsername.invalidate({ username: data.username });
        const changeRoute = userProfile.username !== data.username;
        if (changeRoute) router.replace(`/profiles/${data.username}`);
        setOpen(false);
      },
    });

  const [selectedSkills, setSelectedSkills] = useState<
    typeof userProfile.technologies
  >(userProfile.technologies);

  const [availableSkills, setAvailableSkills] = useState<NonNullable<Techs>>(
    []
  );

  const { data: createMemberSignature } =
    api.blockend.signCreateMember.useQuery(
      {
        member: userProfile?.address,
        xp: userProfile?.xp || 0,
        courses:
          userProfile.courses
            .filter((c) => c.completed)
            .map((c) => c.courseId) || [],
      },
      {
        enabled: mode === 'create',
      }
    );

  const { config: createMemberConfig } = usePrepareContractWrite({
    address: getLilyPadAddress(),
    abi: getLilyPadABI(),
    functionName: 'createMember',
    args: [
      userProfile?.address,
      BigNumber.from(userProfile.xp), // _initialXP
      (userProfile?.courses?.length ?? 0) > 0
        ? userProfile.courses
            .filter((c) => c.completed)
            .map((c) => BigNumber.from(c.courseId))
        : [], // -completedEvents
      [], // _badges
      createMemberSignature as `0x${string}`, // _sig
    ],
    enabled: !!createMemberSignature,
  });

  const { data: createMemberRes, write: createMember } =
    useContractWrite(createMemberConfig);

  const { isLoading: isLoadingCreateMember } = useWaitForTransaction({
    hash: createMemberRes?.hash,
    onSuccess: () => {
      console.log('teste');
      const data = getValues();
      updateProfile({
        username: data.username,
        bio: data.bio,
        technologies: selectedSkills.map((t) => t.id),
        hasOnChainProfile: true,
      });
    },
    onError: (e) => {
      console.log(e.message);
    },
  });

  useEffect(() => {
    if (techs) {
      const selectedSkillsIds = selectedSkills.map((s) => s.id);
      setAvailableSkills(
        techs.filter((t) => !selectedSkillsIds.includes(t.id))
      );
    }
  }, [techs, selectedSkills]);

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
    console.log(createMemberConfig);
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

  const isLoading = isLoadingCreateMember || isLoadingUpateProfile;

  return (
    <Modal open={open} setOpen={setOpen}>
      <Dialog.Panel className="relative transform overflow-hidden rounded-sm bg-secondary-300 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
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
                      className="rounded-sm bg-secondary-300 p-2 placeholder:text-gray-500"
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
                      className="rounded-sm bg-secondary-300 p-2 placeholder:text-gray-500"
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
                    <button
                      disabled={
                        (mode === 'create' && !createMember) || isLoading
                      }
                      type="submit"
                      className={`bg-primary  inline-flex w-full cursor-pointer justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                        isLoading && 'cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="mr-3 -ml-1 h-5 w-5 animate-spin text-indigo-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving profile
                        </>
                      ) : (
                        'Save Profile'
                      )}
                    </button>
                    <button
                      onClick={() => setOpen(false)}
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
      </Dialog.Panel>
    </Modal>
  );
};

export default EditProfileModal;
