import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@remote/firebase';
import { useAppDispatch } from '@/hooks/useUser';
import { clearUser, setUser } from '@/store/user.slice';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [initialize, setInitialize] = useState(false);
  const dispatch = useAppDispatch();

  onAuthStateChanged(auth, (user) => {
    if (user == null) {
      dispatch(clearUser());
    } else {
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email ?? '',
          displayName: user.displayName ?? '',
          photoURL: user.photoURL ?? '',
        })
      );
    }
    setInitialize(true);
  });

  if (initialize === false) {
    return null;
  }

  return <>{children}</>;
}

export default AuthGuard;
