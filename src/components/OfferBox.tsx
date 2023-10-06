import React, { useEffect, useState } from 'react';
import styles from '../styles/offerInformation.module.scss';
import { utils } from '../utils/utils';
import { extractDateAndTime } from '../utils/utils';
import Link from 'next/link';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
    BookingStatus,
    LanguageLevel,
    UserType,
    UserStatus,
    UserData,
    GuestData,
    GuideData,
    BookingData,
    PageProps
} from '../types/types';

function OfferBox({ userData, offers }: PageProps): JSX.Element | null {

// <-- ---------- 定数の定義 ---------- -->
    if (!userData) {
        return null;
    }
    const { user_type } = userData;
    const getBookingStatus = (status?: BookingStatus) => {
        switch (status) {
            case BookingStatus.OfferPending:
                return 'OfferPending';
            case BookingStatus.Accepted:
                return 'Accepted';
            case BookingStatus.Started:
                return 'Started';
            case BookingStatus.Finished:
                return 'Finished';
            case BookingStatus.Reviewed:
                return 'Reviewed';
            case BookingStatus.Cancelled:
                return 'Cancelled';
            default:
                return '';
        }
    };
    function isValidDate(d: any): d is Date {
        return d instanceof Date && !isNaN(d.getTime());
    }

    // offersを逆順にする
    const reversedOffers = [...(offers || [])].reverse();

    return (
        <div>
            <div className="p-4">
                <h2 className="mb-2">OfferBox</h2>
                {reversedOffers.map(offer => (
                    <div key={offer.id}>
                        <Separator className="my-2" />
                        <Link href={`/${user_type}/offer/info/${offer.id}`} className="flex items-center justify-between space-x-4">
                            <div className="flex items-center space-x-4">
                                <Avatar>
                                <AvatarImage src={user_type === 'guest' ? offer.guide_image : offer.guest_image} />
                                <AvatarFallback>
                                    {(user_type === 'guest' ? offer.guide_first_name : offer.guest_first_name) || 'N/A'}
                                    {(user_type === 'guest' ? offer.guide_last_name : offer.guest_last_name) || 'N/A'}
                                </AvatarFallback>
                                </Avatar>
                                <div>
                                <p className="text-sm font-medium leading-none m-2">
                                    {(user_type === 'guest' ? offer.guide_first_name : offer.guest_first_name) || 'N/A'}
                                    {(user_type === 'guest' ? offer.guide_last_name : offer.guest_last_name) || 'N/A'}
                                </p>
                                <p className="text-sm text-muted-foreground m-2">
                                    {offer.status !== undefined ? getBookingStatus(offer.status) : "Status Unknown"}
                                </p>
                                </div>
                            </div>
                            <div className={styles.offerBox}>
                                {
                                    (() => {
                                        let start_time: Date = new Date();
                                        let end_time: Date = new Date();

                                        if (offer && offer.start_time && offer.end_time) {
                                            start_time = new Date(offer.start_time);
                                            end_time = new Date(offer.end_time);
                                        } else {
                                            console.error('start_time or end_time is invalid or undefined in offer');
                                        }

                                        if (!isValidDate(start_time)) {
                                            alert('start_time is invalid');
                                        }

                                        if (!isValidDate(end_time)) {
                                            alert('end_time is invalid');
                                        }

                                        const startDate = extractDateAndTime(start_time, end_time).startDate;
                                        const startTime = extractDateAndTime(start_time, end_time).startTime;
                                        const endDate = extractDateAndTime(start_time, end_time).endDate;
                                        const endTime = extractDateAndTime(start_time, end_time).endTime;

                                        return (
                                            <p className="text-sm text-muted-foreground m-2">
                                                {`${startDate} ${startTime} - ${endDate} ${endTime}`}
                                            </p>
                                        );
                                    })()
                                }
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default OfferBox;
