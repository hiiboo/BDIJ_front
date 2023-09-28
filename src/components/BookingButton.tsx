import React from 'react';
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

const BookingButton: React.FC<PageProps> = ({ userData, isLoggedIn ,bookingData }) => {

  const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

  const handleCancelNoFee = () => {
    alert('under development');
  };

  const handleCancelApplyFee = () => {
    alert('under development');
  };

  const handleAcceptOffer = () => {
    const securedAxios = createSecuredAxiosInstance();
    const booking_id = bookingData?.id
    securedAxios.post(`/api/{$booking_id}/acceptoffer`, {})
    .then(() => {
      router.reload();
    })
    .catch(error => console.error(error));
  };

  const handleCancelOffer = () => {
    const securedAxios = createSecuredAxiosInstance();
    const booking_id = bookingData?.id
    securedAxios.post(`/api/{$booking_id}/canceloffer`, {})
    .then(() => {
      router.reload();
    })
    .catch(error => console.error(error));
  };

  const renderButton = () => {
    if(!userData) {
      alert('userData is null');
      return null;
    }
    const { user_type } = userData;
    // bookingDataがnullか、booking_statusがnullの場合の処理
    if (!bookingData || bookingData.booking_status == null) {
      return (
        <div>
          <Link href="/guest/offer/box">
            <Button>オファーボックスに戻る</Button>
          </Link>
        </div>
      );
    }
    const { booking_status } = bookingData;

    if (user_type === UserType.Guest) {
      switch (booking_status) {
        case BookingStatus.OfferPending:
          return <Button onClick={handleCancelNoFee}>キャンセルする</Button>;
        case BookingStatus.Accepted:
          return (
            <>
                <Link href="/guest/timer">
                    <Button>ガイド準備</Button>
                </Link>
                <Button onClick={handleCancelApplyFee}>キャンセルする</Button>
            </>
          );
        case BookingStatus.Started:
          return (
            <>
                <Link href="/guest/timer">
                    <Button>ガイド中</Button>
                </Link>
            </>
          );
        case BookingStatus.Finished:
          return (
            <>
                <Link href="/guest/review">
                    <Button>レビュー待ち</Button>
                </Link>
            </>
          );
        case BookingStatus.Reviewed:
        case BookingStatus.Cancelled:
          return (
            <>
                <Link href="/guest/offer/box">
                    <Button>オファーボックスに戻る</Button>
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
                    <Button>ガイド準備</Button>
                </Link>
            </>
        );
        case BookingStatus.Started:
          return (
            <>
                <Link href="/guide/timer">
                    <Button>ガイド中</Button>
                </Link>
            </>
          );
        case BookingStatus.Finished:
          return (
                <>
                    <Link href="/guide/review">
                        <Button>レビュー待ち</Button>
                    </Link>

                </>
            );
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
                    <Button>オファーボックスに戻る</Button>
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
