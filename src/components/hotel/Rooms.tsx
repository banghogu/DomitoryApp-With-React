/** @jsxImportSource @emotion/react */
import { getRooms } from '@/remote/room';
import styled from '@emotion/styled';
import { useQuery, useQueryClient } from 'react-query';
import Flex from '../shared/Flex';
import Text from '../shared/Text';
import ListRow from '../shared/ListRow';
import Tag from '../shared/Tag';
import Spacing from '../shared/Spacing';
import { css } from '@emotion/react';
import Button from '../shared/Button';
import { useEffect } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { store } from '@/remote/firebase';
import { COLLECTIONS } from '@/constants';
import { Room } from '@/model/room';
import addDelimiter from '@/utils/addDel';
import qs from 'qs';
import { useAppSelector } from '@/hooks/useUser';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';
import { useAlertContext } from '@/contexts/AlertContext';

const Rooms = ({ hotelId }: { hotelId: string }) => {
  const { open } = useAlertContext();
  const client = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.userSlice);
  const { data } = useQuery(['rooms', hotelId], () => getRooms(hotelId), {});

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(doc(store, COLLECTIONS.HOTEL, hotelId), COLLECTIONS.ROOM),
      (snapshot) => {
        const newRooms = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Room),
        }));

        client.setQueryData(['rooms', hotelId], newRooms);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [hotelId, client]);

  return (
    <Container>
      <Header justify="space-between" align="center">
        <Text bold={true} typography="t4">
          객실정보
        </Text>
        <Text typography="t6" color="gray400">
          1박, 세금 포함
        </Text>
      </Header>
      <ul>
        {data?.map((room) => {
          const params = qs.stringify(
            {
              roomId: room.id,
              hotelId: hotelId,
            },
            {
              addQueryPrefix: true,
            }
          );
          const 마감임박인가 = room.avaliableCount === 1;
          const 매진인가 = room.avaliableCount === 0;
          return (
            <ListRow
              key={room.id}
              left={
                <img
                  src={room.imageUrl}
                  alt={`${room.roomName} 의 객실 이미지`}
                  css={imageStyles}
                />
              }
              contents={
                <ListRow.Texts
                  title={
                    <Flex>
                      <Text>{room.roomName}</Text>
                      {마감임박인가 === true ? (
                        <>
                          <Spacing size={6} direction="horizontal" />
                          <Tag backgroundColor="red">마감임박</Tag>
                        </>
                      ) : null}
                    </Flex>
                  }
                  subTitle={`${addDelimiter(room.price)}원 / `.concat(
                    room.refundable ? '환불가능' : '환불불가'
                  )}
                />
              }
              right={
                <Button
                  size="medium"
                  disabled={매진인가}
                  onClick={() => {
                    if (user == null) {
                      open({
                        title: '로그인이 필요한 기능입니다',
                        onButtonClick: () => {
                          navigate('/signin');
                        },
                      });

                      return;
                    }

                    navigate(`/schedule${params}`);
                  }}
                >
                  {매진인가 === true ? '매진' : '선택'}
                </Button>
              }
            />
          );
        })}
      </ul>
    </Container>
  );
};

const Container = styled.div`
  margin: 40px 0;
`;

const Header = styled(Flex)`
  padding: 0 24px;
  margin-bottom: 20px;
`;

const imageStyles = css`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

export default Rooms;
