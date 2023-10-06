import React from 'react';
import { PiUserCircle } from 'react-icons/pi';
import styles from '../styles/header.module.scss';
import Link from 'next/link';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/shadcnui/menubar"
import {
    UserType,
    PageProps
} from '../types/types';

const UserMenu: React.FC<PageProps> = ({ userData, handleLogout }) => {
    const userTypePath = userData?.user_type === UserType.Guide ? 'guide' : 'guest';

    return (
        <>
            <MenubarTrigger className={styles.hamburger} style={{ padding: 0 }}>
                <PiUserCircle size="2rem" />
            </MenubarTrigger>
            <MenubarContent>
                {userData ? (
                    <>
                        <MenubarItem onClick={handleLogout}>ログアウト</MenubarItem>
                        <MenubarSeparator />
                        <Link href={`/${userTypePath}/mypage`}>
                            <MenubarItem>プロフィール</MenubarItem>
                        </Link>
                        <Link href={`/${userTypePath}/offer/box`}>
                            <MenubarItem>オファーボックス</MenubarItem>
                        </Link>
                    </>
                ) : (
                    <>
                        <MenubarItem onClick={handleLogout}>ログアウト</MenubarItem>
                        <Link href={`/${userTypePath}/auth`}>
                            <MenubarItem>ログイン・登録</MenubarItem>
                        </Link>
                    </>
                )}
            </MenubarContent>
        </>
    );
}

export default UserMenu;
