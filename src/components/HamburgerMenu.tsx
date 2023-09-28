import React from 'react';
import { PiUserCircle } from 'react-icons/pi';
import { MdClose } from 'react-icons/md';
import styles from '../styles/header.module.scss';
import Link from 'next/link';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/shadcnui/menubar"

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

const HamburgerMenu: React.FC<PageProps> = ({ isLoggedIn, userData, handleLogout }) => {
    return (
        <>
            <MenubarTrigger className={styles.hamburger} style={{ padding:0 }}>
                <PiUserCircle size="2rem" />
            </MenubarTrigger>
            <MenubarContent>
            <MenubarItem onClick={handleLogout}>ログアウト</MenubarItem>
                {isLoggedIn ? (
                    <>
                        <MenubarItem onClick={handleLogout}>ログアウト</MenubarItem>
                        <MenubarSeparator />
                        <Link href="/profile">
                            <MenubarItem>プロフィール</MenubarItem>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/login">
                            <MenubarItem>ログイン</MenubarItem>
                        </Link>
                        <MenubarSeparator />
                        <Link href="/register">
                            <MenubarItem>新規登録</MenubarItem>
                        </Link>
                    </>
                )}
            </MenubarContent>
        </>
    );
}

export default HamburgerMenu;
