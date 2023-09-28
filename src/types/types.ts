// types.ts

export enum BookingStatus {
    OfferPending = 'offer-pending',
    Accepted = 'accepted',
    Started = 'started',
    Finished = 'finished',
    Reviewed = 'reviewed',
    Cancelled = 'cancelled',
}

export enum LanguageLevel {
    Beginner = 'beginner',
    Elementary = 'elementary',
    Intermediate = 'intermediate',
    UpperIntermediate = 'upper_intermediate',
    Advanced = 'advanced',
    Proficiency = 'proficiency',
}

export enum UserType {
    Guest = 'guest',
    Guide = 'guide',
}

export enum UserStatus {
    Active = 'active',
    Inactive = 'inactive',
}

export enum Gender {
    Male = 'male',
    Famale = 'famale',
    Other = 'other',
}

export interface UserData {
    id: number;
    user_type: UserType;
    booking_status?: BookingStatus | null;
    status: UserStatus;
}

export interface GuestData {
    id: number;
    profile_image?: string;
    first_name?: string;
    last_name?: string;
    created_at?: Date;
}

export interface GuideData {
    id: number;
    profile_image?: string;
    first_name?: string;
    last_name?: string;
    gender?: Gender;
    language_level?: LanguageLevel;
    introduction?: string;
    birthday?: Date;
    status?: UserStatus;
    hourly_rate?: number;
    review_rate?: number; //名前が不安
    review_sum?: number; //名前が不安
    latitude?: number;
    longitude?: number;
    created_at?: Date;
}

export interface BookingData {
    id: number;
    guide_id?: number;
    guide_first_name?: string;
    guide_last_name?: string;
    guide_image?: string;
    guest_id?: number;
    guest_first_name?: string;
    guest_last_name?: string;
    guest_image?: string;
    start_time?: Date;
    end_time?: Date;
    total_guest?: number;
    comment?: string;
    created_at?: Date;
    booking_status?: BookingStatus;
    total_amount?: number;
}

export interface PageProps {
    isLoggedIn: boolean;
    userData?: UserData | null;
    guideData?: GuideData | null;
    guestData?: GuestData | null;
    bookingData?: BookingData | null;
    offers?: BookingData[];
    handleLogout?: () => void;
}

export interface Review {
    id: number;
    user_id: number;
    guide_id: number;
    rating: number;
    comment: string;
    created_at: string;
    updated_at: string;
}

export interface SecuredUserData {
    id: number;
    password: string;
}