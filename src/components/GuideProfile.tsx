import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Image from 'next/image';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import styles from '../styles/profile.module.scss';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import ReactStarsRating from 'react-awesome-stars-rating';
import { utils } from '../utils/utils';
import { image } from '@nextui-org/react';
import {
  BookingStatus,
  LanguageLevel,
  UserType,
  UserStatus,
  UserData,
  GuestData,
  GuideData,
  PageProps
} from '../types/types';

function GuideProfile({ isLoggedIn, userData, guideData }: PageProps): JSX.Element | null {

// <-- ---------- 定数の定義 ---------- -->

  const router = useRouter();
  const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
  // 原宿駅の緯度経度
  const HARAJUKU_STATION = {
    latitude: 35.6715,
    longitude: 139.7030,
  };

  const getLanguageLevelLabel = (level?: LanguageLevel) => {
    switch (level) {
      case LanguageLevel.Beginner:
        return 'Beginner';
      case LanguageLevel.Elementary:
        return 'Elementary';
      case LanguageLevel.Intermediate:
        return 'Intermediate';
      case LanguageLevel.UpperIntermediate:
        return 'UpperIntermediate';
      case LanguageLevel.Advanced:
        return 'Advanced';
      case LanguageLevel.Proficiency:
        return 'Proficiency';
      default:
        return '';
    }
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
    if (!birthday) return null;
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
          {guideData && <Image
            src={guideData.profile_image ? guideData.profile_image : '/image/user.jpeg'}
            alt="icon"
            layout="fill"
            objectFit="cover"
            className={styles.icon}
          />}
        </span>
      </div>
      <h1>{guideData ? `${guideData.first_name} ${guideData.last_name}` : 'Loading...'} <small>（{guideData?.birthday ? calculateAge(guideData?.birthday)  : 'Loading...'}）</small></h1>
      <p>1h ¥{guideData?.hourly_rate?.toLocaleString() ?? '0'}</p>
      {guideData && <ReactStarsRating className={styles.stars} value={guideData.review_average} />}
      <p><small>{guideData ? `${guideData.review_average}（${guideData.review_count} comments）` : 'Loading...'}</small></p>
      <p>
        <span className='bold'>{guideData && guideData.latitude && guideData.longitude
          ? calculateDistance(HARAJUKU_STATION.latitude, HARAJUKU_STATION.longitude, guideData.latitude, guideData.longitude).toFixed(1)
          : '-'}km
        </span>
      </p>
      <p><small>from Harajuku</small></p>
      {guideData?.level ? <Badge>{getLanguageLevelLabel(guideData?.level)}</Badge> : <Badge></Badge>}
      <p>{guideData ? guideData.introduction : 'Loading...'}</p>
    </>
  );
}

export default GuideProfile;