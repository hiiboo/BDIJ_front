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

function TimerStartButton({ userData, bookingData }: PageProps): JSX.Element | null {
  const router = useRouter();
  const { createSecuredAxiosInstance } = utils();

  const startGuide = async () => {
    try {
      const securedAxios = createSecuredAxiosInstance();
      const booking_id = bookingData?.id
      console.log('booking_id', booking_id);
      securedAxios.patch(`/api/bookings/${booking_id}/start`)
      router.reload();
    } catch (error) {
      console.error(error);
    }
  };

  if (!userData) return null;
  if (!bookingData) return null;

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

    if (userData.booking_status === BookingStatus.Finished) {
    if (userData.user_type === 'guide') {
      return (
        <div>
            <p>Finish the guide. Please review it.</p>
            <Button onClick={() => router.push('/guide/review')}>Review</Button>
        </div>
      );
    } else if (userData.user_type === 'guest') {
      return (
        <div>
            <p>Finish the guide. Please review it.</p>
            <Button onClick={() => router.push('/guest/review')}>Review</Button>
        </div>
      );
    }
  }

  return null;
}

export default TimerStartButton;
