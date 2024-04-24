import ListRow from '@/components/shared/ListRow';
import { useAppSelector } from '@/hooks/useUser';
import { getReservations } from '@/remote/reservation';
import { RootState } from '@/store';
import { useQuery } from 'react-query';

function ReservationList() {
  const { user } = useAppSelector((state: RootState) => state.userSlice);
  const { data, isLoading } = useQuery(['reservation'], () =>
    getReservations({ userId: user?.uid as string })
  );

  if (data == null || isLoading === true) {
    return null;
  }

  return (
    <div>
      {data.map(({ hotel, reservation }) => (
        <ListRow
          key={reservation.id}
          left={
            <img src={hotel.mainImageUrl} alt={`${hotel.name} 이미지`} width={80} height={80} />
          }
          contents={
            <ListRow.Texts
              title={hotel.name}
              subTitle={`${reservation.startDate} ~ ${reservation.endDate}`}
            />
          }
        />
      ))}
    </div>
  );
}

export default ReservationList;
