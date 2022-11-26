import React from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { getSBTLocalURL } from '~/utils/formatters';
import { trpc } from '~/utils/trpc';

const Avatar = () => {
  const { data: session } = useSession();

  const { data: user } = trpc.useQuery(
    ['users.byAddress', { address: session?.user.address || '' }],
    { enabled: !!session?.user }
  );

  const userImage =
    user && user.hasPondSBT
      ? getSBTLocalURL(user.level.number)
      : getSBTLocalURL(0);

  return (
    <Image
      src={userImage}
      width={100}
      height={100}
      alt="avatar"
      style={{ borderRadius: 999 }}
    />
  );
};

export default Avatar;
