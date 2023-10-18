import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../styles/header.module.scss';
import UserMenu from './UserMenu';
import Image from "next/image"
import Link from 'next/link';
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/shadcnui/menubar"
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

function Header({ userData }: PageProps): JSX.Element {
    const router = useRouter();
    const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

    let logoText = ""; // ロゴテキストの初期値を空文字列に設定
    let logoLink = "/"; // ロゴリンクの初期値を/に設定
    let changeText = "";
    let changeLink = "";

    if (router.pathname.startsWith("/guide")) {
        // 現在のパスが /guide/* の場合
        if(!userData) {
            logoText = "For Guide";
            logoLink = "/guide/auth"; // ロゴリンクを/guideに設定
            changeText = "Guest Mode"
            changeLink = "/"
        } else {
            logoText = "For Guide";
            logoLink = "/guide/auth"; // ロゴリンクを/guideに設定
            changeText = "Guest Mode"
            changeLink = "/"
        }
    } else if (router.pathname.startsWith("/guest") || router.pathname === "/") {
        // 現在のパスが /guest/* または / の場合
        if(!userData) {
            logoText = "For Guest";
            logoLink = "/guest"; // ロゴリンクを/guestに設定
            changeText = "Guide Mode"
            changeLink = "/guide/auth"
        } else {
            logoText = "For Guest";
            logoLink = "/guest"; // ロゴリンクを/guestに設定
            changeText = "Guide Mode"
            changeLink = "/guide/mypage"
        }
    }

    const handleLogout = async () => {
        try {
            const response = await axios.post(`${apiUrl}/auth/user/logout`, {}, {
                withCredentials: true
            });
            console.log("Logout response", response);
            if (response.status === 200) {
                // 通常のログアウト処理
                localStorage.removeItem('user_token');
                alert('Logout successful');
                console.log("Logout successful", response);
                router.push('/').then(() => window.location.reload());
            } else {
                alert('Logout failed');
                console.error("Logout failed", response);
            }
        } catch (error) {
            console.error("Logout error", error);

            // 強制的なクライアントサイドログアウト
            localStorage.removeItem('user_token');
            alert('An error occurred. You have been logged out.');
            router.push('/').then(() => window.location.reload());
        }
    };


    let notificationText = "";
    let notificationLink = "";

    if (userData) {
        const { user_type, booking_status, guest_reviewed, guide_reviewed } = userData;

        if (booking_status === BookingStatus.OfferPending) {
            notificationText = user_type === "guest" ? "Your offer is Pending" : "オファーを確認ください";
            notificationLink = user_type === "guest" ? "/guest/offer/box" : "/guide/offer/box";
        } else if (booking_status === BookingStatus.Accepted) {
            notificationText = user_type === "guest" ? "Your offer is Accepted" : "ガイド予定を確認する";
            notificationLink = user_type === "guest" ? "/guest/offer/box" : "/guide/offer/box";
        } else if (booking_status === BookingStatus.Started) {
            notificationText = user_type === "guest" ? "While Guiding" : "ガイド中です";
            notificationLink = user_type === "guest" ? "/guest/timer" : "/guide/timer";
        } else if (booking_status === BookingStatus.Finished && !guest_reviewed === true && user_type === "guest") {
            notificationText = "Please Review";
            notificationLink = "/guest/review";
        } else if (booking_status === BookingStatus.Finished && !guide_reviewed === true && user_type === "guide") {
            notificationText = "レビューしてください";
            notificationLink = "/guide/review";
        }
    }

    return (
        <div>
            <Menubar className={styles.header}>
                <MenubarMenu>
                    <MenubarTrigger style={{ padding:0 }}>
                    <Link href={logoLink}>
                            <div className={styles.logoContainer}>
                                <div className={styles.logoBox}>
                                    <Image
                                        src="/logo_3.png"
                                        alt="Logo"
                                        objectFit="contain"
                                        className={styles.logo}
                                        onClick={() => router.push(logoLink)}
                                        height={175}
                                        width={754}
                                    />
                                </div>
                                <p className={styles.logoText}>{logoText}</p>
                            </div>
                        </Link>
                    </MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger style={{ paddingTop:10 }}>
                    <Link href={changeLink}>
                                <p style={{ margin:0 }}><small>Change<br/>{changeText}</small></p>
                    </Link>
                    </MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                    <UserMenu
                        userData={userData}
                        handleLogout={handleLogout}
                    />
                </MenubarMenu>
            </Menubar>
            {notificationText && (
                <div className="text-center bg-muted">
                    <Link href={notificationLink}>
                        {notificationText}
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Header;
