import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
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

const StatusButton: React.FC<PageProps> = ({ userData }) => {
  const router = useRouter();
  const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

  const renderButton = () => {
    if (!userData) {
      return null;
    }

    const { user_type, booking_status, guest_reviewed, guide_reviewed } = userData;


    if (user_type === 'guest') {
      switch (booking_status) {
        case BookingStatus.OfferPending:
          return (
            <>
                <Link href="/guest/offer/box">
                    <Button>Check or Cancell Your Offer</Button>
                </Link>
            </>
          );
        case BookingStatus.Accepted:
          return (
            <>
                <Link href="/guest/timer">
                    <Button>Prepare your Guide</Button>
                </Link>
                <Link href="/guest/offer/box">
                    <Button>Check or Cancell Your Offer</Button>
                </Link>
            </>
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
          if (guest_reviewed) {
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
        case null:
          return (
            <>
                <Link href="/guest/offer/box">
                    <Button>OfferBox</Button>
                </Link>
            </>
          );
        default:
          return null;
      }
    } else if (user_type === 'guide') {
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
            if (guide_reviewed) {
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
                <Link href="/guide/offer/box">
                  <Badge color='primary'>
                    オファーが来ています！
                  </Badge>
                  <Button>
                    オファーを確認ください
                  </Button>
                </Link>
            </div>
          );
        case BookingStatus.Reviewed:
        case BookingStatus.Cancelled:
        case null:
            return (
              <div>
                  <Link href="/guide/offer/box">
                    <Button>
                      オファーボックスへ
                    </Button>
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

export default StatusButton;
