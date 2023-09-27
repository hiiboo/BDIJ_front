import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import styles from '../styles/profile.module.scss';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import ReactStarsRating from 'react-awesome-stars-rating';
import { utils } from '../utils/utils';
import { image } from '@nextui-org/react';

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
  GuideData?: GuideData | null;
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

function GuideProfile({ isLoggedIn, userData, GuideData }: PageProps): JSX.Element | null {

// <-- ---------- 定数の定義 ---------- -->

  const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
  // 原宿駅の緯度経度
  const HARAJUKU_STATION = {
    latitude: 35.6715,
    longitude: 139.7030,
  };

// <-- ---------- 関数の定義 ---------- -->

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    // 地球の半径（単位：km）
    const R = 6371;

    // 緯度と経度をラジアンに変換
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const deltaLat = (lat2 - lat1) * (Math.PI / 180);
    const deltaLon = (lon2 - lon1) * (Math.PI / 180);

    // ハバーサイン公式
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // 距離（単位：km）
    const distance = R * c;

    return distance;
  }

  function calculateAge(birthday: Date) {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

// <-- ---------- 表示 ---------- -->

  return (
    <>
      <div className={styles.iconContainer}>
        <span className={styles.iconBox}>
          {GuideData && <Image
            src={GuideData.profile_image ? GuideData.profile_image : '/image/user.jpeg'}
            alt="icon"
            layout="fill"
            objectFit="cover"
            className={styles.icon}
          />}
        </span>
      </div>
      <h1>{GuideData ? GuideData.firstName : 'Loading...'} {GuideData ? GuideData.lastName : 'Loading...'} <small>{GuideData ? GuideData.gender : 'Loading...'} / {GuideData ? calculateAge(GuideData.birthday) : 'Loading...'}</small></h1>
      <p>1h ¥{GuideData ? GuideData.hourly_rate.toLocaleString() : 'Loading...'}</p>
      {GuideData && <ReactStarsRating className={styles.stars} value={GuideData.review_rate} />}
      <p><small>{GuideData ? `${GuideData.review_rate}（${GuideData.review_sum} comments）` : 'Loading...'}</small></p>
      <p>
        <span className='bold'>{GuideData && GuideData.latitude && GuideData.longitude
          ? calculateDistance(HARAJUKU_STATION.latitude, HARAJUKU_STATION.longitude, GuideData.latitude, GuideData.longitude).toFixed(1)
          : '-'}km
        </span>
      </p>
      <p><small>from Harajuku</small></p>

      {GuideData && <Badge>{LanguageLevel[GuideData.language_level]}</Badge>}
      <p>{GuideData ? GuideData.introduction : 'Loading...'}</p>
    </>
  );
}

export default GuideProfile;