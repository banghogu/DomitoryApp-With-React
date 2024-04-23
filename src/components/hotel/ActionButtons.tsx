import { CopyToClipboard } from 'react-copy-to-clipboard';

import { css } from '@emotion/react';
import Flex from '../shared/Flex';
import Spacing from '../shared/Spacing';
import Text from '../shared/Text';
import useShare from '@/hook/useShare';
import { Hotel } from '@/model/hotel';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useAppSelector } from '@/hooks/useUser';
import { getLikes, toggleLike } from '@/remote/like';
import { useAlertContext } from '@/contexts/AlertContext';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';

function ActionButtons({ hotel }: { hotel: Hotel }) {
  const client = useQueryClient();
  const navigate = useNavigate();
  const { open } = useAlertContext();
  const { user } = useAppSelector((state: RootState) => state.userSlice);
  const share = useShare();

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

  const { name, comment, mainImageUrl, id } = hotel;

  const isLike = Boolean(likes?.find((like) => like.hotelId === hotel.id));

  return (
    <Flex css={containerStyles}>
      <Button
        label="찜하기"
        onClick={() => {
          like({
            hotel: {
              name,
              mainImageUrl,
              id,
            },
          });
        }}
        iconUrl={
          isLike
            ? 'https://cdn4.iconfinder.com/data/icons/twitter-29/512/166_Heart_Love_Like_Twitter-64.png'
            : 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-heart-outline-64.png'
        }
      />
      <Button
        label="공유하기"
        onClick={() => {
          share({
            title: name,
            description: comment,
            imageUrl: mainImageUrl,
            buttonLabel: 'BangTrip에서 보기',
          });
        }}
        iconUrl="https://cdn1.iconfinder.com/data/icons/rounded-social-media/512/kakao-64.png"
      />
      <CopyToClipboard
        text={window.location.href}
        onCopy={() => {
          alert('링크가 복사되었습니다.');
        }}
      >
        <Button
          label="링크복사"
          iconUrl="https://cdn4.iconfinder.com/data/icons/basic-user-interface-elements/700/paste-clipboard-copy-512.png"
        />
      </CopyToClipboard>
    </Flex>
  );
}

function Button({
  label,
  iconUrl,
  onClick,
}: {
  label: string;
  iconUrl: string;
  onClick?: () => void;
}) {
  return (
    <Flex direction="column" align="center" onClick={onClick}>
      <img src={iconUrl} alt="" width={30} height={30} />
      <Spacing size={6} />
      <Text typography="t7">{label}</Text>
    </Flex>
  );
}

const containerStyles = css`
  padding: 24px;
  cursor: pointer;

  & * {
    flex: 1;
  }
`;

export default ActionButtons;
