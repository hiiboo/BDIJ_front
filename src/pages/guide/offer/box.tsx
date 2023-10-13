import React, { useEffect, useState } from 'react';
import OfferBox from '../../../components/OfferBox';
import { utils } from '../../../utils/utils';
import { useRouter } from 'next/router';
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

function GuideOfferBox({ userData }: PageProps): JSX.Element | null {

  // <-- ---------- useState ---------- -->
  const [offers, setOffers] = useState<BookingData[]>([]);

// <-- ---------- 定数の定義 ---------- -->
  const router = useRouter();
  const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

// <-- ---------- useEffect ---------- -->
  useEffect(() => {

      const fetchBookings = async () => {
          try {
              const securedAxios = createSecuredAxiosInstance();
              const response = await securedAxios.get(`/api/user/current/bookings/guide`);
              setOffers(response.data.data);
              console.log(response.data.data);
          } catch (error) {
              console.error('Failed to fetch guide offers data', error);
          }
      }
      fetchBookings();
    }, []);
 // <-- ---------- 表示 ---------- -->

  return (
    <main>
      <OfferBox userData={userData} offers={offers} />
    </main>
  );
};

export default GuideOfferBox;