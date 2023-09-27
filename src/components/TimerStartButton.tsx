import { useEffect, useState } from 'react';
import { utils } from '../utils/utils';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";

interface PageProps {
    isLoggedIn: boolean;
    userData?: any;
}

function TimerStartButton({ userData, isLoggedIn }: PageProps): JSX.Element | null {
  const router = useRouter();
  const { createSecuredAxiosInstance } = utils();

  const startGuide = () => {
    // ガイドを開始するためのAPIを呼び出し、ステータスをstartedに変更
    const securedAxios = createSecuredAxiosInstance();
    securedAxios.post('/api/startGuide')
      .then(() => {
        // ステータスが変更されたら、ページをリロードまたは適切な表示の更新
        router.reload();
      })
      .catch(error => console.error(error));
  };

  if (!userData) return null;

  if (userData.lastBookingStatus === 'Accepted') {
    if (userData.type === 'guide') {
      return (
        <div>
            <p>Guest opens the timer and presses the button to start.</p>
            <Button onClick={() => router.reload()}>Reload</Button>
        </div>
      );
    } else if (userData.type === 'guest') {
      return (
        <div>
            <Button onClick={startGuide}>Start Guide</Button>
        </div>
      );
    }
  }

  if (userData.lastBookingStatus === 'Started') {
    return <p>While guiding</p>;
  }

  return null;
}

export default TimerStartButton;
