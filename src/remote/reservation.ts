import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { store } from './firebase';
import { getHotel } from './hotel';
import { Reservation } from '@/model/reservation';
import { COLLECTIONS } from '@/constants';
import { Room } from '@/model/room';

export async function makeReservation(newReservation: Reservation) {
  const hotelSnapshot = doc(store, COLLECTIONS.HOTEL, newReservation.hotelId);
  const roomSnapshot = await getDoc(doc(hotelSnapshot, COLLECTIONS.ROOM, newReservation.roomId));

  const room = roomSnapshot.data() as Room;
  const 지금잔여객실수 = room.avaliableCount;

  if (지금잔여객실수 === 0) {
    throw new Error('no room');
  }

  await updateDoc(roomSnapshot.ref, {
    avaliableCount: 지금잔여객실수 - 1,
  });

  await setDoc(doc(collection(store, COLLECTIONS.RESERVATION)), newReservation);
}

export async function getReservations({ userId }: { userId: string }) {
  const reservationQuery = query(
    collection(store, COLLECTIONS.RESERVATION),
    where('userId', '==', userId)
  );

  const reservationSnapshot = await getDocs(reservationQuery);

  const result = [];

  for (const reservationDoc of reservationSnapshot.docs) {
    const reservation = {
      id: reservationDoc.id,
      ...(reservationDoc.data() as Reservation),
    };

    const hotel = await getHotel(reservation.hotelId);

    result.push({
      reservation,
      hotel,
    });
  }

  return result;
}
