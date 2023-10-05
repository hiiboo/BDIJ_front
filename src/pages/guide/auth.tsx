import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "../../components/Icons"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import styles from '../../styles/admin.module.scss';
import { uploadImage } from '../../utils/uploadImage';
import { utils } from '../../utils/utils';
import {
    BookingStatus,
    LanguageLevel,
    Gender,
    UserType,
    UserStatus,
    UserData,
    GuestData,
    GuideData,
    PageProps
} from '../../types/types';

function GuideAuth(): JSX.Element {

// <-- ---------- useState ---------- -->

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconUrl, setIconUrl] = useState<string | null>(null);
    const [birthday, setBirthday] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [languageLevel, setLanguageLevel] = useState<string>('');
    const [introduction, setIntroduction] = useState<string>('');
    const [hourlyRate, setHourlyRate] = useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [showFirstCard, setShowFirstCard] = useState<boolean>(true);
    const [showSecondCard, setShowSecondCard] = useState<boolean>(false);

    const [isLocationEnabled, setIsLocationEnabled] = useState(false);

// <-- ---------- 定数の定義 ---------- -->

    const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
    const router = useRouter();

    // デフォルトのタブを決定
    let defaultTab = "signup";
    if (typeof router.query.tab === 'string') {
        defaultTab = router.query.tab;
    }

// <-- ---------- 関数の定義 ---------- -->

    // const fetchCsrfToken = async () => {
    //     try {
    //         await axios.get(`${apiUrl}/sanctum/csrf-cookie`);
    //     } catch (error) {
    //         console.error("Error fetching CSRF token", error);
    //     }
    // };

    const handleRegister = async () => {
        try {
            console.log(email);
            console.log(password);
            console.log(firstName);
            console.log(lastName);
            console.log(iconUrl);
            console.log(birthday);
            console.log(gender);
            console.log(languageLevel);
            console.log(introduction);
            console.log(hourlyRate);

            // CSRFトークンを取得
            // await fetchCsrfToken();
            const registerData = {
                email,
                password,
                password_confirmation: passwordConfirmation,
                first_name: firstName,
                last_name: lastName,
                profile_image: iconUrl,
                birthday,
                gender: gender || Gender.Other,
                level: languageLevel || LanguageLevel.Beginner,
                introduction,
                hourly_rate: hourlyRate,
                user_type: UserType.Guide,
            }
            console.log(registerData);
            const response = await axios.post(`${apiUrl}/auth/guide/register`, {
                email,
                password,
                password_confirmation: passwordConfirmation,
                first_name: firstName,
                last_name: lastName,
                profile_image: iconUrl,
                birthday,
                gender: gender || Gender.Other,
                level: languageLevel || LanguageLevel.Beginner,
                introduction,
                hourly_rate: hourlyRate,
                user_type: UserType.Guide,
            }, {
                withCredentials: true
            });
            console.log(response);
            // 登録が成功したら、トップページにリダイレクト
            if (response.status === 200 && response.data.message === "Registration successful") {
                localStorage.setItem('user_token', response.data.token);
                console.log("Register successfully");
                await handleRegisterLogin();
            } else {
                // ログイン失敗
                alert(`Registration failed, ${response.data.message}`);
                console.error("Registration failed", response.data.message);
                router.push('/').then(() => window.location.reload());
            }
        } catch (error) {
            console.error("Registration error", error);
            alert(`Registration failed, ${error}`);
        }
    };

    const handleRegisterLogin = async () => {
        try {
            console.log(email);
            console.log(password);
            // CSRF cookieを取得
            // await axios.get(`${apiUrl}/sanctum/csrf-cookie`, {
            //     withCredentials: true
            // });
            // console.log("CSRF cookie set successfully");
            // ログインリクエストを送信
            const response = await axios.post(`${apiUrl}/auth/user/login`, {
                email,
                password,
            }, {
                withCredentials: true
            });
            console.log(response);
            if (response.status === 200 && response.data.message === "Login successful") {
                // ログイン成功
                localStorage.setItem('user_token', response.data.token);
                router.push('/guide/mypage').then(() => window.location.reload());
                alert('Register & Login successful');
            } else {
                // ログイン失敗
                alert(`Login failed, ${response.data.message}`);
                console.error("Login failed", response.data.message);
                router.push('/').then(() => window.location.reload());
            }
        } catch (error) {
            alert(`Login failed, ${error}`);
            console.error("Login error", error);
        }
    };

    const handleLogin = async () => {
        try {
            console.log(email);
            console.log(password);
            // CSRF cookieを取得
            // await axios.get(`${apiUrl}/sanctum/csrf-cookie`, {
            //     withCredentials: true
            // });
            // console.log("CSRF cookie set successfully");
            // ログインリクエストを送信
            const response = await axios.post(`${apiUrl}/auth/user/login`, {
                email,
                password,
            }, {
                withCredentials: true
            });
            console.log(response);
            if (response.status === 200 && response.data.message === "Login successful") {
                // ログイン成功
                localStorage.setItem('user_token', response.data.token);
                router.push('/guide/mypage').then(() => window.location.reload());
                alert('Login successful');
            } else {
                // ログイン失敗
                alert(`Login failed, ${response.data.message}`);
                console.error("Login failed", response.data.message);
                router.push('/').then(() => window.location.reload());
            }
        } catch (error) {
            alert(`Login failed, ${error}`);
            console.error("Login error", error);
        }
    };

    const handleLocationToggle = () => {
      if (!isLocationEnabled) {
        navigator.geolocation.getCurrentPosition(
          () => setIsLocationEnabled(true),
          (error) => console.error("Location permission denied", error)
        );
      } else {
        setIsLocationEnabled(false);
      }
    };

    // ボタンがクリックされたときの処理
    const handleFirstCardButtonClick = () => {
        setShowFirstCard(false); // 1枚目のカードを非表示
        setShowSecondCard(true); // 2枚目のカードを表示
    };

    const onIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile) {
            setIconFile(uploadedFile);
        }
    };

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)

        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    }

// <-- ---------- useEffect ---------- -->

    useEffect(() => {
        // コンポーネントがマウントされた時に位置情報の許可を確認
        navigator.geolocation.getCurrentPosition(
        () => setIsLocationEnabled(true), // 位置情報へのアクセスが許可されている
        () => setIsLocationEnabled(false) // 位置情報へのアクセスが拒否されている
        );
    }, []);

    useEffect(() => {
        if (iconFile) {
            (async () => {
                const response = await uploadImage(iconFile);
                if (response?.path) {
                    setIconUrl(response.path);
                }
            })();
        }
    }, [iconFile]);

    useEffect(() => {
        const fetchIcon = async () => {
            try {
                const securedAxios = createSecuredAxiosInstance();
                const response = await securedAxios.get(`/api/guide/profile_image`, {
                    withCredentials: true
                });
                setIconUrl(response.data.url);
            } catch (error) {
                console.error("Error fetching icon URL", error);
            }
        };

        fetchIcon();
    }, []);

    const isPasswordShort = password.length < 8;
    const isPasswordDiffernt = password !== passwordConfirmation;

    const isShortOfInfoRegisterFirst = !email || !password || !passwordConfirmation;

    // サブミットボタンの有効・無効を管理
    const isSubmitDisabledRegisterFirst = isPasswordShort || isPasswordDiffernt || isShortOfInfoRegisterFirst;
    const isSubmitDisabledRegisterSecond = !firstName || !lastName || !birthday || !gender || !languageLevel || !introduction || !hourlyRate;

    const isShortOfInfoLogin = !email || !password;
    const isSubmitDisabledLogin = isPasswordShort || isShortOfInfoLogin;


    return (
        <main className={styles.main}>
            <h2 className='my-2 py-2'>ガイド登録・ログイン</h2>
            <Tabs defaultValue={defaultTab} className="w-100">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">Signup</TabsTrigger>
                    <TabsTrigger value="login">LogIn</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                    {showFirstCard && (
                        <Card>
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xll my-2">Create an account</CardTitle>
                                <CardDescription>
                                Enter your email below to create your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {/* <div className="grid grid-cols-2 gap-6">
                                <Button variant="outline">
                                    <Icons.twitter className="mr-2 h-4 w-4" />
                                    Twitter
                                </Button>
                                <Button variant="outline">
                                    <Icons.google className="mr-2 h-4 w-4" />
                                    Google
                                </Button>
                                </div>
                                <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                    </span>
                                </div>
                                </div> */}
                                <form onSubmit={onSubmit}>
                                    <div className="grid gap-2 mt-2 mb-8">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            placeholder="name@example.com"
                                            type="email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2 mt-2 mb-8">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            placeholder="Password"
                                            type="password"
                                            autoCapitalize="none"
                                            autoComplete="password"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground my-0">
                                            Password must be at least 8 characters long.
                                        </p>
                                    </div>
                                    <div className="grid gap-2 mt-2 mb-8">
                                        <Label htmlFor="password">Confirm Password</Label>
                                        <Input
                                            id="password"
                                            placeholder="Confirm Password"
                                            type="password"
                                            autoCapitalize="none"
                                            autoComplete="password"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            value={passwordConfirmation}
                                            onChange={e => setPasswordConfirmation(e.target.value)}
                                        />
                                    </div>
                                    {isPasswordShort && <div className="text-red-500 text-xs">Password must be at least 8 characters long.</div>}
                                    {isPasswordDiffernt && <div className="text-red-500 text-xs">Something wrong with confirm password.</div>}
                                    {isShortOfInfoRegisterFirst && <div className="text-red-500 text-xs">Enter your email and password.</div>}
                                    <Button className="w-full my-4" disabled={isLoading || isSubmitDisabledRegisterFirst} onClick={handleFirstCardButtonClick}>
                                        {isLoading && (
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Sign up with Email
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                    {showSecondCard && (
                        <Card>
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl my-2">Create an account</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <form onSubmit={onSubmit}>
                                    <div className="grid gap-2 mt-2 mb-8">
                                        <Label htmlFor="firstname">First Name</Label>
                                        <Input
                                            id="firstname"
                                            placeholder="First Name"
                                            type="text"
                                            autoCapitalize="none"
                                            autoComplete="firstname"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2 mt-2 mb-8">
                                        <Label htmlFor="lastname">Last Name</Label>
                                        <Input
                                            id="lastname"
                                            placeholder="Last Name"
                                            type="text"
                                            autoCapitalize="none"
                                            autoComplete="lastname"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2 mt-2 mb-8">
                                        <Label htmlFor="picture">Icon</Label>
                                        <Input
                                            id="icon"
                                            type="file"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            onChange={onIconChange}
                                        />
                                    </div>
                                    <div className="grid gap-2 mt-2 mb-8">
                                        <Label htmlFor="birthday">Birthday</Label>
                                        <Input
                                            id="birthday"
                                            type="date"
                                            disabled={isLoading}
                                            value={birthday}
                                            onChange={e => setBirthday(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2 mt-2 mb-8">
                                        <Label htmlFor="gender">Gender</Label>
                                        <select
                                            id="gender"
                                            value={gender}
                                            onChange={e => setGender(e.target.value)}
                                            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                        >
                                            <option className='text-muted' value="" disabled hidden>（Select Your Gender）</option>
                                            <option value={Gender.Male}>Male</option>
                                            <option value={Gender.Female}>Female</option>
                                            <option value={Gender.Other}>Other</option>
                                        </select>
                                    </div>
                                    <div className="grid gap-2 mt-2 mb-8">
                                        <Label htmlFor="languageLevel">Available Languages</Label>
                                        <select
                                            id="languageLevel"
                                            value={languageLevel}
                                            onChange={e => setLanguageLevel(e.target.value)}
                                            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                        >
                                            <option value="" disabled hidden>（Select Your English Level）</option>
                                            <option value={LanguageLevel.Beginner}>Beginner</option>
                                            <option value={LanguageLevel.Elementary}>Elementary</option>
                                            <option value={LanguageLevel.Intermediate}>Intermediate</option>
                                            <option value={LanguageLevel.UpperIntermediate}>UpperIntermediate</option>
                                            <option value={LanguageLevel.Advanced}>Advanced</option>
                                            <option value={LanguageLevel.Proficiency}>Proficiency</option>
                                        </select>
                                    </div>
                                    <div className="grid gap-2 mt-2 mb-8">
                                        <Label htmlFor="introduction">Introduction</Label>
                                        <textarea
                                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            id="introduction"
                                            placeholder='Please write a self-introduction. By sharing detailed information about yourself, your hobbies, and your profession, guests are more likely to reach out to you for requests!'
                                            disabled={isLoading}
                                            value={introduction}
                                            onChange={e => setIntroduction(e.target.value)}
                                            rows={6}
                                        >
                                            {introduction}
                                        </textarea>
                                    </div>
                                    <div className="grid gap-2 mt-2 mb-8">
                                        <Label htmlFor="hourlyRate">Hourly Rate (h/person)</Label>
                                        <div className="flex">
                                            <span className="mr-2 mt-2">￥</span>
                                            <Input
                                                id="hourlyRate"
                                                type="number"
                                                disabled={isLoading}
                                                value={hourlyRate}
                                                onChange={e => setHourlyRate(e.target.value)}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground my-0">
                                            more than 2,500yen.
                                        </p>
                                    </div>
                                    <div className="grid gap-2 mt-2 mb-8">
                                        <Label htmlFor="locationSwitch">Location</Label>
                                        <Switch
                                            id="locationSwitch"
                                            checked={isLocationEnabled}
                                            onCheckedChange={handleLocationToggle}
                                        />
                                    </div>
                                    {parseInt(hourlyRate) < 2500 && hourlyRate !== '' && (
                                        <div className="text-red-500 text-xs">
                                            Hourly Rate must be more than 2,500yen.
                                        </div>
                                    )}
                                    {isSubmitDisabledRegisterSecond && <div className="text-red-500 text-xs">Enter your information.</div>}
                                    <Button className="w-full my-4" disabled={isLoading || isSubmitDisabledRegisterSecond || (parseInt(hourlyRate) < 2500 && hourlyRate !== '')} onClick={handleRegister}>
                                        {isLoading && (
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Complete sign-up!
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
                <TabsContent value="login">
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl my-2">Login an account</CardTitle>
                            <CardDescription>
                            Enter your email below to login your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {/* <div className="grid grid-cols-2 gap-6">
                            <Button variant="outline">
                                <Icons.twitter className="mr-2 h-4 w-4" />
                                Twitter
                            </Button>
                            <Button variant="outline">
                                <Icons.google className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                            </div>
                            <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                                </span>
                            </div>
                            </div> */}
                            <form onSubmit={onSubmit}>
                                <div className="grid gap-2 mb-8">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2 mb-8">
                                <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        placeholder="Password"
                                        type="password"
                                        autoCapitalize="none"
                                        autoComplete="password"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground my-0">
                                        Password must be at least 8 characters long.
                                    </p>
                                </div>
                                {isPasswordShort && <div className="text-red-500 text-xs">Password must be at least 8 characters long.</div>}
                                {isShortOfInfoLogin && <div className="text-red-500 text-xs">Enter your email and password.</div>}
                                <Button className="w-full my-4" disabled={isLoading || isSubmitDisabledLogin} onClick={handleLogin}>
                                    {isLoading && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Log In with Email
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    );
}

export default GuideAuth;