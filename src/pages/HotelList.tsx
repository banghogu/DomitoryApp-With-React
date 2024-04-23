import HotelItem from '@/components/hotelList/HotelItem';
import Spacing from '@/components/shared/Spacing';
import Top from '@/components/shared/Top';
import { useAlertContext } from '@/contexts/AlertContext';
import { useAppSelector } from '@/hooks/useUser';
import { Hotel } from '@/model/hotel';
import { getHotels } from '@/remote/hotel';
import { getLikes, toggleLike } from '@/remote/like';
import { RootState } from '@/store';
import { Fragment, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

const HotelList = () => {
  const client = useQueryClient();
  const navigate = useNavigate();
  const { open } = useAlertContext();
  const { user } = useAppSelector((state: RootState) => state.userSlice);
  const {
    data,
    hasNextPage = false,
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery(['hotels'], ({ pageParam }) => getHotels(pageParam), {
    getNextPageParam: (snapshot) => {
      return snapshot.lastVisible;
    },
  });
  const loadMore = useCallback(() => {
    if (hasNextPage === false || isFetching) {
      return;
    }

    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetching]);

  const hotels = data?.pages.map(({ items }) => items).flat();

  const { data: likes } = useQuery(['likes'], () => getLikes({ userId: user?.uid as string }), {
    enabled: user != null,
  });

  const { mutate: like } = useMutation(
    ({ hotel }: { hotel: Pick<Hotel, 'name' | 'id' | 'mainImageUrl'> }) => {
      if (user == null) {
        throw new Error('로그인 필요');
      }
      return toggleLike({ hotel, userId: user?.uid as string });
    },
    {
      onError: (e: Error) => {
        if (e.message == '로그인 필요') {
          open({
            title: '로그인이 필요한 기능입니다',
            onButtonClick: () => navigate('/signin'),
          });
          return;
        }

        open({
          title: '알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요',
          onButtonClick: () => {},
        });

        return;
      },
      onSuccess: () => {
        client.invalidateQueries(['likes']);
      },
    }
  );

  console.log(hotels?.length);

  return (
    <div>
      <Top title="인기 호텔" subTitle="호텔부터 펜션까지 최저가" />
      <InfiniteScroll
        dataLength={hotels?.length ?? 0}
        hasMore={hasNextPage}
        loader={<></>}
        next={loadMore}
        scrollThreshold="100px"
      >
        <ul>
          {hotels?.map((hotel, i) => (
            <Fragment key={hotel.id}>
              <HotelItem
                hotel={hotel}
                isLike={Boolean(likes?.find((like) => like.hotelId === hotel.id))}
                onLike={like}
              />
              {hotels.length - 1 == i ? null : (
                <Spacing size={8} backgroundColor="gray100" style={{ margin: '20px 0' }} />
              )}
            </Fragment>
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
};

export default HotelList;
