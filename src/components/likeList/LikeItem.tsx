/** @jsxImportSource @emotion/react */
import ListRow from '../shared/ListRow';
import Flex from '../shared/Flex';
import Text from '../shared/Text';
import Spacing from '../shared/Spacing';
import { css } from '@emotion/react';
import addDelimiter from '@/utils/addDel';

import { Link } from 'react-router-dom';
import { Like } from '@/model/like';
import { useQuery } from 'react-query';
import { getHotel } from '@/remote/hotel';

const LikeItem = ({ hotel }: { hotel: Like }) => {
  const { data: hotelData } = useQuery(['hotel', hotel?.hotelId], () => getHotel(hotel?.hotelId));

  if (hotelData)
    return (
      <div>
        <Link to={`/hotel/${hotelData.id}`}>
          <ListRow
            contents={
              <Flex direction="column">
                <ListRow.Texts title={hotelData.name}></ListRow.Texts>
                <Spacing size={4} />
                <Text typography="t7">{hotelData.starRating}성급</Text>
              </Flex>
            }
            right={
              <Flex direction="column" align="flex-end" style={{ position: 'relative' }}>
                <img src={hotelData.mainImageUrl} alt="" css={imageStyles} />
                <Spacing size={8} />
                <Text bold={true}>{addDelimiter(hotelData.price)}원</Text>
              </Flex>
            }
            style={containerStyles}
            as="li"
          />
        </Link>
      </div>
    );
};

const containerStyles = css`
  align-items: flex-start;
`;

const imageStyles = css`
  width: 90px;
  height: 110px;
  border-radius: 8px;
  object-fit: cover;
  margin-left: 16px;
`;

export default LikeItem;
