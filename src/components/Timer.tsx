import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { utils } from '../utils/utils';

interface PageProps {
  isLoggedIn: boolean;
  userData?: any;
}

function Timer({ isLoggedIn, userData }: PageProps): JSX.Element | null {
    const [time, setTime] = useState<string | null>(null);
  const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
  const router = useRouter();

  useEffect(() => {
    if (!userData) return;

    if (userData.lastBookingStatus === 'Accepted') {
      const { start_date, start_time, end_date, end_time } = userData;
      const startDate = new Date(`${start_date}T${start_time}`);
      const endDate = new Date(`${end_date}T${end_time}`);
      const presetTime = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
      setTime(formatDateToCustom(String(presetTime)));
      return;
    }

    if (userData.lastBookingStatus === 'Started') {
      const securedAxios = createSecuredAxiosInstance();
      securedAxios.get('/api/timer')
        .then(response => {
          const { current_time, start_date, start_time, end_date, end_time } = response.data;
          const startDate = new Date(`${start_date}T${start_time}`);
          const endDate = new Date(`${end_date}T${end_time}`);
          const presetTime = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
          const targetTime = startDate.getTime() + presetTime * 60 * 1000;

          const intervalId = setInterval(() => {
            const currentTime = new Date(current_time).getTime();
            const remainingTime = targetTime - currentTime;
            if (remainingTime <= 0) {
              clearInterval(intervalId);
              setTime('00:00');

              // 5秒後からlastBookingStatusを取得するAPIを15秒ごとに呼び出し
              setTimeout(() => {
                const checkStatusIntervalId = setInterval(() => {
                  securedAxios.get('/api/checkLastBookingStatus')
                    .then(statusResponse => {
                      if (statusResponse.data.lastBookingStatus === 'Ended') {
                        clearInterval(checkStatusIntervalId);
                        if (userData.type === 'guide') {
                          router.push('/guide/review');
                        } else if (userData.type === 'guest') {
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
      <h1>タイマー</h1>
      <p>{time}</p>
    </div>
  );
}

export default Timer;