import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import styles from '../styles/guest.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactStarsRating from 'react-awesome-stars-rating';
import { utils } from '../utils/utils';
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

enum SortOption {
  Newest,
  HighestRated,
  MostReviewed,
  HighestLanguageLevel,
  MostExpensive,
  LeastExpensive,
  Nearest,
}

function Home({ userData }: PageProps): JSX.Element | null {

// <-- ---------- useState ---------- -->


// <-- ---------- 定数の定義 ---------- -->
  const router = useRouter();
  const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

// <-- ---------- 表示 ---------- -->

  return (
    <>
      <div className="relative h-screen w-full bg-center bg-cover p-16" style={{ backgroundImage: 'url(/top_image.webp)' }}>

        {/* ロゴの配置 */}
        <img src="/top_logo.webp" alt="Top Logo" className="" />

        {/* ボタンの配置 */}
        <Link href="/guest" className="py-4">
          <Button className="bg-blue-500 text-white p-4 w-full">For Guest</Button>
        </Link>
        <Link href="/guide/auth" className="py-4">
          <Button className="bg-red-500 text-white p-4 w-full">For Guide</Button>
        </Link>
      </div>
    </>
  );
}

export default Home;
