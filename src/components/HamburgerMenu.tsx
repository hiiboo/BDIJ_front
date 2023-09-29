import React from 'react';
import { MdMenu } from 'react-icons/md';
import styles from '../styles/header.module.scss';
import Link from 'next/link';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/shadcnui/menubar"
import {
    UserType,
    PageProps
} from '../types/types';

const HamburgerMenu: React.FC<PageProps> = ({ isLoggedIn, userData }) => {
    const userTypePath = userData?.user_type === UserType.Guide ? 'guide' : 'guest';

    return (
        <>
            <MenubarTrigger className={styles.icon} style={{ padding: 0 }}>
                <MdMenu size="2rem" />
            </MenubarTrigger>
            <MenubarContent>
                <Link href={`/${userTypePath}/mypage`}>
                    <MenubarItem>トップに戻る</MenubarItem>
                </Link>
                <Link href={`/${userTypePath}/offer/box`}>
                    <MenubarItem>オファーボックス</MenubarItem>
                </Link>
            </MenubarContent>
        </>
    );
}

export default HamburgerMenu;