import Form from '@/components/reservation/Form';
import Summary from '@/components/reservation/Summary';
import Spacing from '@/components/shared/Spacing';
import { useAlertContext } from '@/contexts/AlertContext';
import { useAppSelector } from '@/hooks/useUser';
import { Reservation } from '@/model/reservation';
import { getHotelWithRoom } from '@/remote/hotel';
import { makeReservation } from '@/remote/reservation';
import { RootState } from '@/store';
import addDelimiter from '@/utils/addDel';
import { parse } from 'qs';
import { useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

const ReservationPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.userSlice);
  const { open } = useAlertContext();

  const { startDate, endDate, nights, roomId, hotelId } = parse(window.location.search, {
    ignoreQueryPrefix: true,
  }) as {
    startDate: string;
    endDate: string;
    nights: string;
    roomId: string;
    hotelId: string;
  };

  useEffect(() => {
    if (
      [user, startDate, endDate, nights, roomId, hotelId].some((param) => {
        return param == null;
      })
    ) {
      window.history.back();
    }
  }, [startDate, endDate, nights, roomId, hotelId, user]);

  const { data, isLoading } = useQuery(['hotel'], () => getHotelWithRoom({ hotelId, roomId }), {
    onSuccess: ({ room }) => {
      if (room.avaliableCount === 0) {
        open({
          title: '객실이 매진 되었습니다',
          onButtonClick: () => {
            window.history.back();
          },
        });
      }
    },
  });

  const { mutateAsync } = useMutation(
    (newReservation: Reservation) => makeReservation(newReservation),
    {
      onError: () => {
        open({
          title: '알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요',
          onButtonClick: () => {
            window.history.back();
          },
        });
      },
    }
  );

  if (isLoading || data == undefined) {
    return null;
  }
  const { hotel, room } = data;

  const handleSubmit = async (formValues: { [key: string]: string }) => {
    const newReservation = {
      userId: user?.uid as string,
      hotelId,
      roomId,
      startDate,
      endDate,
      price: room.price * Number(nights),
      formValues,
    };
    await mutateAsync(newReservation);
    navigate(`/reservation/done?hotelName=${hotel.name}`);
  };

  const buttonLabel = `${nights}박 ${addDelimiter(room.price * Number(nights))}원 예약하기`;

  return (
    <div>
      <Summary
        hotelName={hotel.name}
        room={room}
        startDate={startDate}
        endDate={endDate}
        nights={nights}
      />
      <Spacing size={8} backgroundColor="gray100" />
      <Form onSubmit={handleSubmit} forms={hotel.forms} buttonLabel={buttonLabel} />
    </div>
  );
};

export default ReservationPage;
