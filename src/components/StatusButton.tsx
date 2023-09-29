import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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

  const handleCancelNoFee = () => {
    alert('under development');
    // Execute the function to display modalCancelNoFee
  };

  const handleCancelApplyFee = () => {
    alert('under development');
    // Execute the function to display modalCancelApplyFee
  };

  const renderButton = () => {
    if (!userData) {
      return null;
    }

    const { user_type, booking_status } = userData;


    if (user_type === 'guest') {
      switch (booking_status) {
        case BookingStatus.OfferPending:
          return <Button onClick={handleCancelNoFee}>Cancell</Button>;
        case BookingStatus.Accepted:
          return (
            <>
                <Link href="/guest/timer">
                    <Button>Prepare your Guide</Button>
                </Link>
                <Button onClick={handleCancelApplyFee}>Cancell</Button>
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
          return (
            <>
                <Link href="/guest/review">
                    <Button>Please Review</Button>
                </Link>
            </>
          );
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
                    <Button>Prepare your Guide</Button>
                </Link>
            </>
        );
        case BookingStatus.Started:
          return (
            <>
                <Link href="/guide/timer">
                    <Button>While Guiding</Button>
                </Link>
            </>
          );
        case BookingStatus.Finished:
          return (
                <>
                    <Link href="/guide/review">
                        <Button>Please Review</Button>
                    </Link>

                </>
            );
        case BookingStatus.OfferPending:
          return (
            <div>
                <Link href="/guide/offer/box">
                  <Badge color='primary'>
                    You have a offer!
                  </Badge>
                  <Button>
                    Check Your Offer
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
                      OfferBox
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
