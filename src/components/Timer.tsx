import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { utils } from '../utils/utils';

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
} from '../types/types';

function Timer({ isLoggedIn, userData, bookingData }: PageProps): JSX.Element | null {
  const [time, setTime] = useState<string | null>(null);
  const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
  const router = useRouter();
  const booking_id = bookingData?.id

  useEffect(() => {
    if (!userData) return;
    if(!bookingData) return;

    if (userData.booking_status === BookingStatus.Accepted) {
      const securedAxios = createSecuredAxiosInstance();
      securedAxios.get(`/api/bookings/${booking_id}/actual-start-time`)
      .then(response => {
        const { start_time, end_time } = response.data.data;
        const startTimeDate = new Date(start_time);
        const endTimeDate = new Date(end_time);
        const presetTime = (endTimeDate.getTime() - startTimeDate.getTime()) / (1000 * 60);
        const minutes = Math.floor(presetTime);
        const seconds = Math.floor((presetTime % 1) * 60);
        setTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        console.log('presetTime', presetTime);
        return;
      })
      .catch(error => console.error(error));
    }
    if (userData.booking_status === BookingStatus.Started) {
      console.log('booking_id', booking_id);
      const securedAxios = createSecuredAxiosInstance();
      securedAxios.get(`/api/bookings/${booking_id}/actual-start-time`)
        .then(response => {
            const { actual_start_time, now, start_time, end_time } = response.data.data;

            // actual_start_time, start_time, end_timeをDateオブジェクトに変換
            const actualStartTimeDate = new Date(actual_start_time);
            const startTimeDate = new Date(start_time);
            const endTimeDate = new Date(end_time);

            // end_timeとstart_timeの差の時間を計算し、それをactual_start_timeに加算してactualEndTimeを取得
            const presetTime = endTimeDate.getTime() - startTimeDate.getTime();
            const actualEndTime = actualStartTimeDate.getTime() + presetTime;

            const currentTimeDate = new Date(now);

            // タイマーのセットアップ
            const intervalId = setInterval(() => {
                const elapsed = new Date().getTime() - currentTimeDate.getTime();

                const currentTime = currentTimeDate.getTime() + elapsed;
                const remainingTime = actualEndTime - currentTime;

                if (remainingTime <= 0) {
                    clearInterval(intervalId);
                    setTime('00:00');

                    // 5秒後からbooking_statusを取得するAPIを15秒ごとに呼び出し
                    setTimeout(() => {
                        const checkStatusIntervalId = setInterval(() => {
                            securedAxios.get('/api/user/current/last-booking-status')
                                .then(statusResponse => {
                                    if (statusResponse.data.data.book_status === BookingStatus.Finished) {
                                        clearInterval(checkStatusIntervalId);
                                        if (userData.user_type === 'guide') {
                                            router.push('/guide/review');
                                        } else if (userData.user_type === 'guest') {
                                            router.push('/guest/review');
                                        }
                                    }
                                })
                                .catch(error => console.error(error));
                        }, 15000);
                    }, 5000);
                } else {
                    const totalMinutes = Math.floor(remainingTime / (1000 * 60));
                    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                    setTime(`${String(totalMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
                }
            }, 1000);

                return () => clearInterval(intervalId);
      })
      .catch(error => console.error(error));
    }
  }, [userData, booking_id]);

  return (
    <div>
      <h2>{time}</h2>
    </div>
  );
}

export default Timer;