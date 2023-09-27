import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import styles from '../styles/guest.module.scss';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactStarsRating from 'react-awesome-stars-rating';
import { utils } from '../utils/utils';

// <-- ---------- enum ---------- -->

enum LanguageLevel {
  Beginner,
  Elementary,
  Intermediate,
  UpperIntermediate,
  Advanced,
  Proficiency,
}

enum SortOption {
  Newest,
  HighestRated,
  MostReviewed,
  HighestLanguageLevel,
  MostExpensive,
  LeastExpensive,
  Nearest,
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
  language_level: LanguageLevel;
  hourly_rate: number;
  review_rate: number;
  review_sum: number;
  latitude?: number;
  longitude?: number;
  created_at: Date;
}

function Home({ isLoggedIn, userData }: PageProps): JSX.Element | null {

// <-- ---------- useState ---------- -->

  const [guides, setGuides] = useState<GuideData[]>([]);
  const [sortedGuides, setSortedGuides] = useState<GuideData[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.Newest);
  const [isLoading, setIsLoading] = useState(true);


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

// <-- ---------- useEffect ---------- -->

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setIsLoading(true);
        const securedAxios = createSecuredAxiosInstance();
        const response = await securedAxios.get('/api/guide');
        setGuides(response.data);
      } catch (error) {
        console.error('Failed to fetch guide data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuides();
  }, [isLoggedIn, userData, router]);

  useEffect(() => {
    // lastBookingStatus に基づいてリダイレクト処理
    if (isLoggedIn && userData) {
      const { lastBookingStatus, user_type } = userData;
      let redirectPath = '';

      switch (lastBookingStatus) {
        case BookingStatus.OfferPending:
        case BookingStatus.Accepted:
          redirectPath = `/${user_type}/offer/box`;
          break;
        case BookingStatus.Started:
          redirectPath = `/${user_type}/timer`;
          break;
        case BookingStatus.Finished:
          redirectPath = `/${user_type}/review`;
          break;
        case BookingStatus.Reviewed:
        case BookingStatus.Cancelled:
        case null:
          break;
      }

      if (redirectPath) {
        router.push(redirectPath);
      }
    }
  }, [isLoggedIn, userData, router]);

  useEffect(() => {
    let newSortedGuides = [...guides];
    switch (sortOption) {
      case SortOption.Newest:
        newSortedGuides.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
        break;
      case SortOption.HighestRated:
        newSortedGuides.sort((a, b) => b.review_rate - a.review_rate);
        break;
      case SortOption.MostReviewed:
        newSortedGuides.sort((a, b) => b.review_sum - a.review_sum);
        break;
      case SortOption.HighestLanguageLevel:
        newSortedGuides.sort((a, b) => b.language_level - a.language_level);
        break;
      case SortOption.MostExpensive:
        newSortedGuides.sort((a, b) => b.hourly_rate - a.hourly_rate);
        break;
      case SortOption.LeastExpensive:
        newSortedGuides.sort((a, b) => a.hourly_rate - b.hourly_rate);
        break;
        case SortOption.Nearest:
          newSortedGuides.sort((a, b) => {
            const distanceA = a.latitude && a.longitude
              ? calculateDistance(HARAJUKU_STATION.latitude, HARAJUKU_STATION.longitude, a.latitude, a.longitude)
              : Infinity;
            const distanceB = b.latitude && b.longitude
              ? calculateDistance(HARAJUKU_STATION.latitude, HARAJUKU_STATION.longitude, b.latitude, b.longitude)
              : Infinity;
            return distanceA !== Infinity || distanceB !== Infinity
              ? distanceA - distanceB
              : b.review_rate - a.review_rate;
          });
          break;
    }
    setSortedGuides(newSortedGuides);
  }, [sortOption, guides]);

// <-- ---------- 表示 ---------- -->

  // 表示
  if (isLoading) {
    return <div>Loading...</div>; // ローディング画面の表示
  }

  return (
    <>
      <header>
      <Image
          src="/image/header_guest.png"
          alt="Logo"
          objectFit="contain"
          className={styles.header}
          height={175}
          width={754}
      />
      </header>
      <main className={styles.main}>
        <h2 className={styles.title}><small>Meeting Place</small><br/><span className='bold'>Harajuku Station</span></h2>
        <div className={styles.mapBox}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12965.122741642823!2d139.7024662!3d35.6700901!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188cbac9b52cff%3A0x560d87a8e2d1d3d2!2z5Y6f5a6_6aeF!5e0!3m2!1sja!2sjp!4v1695444723504!5m2!1sja!2sjp"
            className={styles.map}
            loading="lazy"
          >
          </iframe>
        </div>
        <h2 className={styles.title}><span className='bold'>Select a guide nearby.</span></h2>
        <div className={styles.selectBox}>
          <Select
            onValueChange={(value) => setSortOption(SortOption[value as keyof typeof SortOption])}
            value={SortOption[sortOption]}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={SortOption[SortOption.Newest]}>Newest</SelectItem>
                <SelectItem value={SortOption[SortOption.HighestRated]}>HighestRated</SelectItem>
                <SelectItem value={SortOption[SortOption.MostReviewed]}>MostReviewed</SelectItem>
                <SelectItem value={SortOption[SortOption.HighestLanguageLevel]}>HighestLanguageLevel</SelectItem>
                <SelectItem value={SortOption[SortOption.MostExpensive]}>MostExpensive</SelectItem>
                <SelectItem value={SortOption[SortOption.LeastExpensive]}>LeastExpensive</SelectItem>
                <SelectItem value={SortOption[SortOption.Nearest]}>Nearest</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className={styles.cardContainer}>
        {sortedGuides.map(guide => {
          console.log(guide); // ここで各ガイドデータをコンソールに出力

          return (
            <Link href={`/guest/guideprofile/${guide.id}`}>
              <Card key={guide.id} className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                  <span className={styles.iconBox}>
                    <Image
                      src={guide.profile_image ? guide.profile_image : '/image/user.jpeg'}
                      alt="icon"
                      layout="fill"
                      objectFit="cover"
                      className={styles.icon}
                    />
                  </span>
                </CardHeader>
                <CardContent>
                  <CardTitle>{guide.firstName} {guide.lastName}</CardTitle>
                  <CardDescription>
                    <span className='bold'>{guide.latitude && guide.longitude
                      ? calculateDistance(HARAJUKU_STATION.latitude, HARAJUKU_STATION.longitude, guide.latitude, guide.longitude).toFixed(1)
                      : '-'}km</span><br/><small>from Harajuku</small>
                  </CardDescription>
                  <Badge>{LanguageLevel[guide.language_level]}</Badge>
                  <CardDescription>1h ¥{guide.hourly_rate.toLocaleString()}</CardDescription>
                  <ReactStarsRating className={styles.stars} value={guide.review_rate} />
                  <CardDescription><small>{guide.review_rate}（{guide.review_sum}comments）</small></CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        </div>
      </main>
    </>
  );
}

export default Home;