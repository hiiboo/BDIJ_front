import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { utils } from '../utils/utils';

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

interface BookingData {
    id: number;
    guide_id: number;
    guide_firstName?: string;
    guide_lastName?: string;
    guide_image?: string;
    guest_id: number;
    guest_firstName?: string;
    guest_lastName?: string;
    guest_image?: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    total_guest: number;
    comment: string;
    created_at: Date;
    booking_status?: BookingStatus;
}

// BookingButtonコンポーネントのPropsの型定義
interface PageProps {
  userData: userData;
  BookingData: BookingData | null;
}

const BookingButton: React.FC<PageProps> = ({ userData, BookingData }) => {

  const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

  const handleCancelNoFee = () => {
    alert('under development');
  };

  const handleCancelApplyFee = () => {
    alert('under development');
  };

  const handleAcceptOffer = () => {
    const securedAxios = createSecuredAxiosInstance();
    securedAxios.post('/api/acceptOffer', {
      bookingId: BookingData?.id,
      guideId: userData.id, // userDataにidが含まれていることを確認してください
    })
    .then(() => {
      router.reload();
    })
    .catch(error => console.error(error));
  };

  const handleCancelOffer = () => {
    const securedAxios = createSecuredAxiosInstance();
    securedAxios.post('/api/cancelOffer', {
      bookingId: BookingData?.id,
      guideId: userData.id, // userDataにidが含まれていることを確認してください
    })
    .then(() => {
      router.reload();
    })
    .catch(error => console.error(error));
  };

  const renderButton = () => {
    const { user_type } = userData;
    // BookingDataがnullか、booking_statusがnullの場合の処理
    if (!BookingData || BookingData.booking_status == null) {
      return (
        <div>
          <Link href="/guest/offer/box">
            <Button>オファーボックスに戻る</Button>
          </Link>
        </div>
      );
    }
    const { booking_status } = BookingData;

    if (user_type === 'guest') {
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
    } else if (user_type === 'guide') {
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
