import LikeItem from '@/components/likeList/LikeItem';
import FixedBottomButton from '@/components/shared/FixedBottomButton';
import FullPageLoader from '@/components/shared/FullPageLoader';
import Spacing from '@/components/shared/Spacing';
import { useAppSelector } from '@/hooks/useUser';
import { getLikes } from '@/remote/like';
import { RootState } from '@/store';
import { Fragment } from 'react';
import { useQuery } from 'react-query';

const Like = () => {
  const { user } = useAppSelector((state: RootState) => state.userSlice);
  const { data } = useQuery(['likes'], () => getLikes({ userId: user?.uid as string }));

  if (data?.length == 0) {
    return (
      <>
        <FullPageLoader message="찜한 숙소가 없네요" />
        <FixedBottomButton label="결제 하기" onClick={() => {}} disabled={true} />
      </>
    );
  }
  return (
    <div>
      <ul>
        {data?.map((hotel, i) => (
          <Fragment key={hotel.id}>
            <LikeItem hotel={hotel} />
            {data.length - 1 === i ? null : (
              <Spacing size={8} backgroundColor="gray100" style={{ margin: '20px 0' }} />
            )}
          </Fragment>
        ))}
      </ul>
      <FixedBottomButton label="결제 하기" onClick={() => {}} />
    </div>
  );
};
export default Like;
