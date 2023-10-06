import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/offerInformation.module.scss';
import { utils } from '../utils/utils';
import { extractDateAndTime } from '../utils/utils';

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
} from '../types/types';

interface BookingPreData {
  guide_id?: number;
  start_time?: string;
  end_time?: string;
  total_guests?: number;
  comment?: string;
  total_amount?: number;
}

interface PagePropsWithBookingPreData {
  userData?: UserData | null;
  guideData?: GuideData | null;
  guestData?: GuestData | null;
  bookingData?: BookingData | null;
  bookingPreData?: BookingPreData | null;
  offers?: BookingData[];
  handleLogout?: () => void;
}

  const OfferInformation: React.FC<PagePropsWithBookingPreData> = ({ bookingData, bookingPreData }) => {
// <-- ---------- 定数の定義 ---------- -->
  const router = useRouter();
  const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

  let start_time: Date = new Date();
  let end_time: Date = new Date();
  if (bookingData) {
      if (bookingData.start_time && bookingData.end_time) {
          start_time = new Date(bookingData.start_time);
          end_time = new Date(bookingData.end_time);
      } else {
          console.error('start_time or end_time is undefined in bookingData');
      }
  } else if(bookingPreData)  {
      if (bookingPreData.start_time && bookingPreData.end_time) {
          start_time = new Date(bookingPreData.start_time);
          end_time = new Date(bookingPreData.end_time);
      } else {
          console.error('start_time or end_time is undefined in bookingData');
      }
  } else {
      console.error('bookingData or bookingPreData is undefined');
  }
  if (!isValidDate(start_time)) {
    alert('start_time is invalid');
  }

  if (!isValidDate(end_time)) {
    alert('end_time is invalid');
  }
  function isValidDate(d: any): d is Date {
    return d instanceof Date && !isNaN(d.getTime());
  }
  const startDate = extractDateAndTime(start_time, end_time).startDate;
  const startTime = extractDateAndTime(start_time, end_time).startTime;
  const endDate = extractDateAndTime(start_time, end_time).endDate;
  const endTime = extractDateAndTime(start_time, end_time).endTime;
  // const startDate = bookingData ? bookingData.startDate : String(router.query.startDate);
  // const startTime = bookingData ? bookingData.startTime : String(router.query.startTime);
  // const endDate = bookingData ? bookingData.endDate : String(router.query.endDate);
  // const endTime = bookingData ? bookingData.endTime : String(router.query.endTime);
  const total_guests = bookingData ? bookingData.total_guests : bookingPreData?.total_guests;
  const comment = bookingData ? bookingData.comment : bookingPreData?.comment;
  const total_amount = bookingData ? bookingData.total_amount : bookingPreData?.total_amount;

  // const hourly_rate = bookingData ? bookingData.hourly_rate : Number(router.query.hourly_rate);

// const calculateTotalAmount = () => {
//     // startDate と startTime を組み合わせて、開始時刻の Date オブジェクトを作成
//     const startDateTimeStr = `${startDate}T${startTime}`;
//     const start = new Date(startDateTimeStr);

//     // endDate と endTime を組み合わせて、終了時刻の Date オブジェクトを作成
//     const endDateTimeStr = `${endDate}T${endTime}`;
//     const end = new Date(endDateTimeStr);

//     const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
//     const baseAmount = hourly_rate * hours;

//     if (total_guests > 1) {
//         return baseAmount * total_guests * 0.75;
//     } else {
//         return baseAmount;
//     }
// };

 // <-- ---------- 表示 ---------- -->

  return (
    <div className={styles.bookingInfo}>
      <p><strong>Start Date:</strong> {startDate}</p>
      <p><strong>Start Time:</strong> {startTime}</p>
      <p><strong>End Date:</strong> {endDate}</p>
      <p><strong>End Time:</strong> {endTime}</p>
      <p><strong>Guest:</strong> {total_guests}</p>
      <p><strong>Comment:</strong> {comment}</p>
      <div className="">
            <div className="flex flex-col items-center justify-content-between">
                <div>
                    <h3>Total amount</h3>
                    <p><small>Inclusive of tax</small></p>
                </div>
                <p className='bold'>¥{total_amount}</p>
            </div>
            <p><small>Include yourself in the total count, excluding children aged 12 and below.</small></p>
        </div>
    </div>
  );
};

export default OfferInformation;
