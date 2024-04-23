import { useAppSelector } from '@/hooks/useUser';
import { RootState } from '@/store';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state: RootState) => state.userSlice);

  if (user == null) {
    return <Navigate to="/signin" replace={true} />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
