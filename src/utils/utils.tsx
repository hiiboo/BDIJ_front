import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';

export const utils = () => {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const createSecuredAxiosInstance = () => axios.create({
        baseURL: apiUrl,
        withCredentials: true,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        }
    });

    const formatDateToCustom = (dateString: string): string => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    };

    return {
        router,
        apiUrl,
        createSecuredAxiosInstance,
        formatDateToCustom
    };
};

export function extractDateAndTime(startTime: Date, endTime: Date) {
    // 日付と時刻をフォーマットする
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0]; // YYYY-MM-DD 形式
    };

    const formatTime = (date: Date) => {
      return date.toISOString().split('T')[1].split(':').slice(0, 2).join(':'); // HH:mm 形式
    };

    return {
        startDate: formatDate(startTime),
        startTime: formatTime(startTime),
        endDate: formatDate(endTime),
        endTime: formatTime(endTime),
    };
}

export function constructDateTime(startDate: string, startTime: string, endDate: string, endTime: string) {
    // 日付と時刻を結合して Date オブジェクトを作成
    const startDateTime = new Date(`${startDate}T${startTime}:00`); // YYYY-MM-DDTHH:mm:ss 形式
    const endDateTime = new Date(`${endDate}T${endTime}:00`);

    return {
        start_time: startDateTime,
        end_time: endDateTime,
    };
}