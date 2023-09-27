import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import styles from '../../../../styles/profile.module.scss';

import { utils } from '../../../utils/utils';
import GuestProfile from '../../../components/GuestProfile';
import OfferInformation from '../../../components/OfferInformation';
import BookingButton from '../../../components/BookingButton';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

// <-- ---------- enum ---------- -->

enum LanguageLevel {
    Beginner,
    Elementary,
    Intermediate,
    UpperIntermediate,
    Advanced,
    Proficiency,
}

enum IsActive {
    active,
    inactive,
}

enum BookingStatus {
    OfferPending,
    Accepted,
    Started,
    Finished,
    Reviewed,
    Cancelled,
}

// <-- ---------- interface ---------- -->

interface PageProps {
    isLoggedIn: boolean;
    userData?: any;
}

interface GuestData {
    id: number;
    email: string;
    profile_image?: string;
    firstName: string;
    lastName: string;
    review_rate: number;
    review_sum: number;
    created_at: Date;
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
    hourly_rate: number;
    total_guest: number;
    comment: string;
    created_at: Date;
    booking_status?: BookingStatus;
}

// BookingDataのinterfaceも本来必要

function OfferById({ isLoggedIn, userData }: PageProps): JSX.Element | null {

    const [guestData, setGuestData] = useState<GuestData | null>(null);
    const [bookingId, setBookingId] = useState<number | null>(null);
    const [bookingData, setBookingData] = useState<BookingData | null>(null);

// <-- ---------- 定数の定義 ---------- -->

    const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

// <-- ---------- useEffect ---------- -->

    useEffect(() => {
        if (router.isReady) {
            const { booking_id } = router.query;
            setBookingId(Number(booking_id));
        }
    }, [router.isReady]);

    useEffect(() => {
        if (!bookingId) {
            // booking_idが存在しない場合、エラーハンドリングを行うか、別のページにリダイレクトします。
            console.error("booking_id is missing");
        }

        const fetchBookingData = async () => {
            try {
              const securedAxios = createSecuredAxiosInstance();
              const response = await securedAxios.get(`/api/booking/{$bookingId}`);
              setBookingData(response.data);
            } catch (error) {
              console.error('Failed to fetch booking data', error);
            }
        }

        const fetchGuestDataByBookingId = async () => {
            try {
                const securedAxios = createSecuredAxiosInstance();
                const response = await securedAxios.get(`/api/booking/guest/{$bookingId}`);
                setGuestData(response.data);
            } catch (error) {
            console.error('Failed to fetch guest data', error);
            };
        };

        fetchBookingData();
        fetchGuestDataByBookingId();
    }, [bookingId]);

  // <-- ---------- 表示 ---------- -->

  return (
    <>
        <main className={styles.main}>
        <Tabs defaultValue="" className="w-100">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="booking">Booking</TabsTrigger>
                <TabsTrigger value="guide">Guide</TabsTrigger>
            </TabsList>
            <TabsContent value="guide">
                {guestData && <GuestProfile isLoggedIn={isLoggedIn} userData={userData} GuestData={guestData} />}
            </TabsContent>
            <TabsContent value="guide">
                <OfferInformation BookingData={bookingData} />
            </TabsContent>
            <BookingButton userData={userData} BookingData={bookingData} />
        </Tabs>
        </main>
    </>
  );
}

export default OfferById;