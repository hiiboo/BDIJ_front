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
    Native = 'native',
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
    Female = 'female',
    Other = 'other',
}

export interface UserData {
    id: number;
    user_type: UserType;
    booking_status?: BookingStatus | null;
    status: UserStatus;
    profile_image?: string;
    guide_reviewed?: boolean;
    guest_reviewed?: boolean;
}

export interface GuestData {
    id: number;
    profile_image?: string;
    first_name?: string;
    last_name?: string;
    created_at?: Date;
    review_average?: number;
    review_count?: number;
}

export interface GuideData {
    id: number;
    profile_image?: string;
    first_name?: string;
    last_name?: string;
    gender?: Gender;
    level?: LanguageLevel;
    introduction?: string;
    birthday?: Date;
    status?: UserStatus;
    hourly_rate?: number;
    review_average?: number;
    review_count?: number;
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
    start_time?: string;
    end_time?: string;
    total_guests?: number;
    comment?: string;
    created_at?: Date;
    status?: BookingStatus;
    total_amount?: number;
}

export interface PageProps {
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