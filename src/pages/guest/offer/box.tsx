import React, { useEffect, useState } from 'react';
import OfferBox from '../../../components/OfferBox';
import { utils } from '../../../utils/utils';

// <-- ---------- enum ---------- -->

enum BookingStatus {
  OfferPending,
  Accepted,
  Started,
  Finished,
  Reviewed,
  Cancelled,
}

// <-- ---------- interface ---------- -->

interface PageProps {
  isLoggedIn: boolean;
  userData?: any;
}

interface BookingData {
  id: number;
  guide_id: number;
  guide_firstName?: string;
  guide_lastName?: string;
  guide_image?: string;
  guest_id: number;
  guest_firstName?: string;
  guest_lastName?: string;
  guest_image?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  hourly_rate: number;
  comment: string;
  created_at: Date;
  booking_status: BookingStatus;
}

function GuestOfferBox({ isLoggedIn, userData }: PageProps): JSX.Element | null {

  // <-- ---------- useState ---------- -->
  const [offers, setOffers] = useState<BookingData[]>([]);

// <-- ---------- 定数の定義 ---------- -->
  const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
  const testUserData = {
    user_type: "guest",
    // 他の必要なプロパティもここに追加できます
  };

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
      <OfferBox isLoggedIn={isLoggedIn} userData={testUserData} offers={offers} />
    </main>
  );
};

export default GuestOfferBox;