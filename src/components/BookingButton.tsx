import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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
  PageProps
} from '../types/types';

const BookingButton: React.FC<PageProps> = ({ userData ,bookingData }) => {

  const router = useRouter();
  const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
  console.log('bookingData', bookingData);
  if(!userData) {
    alert('userData is null');
    return null;
  }
  const { user_type, booking_status, guest_reviewed, guide_reviewed } = userData;

  const handleAcceptOffer = async () => {
    try {
      const securedAxios = createSecuredAxiosInstance();
      const booking_id = bookingData?.id
      console.log('booking_id', booking_id);
      securedAxios.patch(`/api/bookings/${booking_id}/accept`)
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelOffer = async () => {
    try {
      const securedAxios = createSecuredAxiosInstance();
      const booking_id = bookingData?.id
      console.log('booking_id', booking_id);
      securedAxios.patch(`/api/bookings/${booking_id}/cancel`)
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const renderButton = () => {

    if (user_type === UserType.Guest) {
      switch (booking_status) {
        case BookingStatus.OfferPending:
          return (
              <Button onClick={handleCancelOffer}>
                Cancell Your Offer
              </Button>
          );
        case BookingStatus.Accepted:
          return (
            <div>
              <Link href="/guest/timer">
                  <Button>Prepare Guiding</Button>
              </Link>
              <Button onClick={handleCancelOffer}>
                Cancell Guiding
              </Button>
              <p className='text-xs'>Cancell Fee 20%</p>
            </div>
          );
        case BookingStatus.Started:
          return (
            <>
                <Link href="/guest/timer">
                    <Button>While Guiding</Button>
                </Link>
            </>
          );
        case BookingStatus.Finished:
          if (guest_reviewed === true) {
            return (
              <>
                  <Link href="/guest/offer/box">
                      <Button>Check Your Offer</Button>
                  </Link>
              </>
            );
          } else {
            return (
              <>
                  <Link href="/guest/review">
                      <Button>Please Review Guiding</Button>
                  </Link>
              </>
            );
          }
        case BookingStatus.Reviewed:
        case BookingStatus.Cancelled:
          return (
            <>
                <Link href="/guest/offer/box">
                    <Button>Check Your Offer</Button>
                </Link>
            </>
          );
        default:
          return null;
      }
    } else if (user_type === UserType.Guide) {
      switch (booking_status) {
        case BookingStatus.Accepted:
          return (
            <>
                <Link href="/guide/timer">
                    <Button>ガイドの準備をする</Button>
                </Link>
            </>
        );
        case BookingStatus.Started:
          return (
            <>
                <Link href="/guide/timer">
                    <Button>ガイド中です</Button>
                </Link>
            </>
          );
        case BookingStatus.Finished:
          if (guide_reviewed === true) {
            return (
              <>
                  <Link href="/guide/offer/box">
                      <Button>オファーボックスへ</Button>
                  </Link>
              </>
            );
          } else {
            return (
              <>
                  <Link href="/guide/review">
                      <Button>レビューをしてください</Button>
                  </Link>
              </>
            );
          }
        case BookingStatus.OfferPending:
            return (
              <div>
                <Button onClick={handleAcceptOffer}>
                  オファーを受ける
                </Button>
                <Button onClick={handleCancelOffer}>
                  オファーをキャンセルする
                </Button>
              </div>
            );
        case BookingStatus.Reviewed:
        case BookingStatus.Cancelled:
            return (
              <div>
                <Link href="/guest/offer/box">
                    <Button>オファーボックスへ</Button>
                </Link>
              </div>
            );

        default:
          return null;
      }
    }

    return null;
  };

  return <div>{renderButton()}</div>;
};

export default BookingButton;
