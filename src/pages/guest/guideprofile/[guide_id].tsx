import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import styles from '../../../styles/guideprofile.module.scss';

import { utils } from '../../../utils/utils';
import GuideProfile from '../../../components/GuideProfile';
import OfferForm from '../../../components/OfferForm';

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

enum Gender {
    male,
    female,
    other
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

interface userData {
    id: number;
    user_type: string;
    lastBookingStatus: BookingStatus | null;
    status: string;
}

interface PageProps {
    isLoggedIn: boolean;
    userData?: userData;
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

function GuideProfileById({ isLoggedIn, userData }: PageProps): JSX.Element | null {

    const [guideData, setGuideData] = useState<GuideData | null>(null);
    const [guideId, setGuideId] = useState<number | null>(null);

// <-- ---------- 定数の定義 ---------- -->

  const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

// <-- ---------- useEffect ---------- -->

    useEffect(() => {
        if (router.isReady) {
            const { guide_id } = router.query;
            setGuideId(Number(guide_id));
        }
    }, [router.isReady]);

    useEffect(() => {
        if (!guideId) {
            // guide_idが存在しない場合、エラーハンドリングを行うか、別のページにリダイレクトします。
            console.error("guide_id is missing");
        }
        const fetchGuideData = async () => {
            try {
              const securedAxios = createSecuredAxiosInstance();
              const response = await securedAxios.get(`/api/guide/{$guideId}`);
              setGuideData(response.data);
            } catch (error) {
              console.error('Failed to fetch guide data', error);
            }
        };
        fetchGuideData();
    }, [guideId]);

  // <-- ---------- 表示 ---------- -->

  return (
    <>
        <main className={styles.main}>
            {guideData && <GuideProfile isLoggedIn={isLoggedIn} userData={userData} GuideData={guideData} />}
            {guideData && <OfferForm isLoggedIn={isLoggedIn} userData={userData} GuideData={guideData} />}
        </main>
    </>
  );
}

export default GuideProfileById;