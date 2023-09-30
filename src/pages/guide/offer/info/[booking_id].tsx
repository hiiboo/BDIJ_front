import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import styles from '../../../../styles/profile.module.scss';

import { utils } from '../../../../utils/utils';
import GuestProfile from '../../../../components/GuestProfile';
import OfferInformation from '../../../../components/OfferInformation';
import BookingButton from '../../../../components/BookingButton';
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
} from '../../../../types/types';

const OfferById: React.FC<PageProps> = ({ isLoggedIn, userData }) => {

    const [guestData, setGuestData] = useState<GuestData | null>(null);
    const [bookingId, setBookingId] = useState<number | null>(null);
    const [bookingData, setBookingData] = useState<BookingData | null>(null);

// <-- ---------- 定数の定義 ---------- -->

    const router = useRouter();
    const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

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
                const response = await securedAxios.get(`/api/bookings/${bookingId}/related-user`);
                console.log(response.data.data);
                const bookingData = response.data.data;
                const guestData = response.data.data.guest;
                setBookingData(bookingData);
                setGuestData(guestData);

                // // bookingDataにhourly_rateを追加
                // const updatedBookingData = {
                //     ...bookingData,
                //     hourly_rate: guestData.hourly_rate,
                // };
                // setBookingData(updatedBookingData);

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
        <Tabs defaultValue="booking" className="w-100">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="booking">Booking</TabsTrigger>
                <TabsTrigger value="guest">Guest</TabsTrigger>
            </TabsList>
            <TabsContent value="booking">
                <h3 className="my-2 py-2 bold"><small>Status</small><br/>{bookingData?.status}</h3>
                <OfferInformation isLoggedIn={isLoggedIn} bookingData={bookingData} />
            </TabsContent>
            <TabsContent value="guest">
                {guestData && <GuestProfile isLoggedIn={isLoggedIn} userData={userData} guestData={guestData} />}
            </TabsContent>
            {userData && <BookingButton isLoggedIn={isLoggedIn} userData={userData} bookingData={bookingData} />}
        </Tabs>
        </main>
    </>
  );
}

export default OfferById;