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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
    UserType,
    PageProps
} from '../types/types';

const UserMenu: React.FC<PageProps> = ({ userData, handleLogout }) => {
    const userTypePath = userData?.user_type === UserType.Guide ? 'guide' : 'guest';

    return (
      <>
        <MenubarTrigger className={styles.hamburger} style={{ padding: 0 }}>
          {userData ? (
            <>
                <PiUserCircle size="2rem" />
            </>
          ) : (
            <>
                <Avatar>
                <AvatarImage src={userData.profile_image ? `${process.env.NEXT_PUBLIC_API_URL}${userData.profile_image}` : '/logo.png'} />
                <AvatarFallback>
                    {(user_type === 'guest' ? offer.guide_first_name : offer.guest_first_name) || 'N/A'}
                    {(user_type === 'guest' ? offer.guide_last_name : offer.guest_last_name) || 'N/A'}
                </AvatarFallback>
                </Avatar>
            </>
          )}
        </MenubarTrigger>
        <MenubarContent>
          {userData ? (
            <>
              <MenubarItem onClick={handleLogout}>Log Out</MenubarItem>
              <MenubarSeparator />
              <Link href={`/${userTypePath}/mypage`}>
                <MenubarItem>Profile</MenubarItem>
              </Link>
              <Link href={`/${userTypePath}/offer/box`}>
                <MenubarItem>Offer Box</MenubarItem>
              </Link>
            </>
          ) : (
            <>
              <MenubarItem onClick={handleLogout}>Log Out</MenubarItem>
              <Link href={`/${userTypePath}/auth`}>
                <MenubarItem>Login / Register</MenubarItem>
              </Link>
            </>
          )}
        </MenubarContent>
      </>
    );
}

export default UserMenu;
