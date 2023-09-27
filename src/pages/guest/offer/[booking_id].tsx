import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import styles from '../../../../styles/profile.module.scss';

import { utils } from '../../../utils/utils';
import GuideProfile from '../../../components/GuideProfile';
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

enum Gender {
    male,
    female,
    other
}

// <-- ---------- interface ---------- -->

interface userData {
    id: number;
    user_type: string;
    lastBookingStatus: BookingStatus | null;
    status: string;
}

interface GuideData {
    id: number;
    profile_image?: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    language_level: LanguageLevel;
    introduction: string;
    birthday: Date;
    status: IsActive;
    hourly_rate: number;
    review_rate: number;
    review_sum: number;
    latitude?: number;
    longitude?: number;
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
    total_guest: number;
    comment: string;
    created_at: Date;
    booking_status?: BookingStatus;
    hourly_rate: number;
}

interface OfferInformationProps {
    BookingData: BookingData | null;
    isLoggedIn: boolean;
    userData?: userData;
}

const OfferById: React.FC<OfferInformationProps> = ({ isLoggedIn, userData }) => {

    const [guideData, setGuideData] = useState<GuideData | null>(null);
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
            console.error("booking_id is missing");
            return;
        }

        const fetchBookingData = async () => {
            try {
                const securedAxios = createSecuredAxiosInstance();
                const response = await securedAxios.get(`/api/booking/${bookingId}`);
                const bookingData = response.data;

                // GuideDataのhourly_rateを取得
                const guideResponse = await securedAxios.get(`/api/booking/guide/${bookingId}`);
                const guideData = guideResponse.data;
                setGuideData(guideData);

                // bookingDataにhourly_rateを追加
                const updatedBookingData = {
                    ...bookingData,
                    hourly_rate: guideData.hourly_rate,
                };
                setBookingData(updatedBookingData);

            } catch (error) {
                console.error('Failed to fetch data', error);
            }
        }

        fetchBookingData();
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
                {guideData && <GuideProfile isLoggedIn={isLoggedIn} userData={userData} GuideData={guideData} />}
            </TabsContent>
            <TabsContent value="guide">
                <OfferInformation BookingData={bookingData} />
            </TabsContent>
            {userData && <BookingButton userData={userData} BookingData={bookingData} />}
        </Tabs>
        </main>
    </>
  );
}

export default OfferById;