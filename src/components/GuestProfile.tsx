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

interface PageProps {
  isLoggedIn: boolean;
  userData?: userData;
  GuestData?: GuestData;
}

function GuestProfile({ isLoggedIn, userData, GuestData }: PageProps): JSX.Element | null {

// <-- ---------- 定数の定義 ---------- -->



// <-- ---------- 関数の定義 ---------- -->



// <-- ---------- 表示 ---------- -->

  return (
    <>
      <div className={styles.iconContainer}>
        <span className={styles.iconBox}>
          {GuestData && <Image
            src={GuestData.profile_image ? GuestData.profile_image : '/image/user.jpeg'}
            alt="icon"
            layout="fill"
            objectFit="cover"
            className={styles.icon}
          />}
        </span>
      </div>
      <h1>{GuestData ? GuestData.firstName : 'Loading...'} {GuestData ? GuestData.lastName : 'Loading...'}</h1>
      {GuestData && <p>{(GuestData.email)}</p>}
      {GuestData && <ReactStarsRating className={styles.stars} value={GuestData.review_rate} />}
      <p><small>{GuestData ? `${GuestData.review_rate}（${GuestData.review_sum} comments）` : 'Loading...'}</small></p>
    </>
  );
}

export default GuestProfile;