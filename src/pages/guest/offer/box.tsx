import React, { useEffect, useState } from 'react';
import OfferBox from '../../../components/OfferBox';
import { utils } from '../../../utils/utils';
import {
  BookingStatus,
  LanguageLevel,
  UserType,
  UserStatus,
  UserData,
  GuestData,
  GuideData,
  BookingData,
  PageProps
} from '../../../types/types';

function GuestOfferBox({ isLoggedIn, userData }: PageProps): JSX.Element | null {

  // <-- ---------- useState ---------- -->
  const [offers, setOffers] = useState<BookingData[]>([]);

// <-- ---------- 定数の定義 ---------- -->
  const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

// <-- ---------- useEffect ---------- -->
  useEffect(() => {

      const fetchBookings = async () => {
          try {
              const securedAxios = createSecuredAxiosInstance();
              const response = await securedAxios.get(`/api/guest/bookings`);
              setOffers(response.data);
          } catch (error) {
              console.error('Failed to fetch guest offers data', error);
          }
      }
      fetchBookings();
  }, []);

 // <-- ---------- 表示 ---------- -->

  return (
    <main>
      <OfferBox isLoggedIn={isLoggedIn} userData={userData} offers={offers} />
    </main>
  );
};

export default GuestOfferBox;