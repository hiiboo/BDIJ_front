import React, { useEffect, useState } from 'react';
import styles from '../../../styles/offerInformation.module.scss';
import OfferInformation from '../../../components/OfferInformation';
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
  PageProps,
} from '../../../types/types';

interface BookingPreData {
  guide_id?: number;
  start_time?: string;
  end_time?: string;
  total_guests?: number;
  comment?: string;
  total_amount?: number;
}

function OfferConfirmation({ isLoggedIn }: PageProps): JSX.Element | null {
// <-- ---------- useState ---------- -->
  const [bookingPreData, setBookingPreData] = useState<BookingPreData | null>(null);
  const [guideData, setGuideData] = useState<GuideData | null>(null);

// <-- ---------- 定数の定義 ---------- -->
  const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
  const { start_time, end_time, total_guests, comment, guide_id } = router.query;

// <-- ---------- 関数の定義 ---------- -->

  const fetchGuideData = async (guideId: number) => {
    try {
      const axiosInstance = createSecuredAxiosInstance();
      const response = await axiosInstance.get(`/api/guide/${guideId}`);
      setGuideData(response.data.data);
      return response.data.data; // データを返す
    } catch (error) {
      console.error("Error fetching guide data:", error);
      return null;
    }
  };

  const handleConfirmation = async () => {
    // guideId を直接参照
    const guideId = Number(router.query.guide_id);
    console.log(bookingPreData);

    try {
      const axiosInstance = createSecuredAxiosInstance();
      console.log(bookingPreData);
      const response = await axiosInstance.post(`/api/bookings/${guideId}/reserve`, bookingPreData);
      console.log(response);
      router.push('/guest/offer/box');
    } catch (error) {
      console.error("Booking Error:", error);
    }
  };

// <-- ---------- useEffect ---------- -->

useEffect(() => {
      if (router.isReady) {
        console.log("Query parameters:", router.query); // クエリパラメータの値を出力
        const startTime = new Date(String(start_time));
        const endTime = new Date(String(end_time));
        const totalGuest = Number(total_guests);
        const guideId = Number(guide_id);

        console.log("Parsed values:", {
          startTime,
          endTime,
          totalGuest,
          guideId,
        });

        if (isNaN(guideId)) {
          console.error("Invalid guide_id");
          return;
        }

        if (guideId) {
          fetchGuideData(guideId).then((fetchedGuideData) => {
            if (fetchedGuideData) {
              const hourlyRate = fetchedGuideData.hourly_rate || 0;
              const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
              const baseAmount = hourlyRate * hours;
              const totalAmount = totalGuest > 1 ? baseAmount * totalGuest * 0.75 : baseAmount;

              setBookingPreData({
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                total_guests: totalGuest,
                comment: String(comment),
                guide_id: guideId,
                total_amount: totalAmount,
              });
            }
          });
        }
    }
  }, [router.isReady, start_time, end_time, total_guests, comment, guide_id]);
 // <-- ---------- 表示 ---------- -->

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Confirmation</h1>
      <OfferInformation isLoggedIn={isLoggedIn} bookingPreData={bookingPreData} />
      <button className={styles.confirmButton} onClick={handleConfirmation}>
        Offer
      </button>
    </div>
  );
};

export default OfferConfirmation;