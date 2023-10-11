import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import styles from '../styles/guest.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
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

  const [guides, setGuides] = useState<GuideData[]>([]);
  const [sortedGuides, setSortedGuides] = useState<GuideData[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.Newest);
  const [isLoading, setIsLoading] = useState(true);


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
      case LanguageLevel.Native:
        return 'Native';
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

// <-- ---------- useEffect ---------- -->

  useEffect(() => {
    // if (userData) {
    //   const { booking_status, user_type } = userData;
    //   let redirectPath = '';

    //   switch (booking_status) {
    //     case BookingStatus.OfferPending:
    //     case BookingStatus.Accepted:
    //       redirectPath = `/${user_type}/offer/box`;
    //       break;
    //     case BookingStatus.Started:
    //       redirectPath = `/${user_type}/timer`;
    //       break;
    //     case BookingStatus.Finished:
    //       redirectPath = `/${user_type}/review`;
    //       break;
    //     case BookingStatus.Reviewed:
    //     case BookingStatus.Cancelled:
    //     case null:
    //       break;
    //   }

    //   if (redirectPath) {
    //     router.push(redirectPath);
    //   }
    // }
    const fetchGuides = async () => {
      try {
        setIsLoading(true);
        const securedAxios = createSecuredAxiosInstance();
        const response = await securedAxios.get('/api/guide');
        console.log(response.data.data);
        setGuides(response.data.data);
      } catch (error) {
        console.error('Failed to fetch guide data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuides();
  }, [userData, router]);

useEffect(() => {
  let newSortedGuides = [...guides];
  const languageLevelToNumber = (level?: LanguageLevel) => {
    switch (level) {
      case LanguageLevel.Native:
        return 6;
      case LanguageLevel.Advanced:
        return 5;
      case LanguageLevel.UpperIntermediate:
        return 4;
      case LanguageLevel.Intermediate:
        return 3;
      case LanguageLevel.Elementary:
        return 2;
      case LanguageLevel.Beginner:
        return 1;
      default:
        return 0;
    }
  };
  switch (sortOption) {
    case SortOption.Newest:
      newSortedGuides.sort((a, b) => (b.created_at ? b.created_at.getTime() : 0) - (a.created_at ? a.created_at.getTime() : 0));
      break;
    case SortOption.HighestRated:
      newSortedGuides.sort((a, b) => (b.review_average || 0) - (a.review_average || 0));
      break;
    case SortOption.MostReviewed:
      newSortedGuides.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
      break;
    case SortOption.HighestLanguageLevel:
      newSortedGuides.sort((a, b) =>
        languageLevelToNumber(b.level) - languageLevelToNumber(a.level)
      );
      break;
    case SortOption.MostExpensive:
      newSortedGuides.sort((a, b) => (b.hourly_rate || 0) - (a.hourly_rate || 0));
      break;
    case SortOption.LeastExpensive:
      newSortedGuides.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0));
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
          : (b.review_average || 0) - (a.review_average || 0);
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
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d810.3239060395547!2d139.70255559999998!3d35.669722199999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzXCsDQwJzExLjAiTiAxMznCsDQyJzA5LjIiRQ!5e0!3m2!1sja!2sjp!4v1696993104573!5m2!1sja!2sjp"
            className={styles.map}
            loading="lazy"
          >
          </iframe>
          <div className='my-4'></div>
          <Image
            src="/image/meeting_place.jpg"
            alt="Logo"
            objectFit="contain"
            className={styles.header}
            height={310}
            width={684}
          />
        </div>
        <h2 className={styles.title}><span className='bold'>Select a Local Guide</span></h2>
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
          return (
            <Link key={guide.id} href={userData ? `/guest/guideprofile/${guide.id}` : `/guest/auth`}>
              <Card className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                  <span className={styles.iconBox}>
                    <Image
                      src={guide.profile_image ? `${process.env.NEXT_PUBLIC_API_URL}${guide.profile_image}` : '/logo_3.png'}
                      alt="icon"
                      layout="fill"
                      objectFit="cover"
                      className={styles.icon}
                    />
                  </span>
                </CardHeader>
                <CardContent>
                  <CardTitle>{guide.first_name} {guide.last_name}</CardTitle>
                  {/* <CardDescription>
                    <span className='bold'>{guide.latitude !== undefined && guide.longitude !== undefined
                      ? calculateDistance(HARAJUKU_STATION.latitude, HARAJUKU_STATION.longitude, guide.latitude, guide.longitude).toFixed(1)
                      : '-'}km</span><br/><small>from Harajuku</small>
                  </CardDescription> */}
                  {guide.level && <Badge>{getLanguageLevelLabel(guide.level)}</Badge>}
                  {/* <CardDescription className='bold'>¥{guide.hourly_rate ? guide.hourly_rate.toLocaleString() : 0} / 1h</CardDescription> */}
                  <ReactStarsRating className={styles.stars} value={guide.review_average} />
                  {/* <CardDescription><small>{guide.review_average}（{guide.review_count}comments）</small></CardDescription> */}
                  <CardDescription><small>{guide.review_count}comments</small></CardDescription>
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
