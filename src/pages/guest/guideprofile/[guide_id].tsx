import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import styles from '../../../styles/profile.module.scss';

import { utils } from '../../../utils/utils';
import GuideProfile from '../../../components/GuideProfile';
import OfferForm from '../../../components/OfferForm';
import {
    BookingStatus,
    LanguageLevel,
    UserType,
    UserStatus,
    UserData,
    GuestData,
    GuideData,
    PageProps
} from '../../../types/types';

function GuideProfileById({ userData }: PageProps): JSX.Element | null {

    const [guideData, setGuideData] = useState<GuideData | null>(null);
    const [guideId, setGuideId] = useState<number | null>(null);

// <-- ---------- 定数の定義 ---------- -->

  const router = useRouter();
  const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

// <-- ---------- useEffect ---------- -->

    useEffect(() => {
        if (router.isReady) {
            const { guide_id } = router.query;
            setGuideId(Number(guide_id));
            console.log(guide_id);

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
              const response = await securedAxios.get(`/api/guide/${guideId}`);
              setGuideData(response.data.data);
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
            {guideData && <GuideProfile userData={userData} guideData={guideData} />}
            {guideData && <OfferForm userData={userData} guideData={guideData} />}
        </main>
    </>
  );
}

export default GuideProfileById;