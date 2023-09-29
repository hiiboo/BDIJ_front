import { useState } from 'react';
import axios from 'axios';
import styles from '../styles/header.module.scss';
import UserMenu from './UserMenu';
import HamburgerMenu from './HamburgerMenu';
import Image from "next/image"
import Link from 'next/link';
import { useAuth } from './AuthContext'
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/shadcnui/menubar"
import { Spacer } from "@nextui-org/react";
import { utils } from "../utils/utils"
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

function Header({ isLoggedIn, userData }: PageProps): JSX.Element {
    const { checkAuth } = useAuth();
    const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

    let logoText = ""; // ロゴテキストの初期値を空文字列に設定

    if (router.pathname.startsWith("/guide")) {
        // 現在のパスが /guide/* の場合
        logoText = "For Guide";
    } else if (router.pathname.startsWith("/guest") || router.pathname === "/") {
        // 現在のパスが /guest/* または / の場合
        logoText = "For Guest";
    }

    // ログアウト関数内の一部を変更
    const handleLogout = async () => {
        try {
            const response = await axios.post(`${apiUrl}/auth/user/logout`, {}, {
                withCredentials: true
            });
            if (response.status === 200 && response.data.message === "Logout successful") {
                localStorage.removeItem('user_token');
                alert('Logout successful');
                await checkAuth();
                console.log("Logout successful", response);

                // ログアウト後に再度ログイン状態をチェック
                checkAuth();
            } else {
                alert('Logout failed');
                console.error("Logout failed", response);
            }
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    let notificationText = "";
    let notificationLink = "";

    if (userData) {
        const { user_type, booking_status } = userData;

        if (booking_status === BookingStatus.OfferPending) {
            notificationText = user_type === "guest" ? "Your offer is Pending" : "オファーを確認ください";
            notificationLink = user_type === "guest" ? "/guest/offer/box" : "/guide/offer/box";
        } else if (booking_status === BookingStatus.Accepted) {
            notificationText = user_type === "guest" ? "Your offer is Accepted" : "ガイド予定を確認する";
            notificationLink = user_type === "guest" ? "/guest/offer/box" : "/guide/offer/box";
        } else if (booking_status === BookingStatus.Started) {
            notificationText = user_type === "guest" ? "While Guiding" : "ガイド中です";
            notificationLink = user_type === "guest" ? "/guest/timer" : "/guide/timer";
        } else if (booking_status === BookingStatus.Finished) {
            notificationText = user_type === "guest" ? "Please Review" : "レビューしてください";
            notificationLink = user_type === "guest" ? "/guest/review" : "/guide/review";
        }
    }

    return (
        <div>
            <Menubar className={styles.header}>
                <MenubarMenu>
                    <MenubarTrigger style={{ padding:0 }}>
                        <Link href="/">
                            <div className={styles.logoContainer}>
                                <div className={styles.logoBox}>
                                    <Image
                                        src="/logo_3.png"
                                        alt="Logo"
                                        objectFit="contain"
                                        className={styles.logo}
                                        onClick={() => router.push('/')}
                                        height={175}
                                        width={754}
                                    />
                                </div>
                                <p className={styles.logoText}>{logoText}</p>
                            </div>
                        </Link>
                    </MenubarTrigger>
                </MenubarMenu>
                <Spacer x={16} />
                <MenubarMenu>
                    <UserMenu
                        isLoggedIn={isLoggedIn}
                        userData={userData}
                        handleLogout={handleLogout}
                    />
                </MenubarMenu>
                <MenubarMenu>
                    <HamburgerMenu
                        isLoggedIn={isLoggedIn}
                        userData={userData}
                    />
                </MenubarMenu>
            </Menubar>
            {notificationText && (
                <div className="text-center">
                    <Link href={notificationLink}>
                        {notificationText}
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Header;