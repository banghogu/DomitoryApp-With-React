import { getReviews, removeReview, writeReview } from '@/remote/review';
import { ChangeEvent, useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Flex from '../shared/Flex';
import Spacing from '../shared/Spacing';
import Text from '../shared/Text';
import ListRow from '../shared/ListRow';
import Button from '../shared/Button';
import { format } from 'date-fns';
import { useAppSelector } from '@/hooks/useUser';
import { RootState } from '@/store';
import TextField from '../shared/TextField';

const Review = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state: RootState) => state.userSlice);
  const [text, setText] = useState<string>('');
  const { data: reviews, isLoading } = useQuery(['reviewDatas', id], () =>
    getReviews({ hotelId: id })
  );
  const { mutateAsync: add } = useMutation(
    async () => {
      const newReview = {
        createdAt: new Date(),
        hotelId: id,
        userId: user?.uid as string,
        text: text as string,
      };
      await writeReview(newReview);
      return true;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviewDatas', id]);
      },
    }
  );

  const { mutate: remove } = useMutation(
    ({ reviewId, hotelId }: { reviewId: string; hotelId: string }) =>
      removeReview({ reviewId, hotelId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviewDatas', id]);
      },
    }
  );

  const reviewRows = useCallback(() => {
    if (reviews?.length === 0) {
      return (
        <Flex direction="column" align="center" style={{ margin: '40px 0' }}>
          <img
            src="https://cdn4.iconfinder.com/data/icons/business-and-finance-colorful-free-hand-drawn-set/100/message_open-64.png"
            alt=""
          />
          <Spacing size={10} />
          <Text typography="t6">아직 작성된 리뷰가 없습니다. 첫 리뷰를 작성해보세요 !</Text>
        </Flex>
      );
    }

    return (
      <ul>
        {reviews?.map((review) => (
          <ListRow
            key={review.id}
            left={
              review.user.photoURL != null ? (
                <img src={review.user.photoURL} alt="" width={40} height={40} />
              ) : null
            }
            contents={
              <ListRow.Texts
                title={review.text}
                subTitle={format(review.createdAt, 'yyyy-MM-dd')}
              />
            }
            right={
              review.userId === user?.uid ? (
                <Button
                  color="error"
                  onClick={() => {
                    remove({
                      reviewId: review.id,
                      hotelId: review.hotelId,
                    });
                  }}
                >
                  삭제
                </Button>
              ) : null
            }
          />
        ))}
      </ul>
    );
  }, [reviews, user]);

  const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []);

  if (isLoading) {
    return <div>...Loading</div>;
  }

  return (
    <div style={{ margin: '40px 0' }}>
      <Text bold={true} typography="t4" style={{ padding: '0 24px' }}>
        리뷰
      </Text>
      <Spacing size={16} />
      {reviewRows()}
      {user != null ? (
        <div style={{ padding: '0 24px' }}>
          <TextField value={text} onChange={handleTextChange} />
          <Spacing size={6} />
          <Flex justify="flex-end">
            <Button
              disabled={text === ''}
              onClick={async () => {
                const success = await add();

                if (success === true) {
                  setText('');
                }
              }}
            >
              작성
            </Button>
          </Flex>
        </div>
      ) : null}
    </div>
  );
};

export default Review;
