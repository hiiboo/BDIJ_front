import { useEffect, useState } from 'react';
import { utils } from '../utils/utils';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";

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

  if (userData.booking_status === BookingStatus.Accepted) {
    if (userData.user_type === 'guide') {
      return (
        <div>
            <p>Guest opens the timer and presses the button to start.</p>
            <Button onClick={() => router.reload()}>Reload</Button>
        </div>
      );
    } else if (userData.user_type === 'guest') {
      return (
        <div>
            <Button onClick={startGuide}>Start Guide</Button>
        </div>
      );
    }
  }

  if (userData.booking_status === BookingStatus.Started) {
    return <p>While guiding</p>;
  }

  return null;
}

export default TimerStartButton;
