import { useState, useEffect } from 'react';
import '../styles/globals.scss';
import '../styles/font.scss';
import JapaneseFontAdjustment from '../styles/japaneseFontAdjustment';
import '../styles/japaneseFontAdjustment.scss';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../components/AuthContext';
import { Providers } from '../../components/nextui/providers';
import Header from '../components/Header';
import { useRouter } from 'next/router';
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

export default function App({ Component, pageProps }: AppProps) {

// <-- ---------- useState ---------- -->

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const [userData, setUserData] = useState<UserData | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const [authChecked, setAuthChecked] = useState(false);

// <-- ---------- 定数の定義 ---------- -->

    const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

// <-- ---------- 関数の定義 ---------- -->

    const checkAuth = async () => {
        const storedToken = localStorage.getItem('user_token');
        console.log(storedToken);
        if (storedToken) {
            try {
                const securedAxios = createSecuredAxiosInstance();
                const response = await securedAxios.get(`/api/check-auth`);
                console.log(response.data);
                if (response.data && response.data.hasOwnProperty("isLoggedIn")) {
                    setIsLoggedIn(response.data.isLoggedIn);

                    // ログインしている場合、ユーザーの詳細情報をフェッチする
                    if (response.data.isLoggedIn) {
                        const userDetails = await securedAxios.get(`/api/user/current`);
                        console.log(userDetails.data.data);
                        setUserData(userDetails.data.data); // ユーザーの詳細情報をステートにセット
                        setAuthChecked(true);
                    }
                } else {
                    console.error("Unexpected API response format");
                    setAuthChecked(true);
                }
            } catch (error) {
                setIsLoggedIn(false);
                setUserData(null); // エラーが発生した場合、userDataをnullにセット
                setAuthChecked(true);
            }
        } else {
            setIsLoggedIn(false);
            setAuthChecked(true);
        }
    };

    const sendLocation = async (latitude: number, longitude: number) => {
        try {
            const securedAxios = createSecuredAxiosInstance();
            console.log('Sending location', latitude, longitude);
            securedAxios.post(`/user/current/location`, { latitude, longitude });
            console.log('Location sent successfully');
        } catch (error) {
            console.error('Failed to send location', error);
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('Location received', latitude, longitude);
                    sendLocation(latitude, longitude);
                },
                (error) => {
                    console.error('Failed to get location', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser');
        }
    };

// <-- ---------- useEffect ---------- -->

    const router = useRouter();

    useEffect(() => {
        // checkAuth 関数が非同期処理を完了するまで、isLoading を true に設定
        const authenticate = async () => {
            await checkAuth();
            setIsLoading(false); // 非同期処理が完了したら、isLoading を false に設定
        };

        authenticate();
    }, []);

    useEffect(() => {
        if (!authChecked) {
            return; // checkAuth関数が完了するまで何もしない
        }
        const path = router.asPath;

        // ログインしている場合
        if (isLoggedIn && userData) {
            if (userData.user_type === UserType.Guest) {
                if (path.startsWith('/guide') && !['/guide', '/guide/auth', '/guide/login', '/guide/signup'].includes(path)) {
                    alert('アクセス権限がありません');
                    router.back();
                    return;
                }
                if (path === '/guide') {
                    router.push('/guide/mypage');
                }
            } else if (userData.user_type === UserType.Guide) {
                if (path.startsWith('/guest/offer') || ['/guest/mypage', '/guest/review', '/guest/timer'].includes(path)) {
                    alert('アクセス権限がありません');
                    router.back();
                    return;
                }
                if (path === '/guest') {
                    router.push('/');
                }
            }
        } else {
            if (
                (path.startsWith('/guest/offer') && !path.startsWith('/guest/offer/confirmation')) ||
                ['/guest/mypage', '/guest/review', '/guest/timer'].includes(path)
            ) {
                const queryParams = new URLSearchParams(window.location.search);
                const startTime = queryParams.get('start_time');
                const endTime = queryParams.get('end_time');
                const totalGuests = queryParams.get('total_guests');
                const guideId = queryParams.get('guide_id');

                if (
                    !startTime ||
                    !endTime ||
                    !totalGuests ||
                    !guideId ||
                    path !== '/guest/offer/confirmation'
                ) {
                    alert('ログインが必要です');
                    router.back();
                    return;
                }
            }
            if (path.startsWith('/guide') && !['/test', '/guide', '/guide/auth', '/guide/login', '/guide/signup'].includes(path)) {
                alert('ログインが必要です');
                router.push('/guide/auth');
                return;
            }
            if (path === '/guide') {
                router.push('/guide/auth');
            }
        }

    }, [authChecked, isLoggedIn, userData, router]);

    useEffect(() => {
        // 現在のパスを取得
        const currentPath = router.asPath;

        // ログイン中であるかどうかを確認
        if (isLoggedIn) {
            // ログイン中で、/guest/auth、/guide/auth、/guest/login、/guest/signin、/guide/login、/guide/signin のいずれかにアクセスした場合
            if (
                currentPath.startsWith('/guest/auth') ||
                currentPath.startsWith('/guide/auth') ||
                currentPath.startsWith('/guest/login') ||
                currentPath.startsWith('/guest/signup') ||
                currentPath.startsWith('/guide/login') ||
                currentPath.startsWith('/guide/signup')
            ) {
                alert('ログイン中です');
                router.back();
                return;
            }
        } else {
            if (currentPath.startsWith('/guest/login') || currentPath.startsWith('/guest/signup')) {
                router.push({
                    pathname: '/guest/auth',
                    query: { tab: currentPath.includes('login') ? 'login' : 'signup' }
                });
            }

            if (currentPath.startsWith('/guide/login') || currentPath.startsWith('/guide/signup')) {
                router.push({
                    pathname: '/guide/auth',
                    query: { tab: currentPath.includes('login') ? 'login' : 'signup' }
                });
            }
        }
    }, [isLoggedIn]);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (isLoggedIn && userData) {
            const { user_type, booking_status, status } = userData;

            // 条件に合致する場合、位置情報を取得し、APIに送信
            if (user_type === UserType.Guide && (booking_status === BookingStatus.Reviewed || booking_status === BookingStatus.Cancelled || booking_status === null) && status === UserStatus.Active) {
                getLocation();

                // 5分ごとに位置情報を取得し、APIに送信
                const intervalId = setInterval(getLocation, 5 * 60 * 1000);

                return () => clearInterval(intervalId); // クリーンアップ関数
            }
        }
    }, [isLoggedIn, userData]);

// <-- ---------- 表示 ---------- -->

    // isLoading が true の間は、ローディング画面を表示
    if (isLoading) {
        return <div>Loading...</div>; // ここにローディング画面のコンポーネントまたはマークアップを追加
    }

    return (
        <>
            <Providers>
            <AuthProvider checkAuth={checkAuth}>
                <Header isLoggedIn={isLoggedIn} userData={userData ?? undefined} />
                <JapaneseFontAdjustment />
                <Component {...pageProps} isLoggedIn={isLoggedIn} userData={userData} />
            </AuthProvider>
            </Providers>
        </>
    );
}