import { useEffect, useState } from 'react';
import Timer from '../../components/Timer';
import TimerStartButton from '../../components/TimerStartButton';
import styles from '../../styles/timer.module.scss';
import { utils } from '../../utils/utils';

enum BookingStatus {
  OfferPending,
  Accepted,
  Started,
  Finished,
  Reviewed,
  Cancelled,
}

// <-- ---------- interface ---------- -->

interface userData {
  id: number;
  user_type: string;
  lastBookingStatus: BookingStatus | null;
  status: string;
}

interface PageProps {
  isLoggedIn: boolean;
  userData?: userData;
}


function TimerPage({ isLoggedIn, userData }: PageProps): JSX.Element {
  const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ユーザーデータが存在する場合のみ処理を行う
    if (userData) {
      if (userData.lastBookingStatus !== BookingStatus.Accepted && userData.lastBookingStatus === BookingStatus.Finished) {
        router.push('/guest/review');
      } else if (userData.lastBookingStatus !== BookingStatus.Accepted && userData.lastBookingStatus !== BookingStatus.Started) {
        router.push('/');
      }
      setIsLoading(false); // リダイレクト判定後にローディングステートをfalseに設定
    }
  }, [userData]);
  // ローディング中はローディング画面を表示
  if (isLoading) {
    return <div>Loading...</div>; // ここで適切なローディングコンポーネントを返す
  }

  const lastBookingStatusClass = userData && userData.lastBookingStatus !== null
    ? BookingStatus[userData.lastBookingStatus] || 'default'
    : 'default';

  return (
    <main className={styles[lastBookingStatusClass]}>
        <div className={styles.container}>
            <div className={styles.logo}></div>
            <Timer isLoggedIn={isLoggedIn} userData={userData} />
            <TimerStartButton isLoggedIn={isLoggedIn} userData={userData} />
            <p>We will deliver<br/>the best day<br/>in Japan for you.</p>
        </div>
    </main>
  );
}

export default TimerPage;