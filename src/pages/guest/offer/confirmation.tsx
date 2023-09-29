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
  start_time?: Date;
  end_time?: Date;
  total_guest?: number;
  comment?: string;
  total_amount?: number;
}

function OfferConfirmation({ isLoggedIn }: PageProps): JSX.Element | null {
// <-- ---------- useState ---------- -->
  const [bookingPreData, setBookingPreData] = useState<BookingPreData | null>(null);
  const [guideData, setGuideData] = useState<GuideData | null>(null);

// <-- ---------- 定数の定義 ---------- -->
  const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
  const { start_time, end_time, total_guest, comment, guide_id } = router.query;

// <-- ---------- 関数の定義 ---------- -->

  const fetchGuideData = async (guideId: number) => {
    try {
      const axiosInstance = createSecuredAxiosInstance();
      const response = await axiosInstance.get(`/api/guide/${guideId}`);
      setGuideData(response.data);
    } catch (error) {
      console.error("Error fetching guide data:", error);
    }
  };

  const handleConfirmation = async () => {
    try {
      const axiosInstance = createSecuredAxiosInstance();
      const response = await axiosInstance.post('/api/booking', bookingPreData); // エンドポイントは仮です
      // bookingDataを送る、その中にはguide_idが入っている。
      // そのguide_idのhourly_rateと、booking_statusが、先ほど取得したものと違う場合は「Retry Again!」とエラーを吐いて欲しい（TOPに戻す）
      console.log(response.data);
      router.push('/guest/offer/box');
      // 予約が成功したら、適切なページにリダイレクトするなどの処理を行う
    } catch (error) {
      console.error("Booking Error:", error);
      // エラーハンドリングの処理を行う
    }
  };

// <-- ---------- useEffect ---------- -->

  useEffect(() => {
    if (router.isReady) {
      const startTime = new Date(String(start_time));
      const endTime = new Date(String(end_time));
      const totalGuest = Number(total_guest);
      const guideId = Number(guide_id);
      if (isNaN(guideId)) {
        console.error("Invalid guide_id");
        return;
      }

      if (guideId) {
        fetchGuideData(guideId);
      }

      if (guideData) {
        const hourlyRate = guideData.hourly_rate || 0;
        const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        const baseAmount = hourlyRate * hours;
        const totalAmount = totalGuest > 1 ? baseAmount * totalGuest * 0.75 : baseAmount;

        setBookingPreData({
          start_time: startTime,
          end_time: endTime,
          total_guest: totalGuest,
          comment: String(comment),
          guide_id: guideId,
          total_amount: totalAmount,
        });
      }
    }
  }, [router.isReady, start_time, end_time, total_guest, comment, guide_id, guideData]);
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