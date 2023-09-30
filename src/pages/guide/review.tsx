import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import * as React from "react"
import { cn } from "@/lib/utils"
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { utils } from '../../utils/utils';
import { Check, ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    BookingStatus,
    LanguageLevel,
    UserType,
    UserStatus,
    UserData,
    GuestData,
    GuideData,
    BookingData,
    PageProps,
  } from '../../types/types';

function Review({ isLoggedIn, userData }: PageProps): JSX.Element | null {
    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

// <-- ---------- 定数の定義 ---------- -->

    const reviewSchema = z.object({
        rating: z.number().min(1),
        content: z.string().optional(),
    });
    const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

// <-- ---------- useEffect ---------- -->

    useEffect(() => {

        const fetchBookingData = async () => {
            try {
                const securedAxios = createSecuredAxiosInstance();
                const response = await securedAxios.get(`/api/user/current/last-booking`);
                setBookingData(response.data.data);
                // booking_statusがfinished以外の時は/にリダイレクト
                // ここばbookingData.booking_statusではない、userData.booking_statusを使う
                if (userData && userData.booking_status !== BookingStatus.Finished) {
                    router.push('/');
                }
            } catch (error) {
                console.error('Failed to fetch booking data', error);
            } finally {
                setIsLoading(false); // データフェッチ後にローディングステートをfalseに設定
            }
        }
        fetchBookingData();
    },[]);

    // <-- ---------- 関数の定義 ---------- -->

    const form = useForm({
        resolver: zodResolver(reviewSchema),
         defaultValues: {
            rating: 5,
            content: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof reviewSchema>) => {
        try {
            if (bookingData) {
                const bookingId = bookingData.id;
                const axiosInstance = createSecuredAxiosInstance();

                // フォームから取得したデータに、追加のデータをマージ
                const postData = {
                    ...data,
                    booking_id: bookingId,
                };

                // マージしたデータをPOSTリクエストのボディとして送信
                const response = await axiosInstance.post(`/api/bookings/${bookingId}/reviews/guide`, postData);
                console.log(response);
                // 予約が成功したら、適切なページにリダイレクトするなどの処理を行う
                router.push('/');
            } else {
                console.error("Booking data is not available.");
            }
        } catch (error) {
            console.error("Review Error:", error);
            // エラーハンドリングの処理を行う
        }
    };

// <-- ---------- 表示 ---------- -->

    if (isLoading) {
        return <div>Loading...</div>; // ここで適切なローディングコンポーネントを返す
    }

    return (
        <>  <h2>Thank you so much!!<br/>Have a Best Day!</h2>
            <div className="flex flex-col items-center justify-content-between">
            <Image
                src={bookingData?.guest_image || '/image/user.jpeg'}
                alt="guest_image"
                width={200}
                height={200}
                className="rounded-full"
            />
                <p>{bookingData?.guest_first_name} {bookingData?.guest_last_name}</p>
            </div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Value（Max:5）</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "w-[200px] justify-between",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value || "Select a Value"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandGroup>
                                {Array.from({ length: 5 }, (_, i) => i + 1).map((number) => (
                                    <CommandItem
                                    value={number.toString()}
                                    key={number}
                                    onSelect={() => {
                                        form.setValue("rating", number)
                                    }}
                                    >
                                    <Check
                                        className={cn(
                                        "mr-2 h-4 w-4",
                                        number === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                    />
                                    {number}
                                    </CommandItem>
                                ))}
                                </CommandGroup>
                            </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Review Comment</FormLabel>
                        <FormControl>
                        <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="">
                    <div className="flex flex-col items-center justify-content-between">
                        <div>
                            <h3>Total amount</h3>
                            <p><small>Inclusive of tax</small></p>
                        </div>
                        <p className='bold'>¥{bookingData?.total_amount}</p>
                    </div>
                    <p><small>Include yourself in the total count, excluding children aged 12 and below.</small></p>
                </div>
                <Button type="submit">Complete</Button>
            </form>
        </Form>
        </>
    );
}

export default Review;