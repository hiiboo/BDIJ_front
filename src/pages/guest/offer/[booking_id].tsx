import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import styles from '../../../styles/profile.module.scss';

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
} from '../../../types/types';

const OfferById: React.FC<PageProps> = ({ isLoggedIn, userData }) => {

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
                {guideData && <GuideProfile isLoggedIn={isLoggedIn} userData={userData} guideData={guideData} />}
            </TabsContent>
            <TabsContent value="guide">
                <OfferInformation isLoggedIn={isLoggedIn} bookingData={bookingData} />
            </TabsContent>
            {userData && <BookingButton userData={userData} isLoggedIn={isLoggedIn} bookingData={bookingData} />}
        </Tabs>
        </main>
    </>
  );
}

export default OfferById;