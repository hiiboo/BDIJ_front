import React, { useEffect, useState } from 'react';
import styles from '../styles/offerInformation.module.scss';
import { utils } from '../utils/utils';

interface BookingData {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  total_guest: number;
  comment: string;
  hourly_rate: number;
}

interface OfferInformationProps {
  BookingData: BookingData | null;
}

const OfferInformation: React.FC<OfferInformationProps> = ({ BookingData }) => {
// <-- ---------- 定数の定義 ---------- -->
  const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
  // BookingDataが存在する場合はそれを使用し、存在しない場合はrouter.queryからデータを取得
  const startDate = BookingData ? BookingData.startDate : String(router.query.startDate);
  const startTime = BookingData ? BookingData.startTime : String(router.query.startTime);
  const endDate = BookingData ? BookingData.endDate : String(router.query.endDate);
  const endTime = BookingData ? BookingData.endTime : String(router.query.endTime);
  const total_guest = BookingData ? BookingData.total_guest : Number(router.query.total_guest);
  const comment = BookingData ? BookingData.comment : String(router.query.comment);
  const hourly_rate = BookingData ? BookingData.hourly_rate : Number(router.query.hourly_rate);

const calculateTotalAmount = () => {
    // startDate と startTime を組み合わせて、開始時刻の Date オブジェクトを作成
    const startDateTimeStr = `${startDate}T${startTime}`;
    const start = new Date(startDateTimeStr);

    // endDate と endTime を組み合わせて、終了時刻の Date オブジェクトを作成
    const endDateTimeStr = `${endDate}T${endTime}`;
    const end = new Date(endDateTimeStr);

    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const baseAmount = hourly_rate * hours;

    if (total_guest > 1) {
        return baseAmount * total_guest * 0.75;
    } else {
        return baseAmount;
    }
};


 // <-- ---------- 表示 ---------- -->

  return (
    <div className={styles.bookingInfo}>
      <p><strong>Start Date:</strong> {startDate}</p>
      <p><strong>Start Time:</strong> {startTime}</p>
      <p><strong>End Date:</strong> {endDate}</p>
      <p><strong>End Time:</strong> {endTime}</p>
      <p><strong>Guest:</strong> {total_guest}</p>
      <p><strong>Comment:</strong> {comment}</p>
      <div className="">
            <div className="flex flex-col items-center justify-content-between">
                <div>
                    <h3>Total amount</h3>
                    <p><small>Inclusive of tax</small></p>
                </div>
                <p className='bold'>¥{calculateTotalAmount().toLocaleString()}</p>
            </div>
            <p><small>Include yourself in the total count, excluding children aged 12 and below.</small></p>
        </div>
    </div>
  );
};

export default OfferInformation;
