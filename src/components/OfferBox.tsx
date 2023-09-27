import React, { useEffect, useState } from 'react';
import styles from '../styles/offerInformation.module.scss';
import { utils } from '../utils/utils';
import Link from 'next/link';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// <-- ---------- enum ---------- -->

enum BookingStatus {
    OfferPending,
    Accepted,
    Started,
    Finished,
    Reviewed,
    Cancelled,
}

// <-- ---------- interface ---------- -->

interface PageProps {
    isLoggedIn: boolean;
    userData?: any;
    offers?: BookingData[];
}

interface BookingData {
    id: number;
    guide_id: number;
    guide_firstName?: string;
    guide_lastName?: string;
    guide_image?: string;
    guest_id: number;
    guest_firstName?: string;
    guest_lastName?: string;
    guest_image?: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    hourly_rate: number;
    comment: string;
    created_at: Date;
    booking_status: BookingStatus;
}

function OfferBox({ isLoggedIn, userData, offers }: PageProps): JSX.Element | null {

// <-- ---------- 定数の定義 ---------- -->
    const { user_type } = userData;
 // <-- ---------- 表示 ---------- -->

    return (
        <div>
            <div className="p-4">
                <h2 className="mb-2">OfferBox</h2>
                {offers?.map(offer => (
                <div key={offer.id}>
                    <Separator className="my-2" />
                    <Link href={`/${user_type}/offer/${offer.id}`}>
                        <a className="flex items-center justify-between space-x-4">
                            <div className="flex items-center space-x-4">
                                <Avatar>
                                    <AvatarImage src={user_type === 'guest' ? offer.guide_image : offer.guest_image} />
                                    <AvatarFallback>{(user_type === 'guest' ? offer.guide_firstName : offer.guest_firstName) || 'N/A'} {(user_type === 'guest' ? offer.guide_lastName : offer.guest_lastName) || 'N/A'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium leading-none m-2">{(user_type === 'guest' ? offer.guide_firstName : offer.guest_firstName) || 'N/A'}{(user_type === 'guest' ? offer.guide_lastName : offer.guest_lastName) || 'N/A'}</p>
                                    <p className="text-sm text-muted-foreground m-2">{BookingStatus[offer.booking_status]}</p>
                                </div>
                            </div>
                            <div className={styles.offerBox}>
                                <p className="text-sm text-muted-foreground m-2">
                                {`${offer.startDate} ${offer.startTime} - ${offer.endDate} ${offer.endTime}`}
                                </p>
                            </div>
                        </a>
                    </Link>
                </div>
                ))}
            </div>
        </div>
    );
};

export default OfferBox;
