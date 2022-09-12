import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useAccount, useDisconnect } from 'wagmi';
import { useEffect } from 'react';
import { trpc } from '~/utils/trpc';

const AccountWidget = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: session } = useSession();

  useEffect(() => {
    if (address && session && session.user.address !== address) {
      disconnect();
    }
  }, [address, session, disconnect]);

  const { data: user } = trpc.useQuery(
    ['users.byAddress', { address: session?.user.address || '' }],
    {
      enabled: !!session?.user,
      onSuccess: (data) => {
        if (!data) {
          disconnect();
        }
      },
    }
  );

  return user ? (
    <div>
      <Link href={`/profiles/${user.name}`}>
        <button className="rounded-lg border-2 border-slate-500 p-2">
          Lvl: {user?.level.number} / XP: {user?.xp}
        </button>
      </Link>
    </div>
  ) : null;
};

export default AccountWidget;
