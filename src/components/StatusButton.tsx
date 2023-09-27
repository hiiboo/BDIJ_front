import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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
  userData: userData;
}

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
    const { user_type, lastBookingStatus } = userData;

    if (user_type === 'guest') {
      switch (lastBookingStatus) {
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
      switch (lastBookingStatus) {
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
