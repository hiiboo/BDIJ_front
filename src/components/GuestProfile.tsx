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

import {
  BookingStatus,
  LanguageLevel,
  UserType,
  UserStatus,
  UserData,
  GuestData,
  GuideData,
  BookingData,
  PageProps,
} from '../types/types';

function GuestProfile({ userData, guestData }: PageProps): JSX.Element | null {

// <-- ---------- 定数の定義 ---------- -->



// <-- ---------- 関数の定義 ---------- -->



// <-- ---------- 表示 ---------- -->

  return (
    <>
      <div className={styles.iconContainer}>
        <span className={styles.iconBox}>
          {guestData && <Image
            src={guestData.profile_image ? guestData.profile_image : '/image/user.jpeg'}
            alt="icon"
            layout="fill"
            objectFit="cover"
            className={styles.icon}
          />}
        </span>
      </div>
      <h1>{guestData ? guestData.first_name : 'Loading...'} {guestData ? guestData.last_name : 'Loading...'}</h1>
      {guestData && <ReactStarsRating className={styles.stars} value={guestData.review_average} />}
      <p><small>{guestData ? `${guestData.review_average}（${guestData.review_count} comments）` : 'Loading...'}</small></p>
    </>
  );
}

export default GuestProfile;