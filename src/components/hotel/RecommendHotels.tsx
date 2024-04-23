/** @jsxImportSource @emotion/react */
import { getRecommendHotels } from '@/remote/hotel';
import { useQuery } from 'react-query';
import Text from '../shared/Text';
import Spacing from '../shared/Spacing';
import ListRow from '../shared/ListRow';
import addDelimiter from '@/utils/addDel';
import Button from '../shared/Button';
import { css } from '@emotion/react';
import { useState } from 'react';
import { colors } from '@/styles/colorPalette';

const RecommendHotels = ({ recommendHotels }: { recommendHotels: string[] }) => {
  const [showMore, setShowMore] = useState(false);
  const { data, isLoading } = useQuery(
    ['recommendHotels', JSON.stringify(recommendHotels)],
    () => getRecommendHotels(recommendHotels),
    {
      enabled: recommendHotels.length > 0,
    }
  );

  if (data == undefined || isLoading) {
    return null;
  }
  const 호텔리스트 = data.length < 3 || showMore ? data : data.slice(0, 3);

  return (
    <div style={{ margin: '24px 0' }}>
      <Text bold={true} typography="t4" style={{ padding: '0 24px' }}>
        추천 호텔
      </Text>
      <Spacing size={16} />
      <ul>
        {호텔리스트.map((hotel) => (
          <ListRow
            key={hotel.id}
            left={<img src={hotel.mainImageUrl} alt="" css={imageStyles} />}
            contents={
              <ListRow.Texts title={hotel.name} subTitle={`${addDelimiter(hotel.price)}원`} />
            }
          />
        ))}
      </ul>
      {data.length > 3 && showMore === false ? (
        <div style={{ padding: '0 24px', marginTop: 16 }}>
          <Button
            full={true}
            weak={true}
            onClick={() => {
              setShowMore(true);
            }}
            css={buttonStyles}
          >
            더보기
          </Button>
        </div>
      ) : null}
    </div>
  );
};
const imageStyles = css`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

const buttonStyles = css`
  border-radius: 6px;
  transition:
    background-color 0.3s,
    border-color 0.3s;
  &:hover {
    background-color: ${colors.blue};
    color: ${colors.white};
  }
`;

export default RecommendHotels;
