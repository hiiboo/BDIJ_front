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
            'Authorization': `Bearer ${localStorage.getItem('organizer_token')}`
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
