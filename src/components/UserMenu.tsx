import React from 'react';
import { MdMenu} from 'react-icons/md';
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

const UserMenu: React.FC<PageProps> = ({ isLoggedIn, userData }) => {
    return (
        <>
            <MenubarTrigger className={styles.icon} style={{ padding:0 }}>
                <MdMenu size="2rem" />
            </MenubarTrigger>
            <MenubarContent>
                {isLoggedIn ? (
                    <>
                        <Link href="/event/management">
                            <MenubarItem>イベントを管理する</MenubarItem>
                        </Link>
                        <Link href="/event/list">
                            <MenubarItem>イベントを閲覧する</MenubarItem>
                        </Link>
                        <MenubarSeparator />
                        <Link href="/article/management">
                            <MenubarItem>記事を管理する</MenubarItem>
                        </Link>
                        <Link href="/article/list">
                            <MenubarItem>記事を閲覧する</MenubarItem>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/event/list">
                            <MenubarItem>イベントを閲覧する</MenubarItem>
                        </Link>
                        <MenubarSeparator />
                        <Link href="/article/list">
                            <MenubarItem>記事を閲覧する</MenubarItem>
                        </Link>
                    </>
                )}
            </MenubarContent>
        </>
    );
}

export default UserMenu;