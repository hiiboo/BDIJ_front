import React, {useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { utils } from '../utils/utils';
import styles from '../styles/reservationForm.module.scss';

// <-- ---------- enum ---------- -->

enum LanguageLevel {
    Beginner,
    Elementary,
    Intermediate,
    UpperIntermediate,
    Advanced,
    Proficiency,
}

enum IsActive {
    active,
    inactive,
}

enum BookingStatus {
    OfferPending,
    Accepted,
    Started,
    Finished,
    Reviewed,
    Cancelled,
}

// <-- ---------- interface ---------- -->

interface userData {
    id: number;
    user_type: string;
    lastBookingStatus: BookingStatus | null;
    status: string;
}

interface GuideData {
    id: number;
    profile_image?: string;
    firstName: string;
    lastName: string;
    language_level: LanguageLevel;
    introduction: string;
    birthday: Date;
    status: IsActive;
    hourly_rate: number;
    review_rate: number;
    review_sum: number;
    latitude?: number;
    longitude?: number;
    created_at: Date;
}
interface PageProps {
    isLoggedIn: boolean;
    userData?: userData;
    GuideData: GuideData;
}

const OfferForm: React.FC<PageProps> = ({ isLoggedIn, userData, GuideData }) => {

// <-- ---------- 定数の定義 ---------- -->

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const reservationSchema = z.object({
        startDate: z.string(),
        startTime: z.string(),
        endDate: z.string(),
        endTime: z.string(),
        total_guest: z.number().min(1),
        comment: z.string().optional(),
    });
    const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

// <-- ---------- 関数の定義 ---------- -->

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };
    const todayStr = formatDate(today);
    const tomorrowStr = formatDate(tomorrow);
    // useForm フックは一度だけ呼び出す
    const form = useForm({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            startDate: todayStr,
            startTime: '',
            endDate: todayStr,
            endTime: '',
            total_guest: 1,
            comment: '',
        },
    });

    // setValue, watch, handleSubmit を同じ useForm インスタンスから取得する
    const { setValue, watch, handleSubmit } = form;

    // startDateとendDateの変更を監視
    const startDate = watch("startDate");
    const endDate = watch("endDate");
    const startTime = watch("startTime");
    const endTime = watch("endTime");

    // 開始時刻が終了時刻より後である場合、または開始日と終了日が一致しない場合、
    // エラーメッセージを表示し、サブミットボタンを無効化
    const invalidTime = startTime >= endTime;
    const invalidDate = startDate !== endDate;

    // サブミットボタンの有効・無効を管理
    const isSubmitDisabled = invalidTime || invalidDate;

    const calculateTotalAmount = () => {
        // フォームからの値を監視
        const totalGuest = watch("total_guest");

        // startDate と startTime を組み合わせて、開始時刻の Date オブジェクトを作成
        const startDateTimeStr = `${startDate}T${startTime}`;
        const start = new Date(startDateTimeStr);

        // endDate と endTime を組み合わせて、終了時刻の Date オブジェクトを作成
        const endDateTimeStr = `${endDate}T${endTime}`;
        const end = new Date(endDateTimeStr);

        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        const baseAmount = GuideData.hourly_rate * hours;

        if (totalGuest > 1) {
            return baseAmount * totalGuest * 0.75;
        } else {
            return baseAmount;
        }
    };

    const onSubmit = (data: z.infer<typeof reservationSchema>) => {
        // GuideDataからhourly_rateを取得し、dataオブジェクトに追加
        const dataWithHourlyRate = {
            ...data,
            hourly_rate: GuideData.hourly_rate,
            guide_id: GuideData.id
        };

        if (isLoggedIn) {
            if (userData?.user_type === 'guide') {
                alert('ガイドは予約できません。');
            } else {
                router.push({
                    pathname: '/guest/offer/confirmation',
                    query: dataWithHourlyRate,
                });
            }
        } else {
            router.push({
                pathname: '/guest/auth',
                query: dataWithHourlyRate,
            });
        }
    };

// <-- ---------- 表示 ---------- -->

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className={styles.dateTimeRow}>
        <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
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
                        {field.value
                            ? `${field.value === todayStr ? 'Today' : 'Tomorrow'} ${new Date(field.value).toLocaleDateString()}`
                            : "Select a date"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandGroup>
                        {[{ label: `Today ${today.toLocaleDateString()}`, value: todayStr }, { label: `Tomorrow ${tomorrow.toLocaleDateString()}`, value: tomorrowStr }].map((date) => (
                            <CommandItem
                            value={date.label}
                            key={date.value}
                            onSelect={() => {
                                form.setValue("startDate", date.value)
                            }}
                            >
                            <Check
                                className={cn(
                                "mr-2 h-4 w-4",
                                date.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                            />
                            {date.label}
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
                name="startTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                        <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <div className={styles.dateTimeRow}>
        <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
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
                        {field.value
                            ? `${field.value === todayStr ? 'Today' : 'Tomorrow'} ${new Date(field.value).toLocaleDateString()}`
                            : "Select a date"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandGroup>
                        {[{ label: `Today ${today.toLocaleDateString()}`, value: todayStr }, { label: `Tomorrow ${tomorrow.toLocaleDateString()}`, value: tomorrowStr }].map((date) => (
                            <CommandItem
                            value={date.label}
                            key={date.value}
                            onSelect={() => {
                                form.setValue("endDate", date.value)
                            }}
                            >
                            <Check
                                className={cn(
                                "mr-2 h-4 w-4",
                                date.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                            />
                            {date.label}
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
            name="endTime"
            render={({ field }) => (
                <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                    <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        </div>
        <div>
        <FormField
            control={form.control}
            name="total_guest"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Guest</FormLabel>
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
                        {field.value || "select a number"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandGroup>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
                            <CommandItem
                            value={number.toString()}
                            key={number}
                            onSelect={() => {
                                form.setValue("total_guest", number)
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
        <p><small>Please include yourself in the total count, excluding children aged 12 and below.In the case of two or more people, each additional person is calculated at a 25% discounted rate.</small></p>
        </div>
        <div className="">
            <div className="flex flex-col items-center justify-content-between">
                <div>
                    <h3>Total amount</h3>
                    <p><small>Inclusive of tax</small></p>
                </div>
                <p className='bold'>¥{calculateTotalAmount().toLocaleString()}</p>
            </div>
            <p><small>Include yourself in the total count, excluding children aged 12 and below.</small></p>
        </div>
      <FormField
        control={form.control}
        name="comment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>comment</FormLabel>
            <FormControl>
              <Input type="text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
        {invalidTime && <div className="text-red-500">End time should be set after the start time.</div>}
        {invalidDate && <div className="text-red-500">The end date should be set to the same date as the start date.</div>}
        <Button type="submit" disabled={isSubmitDisabled}>Next</Button>
    </form>
  </Form>
  );
};

export default OfferForm;

