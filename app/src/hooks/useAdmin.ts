import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const useAdmin = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      sessionStatus === 'unauthenticated' ||
      (sessionStatus === 'authenticated' && !session?.user?.isAdmin)
    ) {
      router.replace('/');
    }
  }, [session, sessionStatus, router]);
};

export default useAdmin;
