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

function Timer({ isLoggedIn, userData }: PageProps): JSX.Element | null {
  const [time, setTime] = useState<string | null>(null);
  const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
  const router = useRouter();

  useEffect(() => {
    if (!userData) return;

    if (userData.booking_status === BookingStatus.Accepted) {
      const securedAxios = createSecuredAxiosInstance();
      securedAxios.get('/api/timer')
        .then(response => {
          const { start_time, end_time } = response.data;
          // actual_start_timeも必要そう
          const presetTime = (end_time.getTime() - start_time.getTime()) / (1000 * 60);
          setTime(formatDateToCustom(String(presetTime)));
          return;
        })
        .catch(error => console.error(error));
    }
    if (userData.booking_status === BookingStatus.Started) {
      const securedAxios = createSecuredAxiosInstance();
      securedAxios.get('/api/timer')
        .then(response => {
          const { accurate_start_time, current_time, end_time } = response.data;

          // accurate_start_timeを基準にpresetTimeとtargetTimeを計算
          const presetTime = (end_time.getTime() - accurate_start_time.getTime()) / (1000 * 60);
          const targetTime = accurate_start_time.getTime() + presetTime * 60 * 1000;

          const intervalId = setInterval(() => {
            const currentTime = new Date(current_time).getTime();
            const remainingTime = targetTime - currentTime;
            if (remainingTime <= 0) {
              clearInterval(intervalId);
              setTime('00:00');

              // 5秒後からbook_statusを取得するAPIを15秒ごとに呼び出し
              setTimeout(() => {
                const checkStatusIntervalId = setInterval(() => {
                  securedAxios.get('/api/checkLastBookingStatus')
                    .then(statusResponse => {
                      if (statusResponse.data.book_status === 'Ended') {
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
              const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
              setTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            }
          }, 1000);

          return () => clearInterval(intervalId);
        })
        .catch(error => console.error(error));
    }
  }, [userData]);

  return (
    <div>
      <h2>{time}</h2>
    </div>
  );
}

export default Timer;