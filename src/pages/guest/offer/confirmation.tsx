import React, { useEffect, useState } from 'react';
import styles from '../../../styles/offerInformation.module.scss';
import OfferInformation from '../../../components/OfferInformation';
import { utils } from '../../../utils/utils';

const OfferConfirmation: React.FC = () => {
// <-- ---------- useState ---------- -->
  const [bookingData, setBookingData] = useState<any>(null);
// <-- ---------- 定数の定義 ---------- -->
  const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
  const { startDate, startTime, endDate, endTime, total_guest, comment, hourly_rate, guide_id } = router.query;

// <-- ---------- 関数の定義 ---------- -->

const handleConfirmation = async () => {
  try {
    const axiosInstance = createSecuredAxiosInstance();
    const response = await axiosInstance.post('/api/booking', bookingData); // エンドポイントは仮です
    console.log(response.data);
    // 予約が成功したら、適切なページにリダイレクトするなどの処理を行う
  } catch (error) {
    console.error("Booking Error:", error);
    // エラーハンドリングの処理を行う
  }
};

// <-- ---------- useEffect ---------- -->

  useEffect(() => {
    if (router.isReady) {
      setBookingData(router.query);
    }
  }, [router.isReady, router.query]);

 // <-- ---------- 表示 ---------- -->

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Confirmation</h1>
      <OfferInformation BookingData={bookingData} />
      <button className={styles.confirmButton} onClick={handleConfirmation}>
        Offer
      </button>
    </div>
  );
};

export default OfferConfirmation;