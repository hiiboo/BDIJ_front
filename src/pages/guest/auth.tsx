import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/AuthContext'
import * as React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "../../components/Icons"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import styles from '../../styles/admin.module.scss';
import { uploadImage } from '../../utils/uploadImage';
import { utils } from '../../utils/utils';

function GuestAuth(): JSX.Element {

// <-- ---------- useState ---------- -->

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconUrl, setIconUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [showFirstCard, setShowFirstCard] = useState<boolean>(true);
    const [showSecondCard, setShowSecondCard] = useState<boolean>(false);

// <-- ---------- 定数の定義 ---------- -->

    const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
    const router = useRouter();
    const { checkAuth } = useAuth();

    // デフォルトのタブを決定
    let defaultTab = "signup";
    if (typeof router.query.tab === 'string') {
        defaultTab = router.query.tab;
    }

// <-- ---------- 関数の定義 ---------- -->

    const fetchCsrfToken = async () => {
        try {
            await axios.get(`${apiUrl}/sanctum/csrf-cookie`);
        } catch (error) {
            console.error("Error fetching CSRF token", error);
        }
    };

    const handleRegister = async () => {
        try {
            console.log(email);
            console.log(password);
            console.log(firstName);
            console.log(lastName);
            console.log(iconUrl);
            // CSRFトークンを取得
            await fetchCsrfToken();
            const response = await axios.post(`${apiUrl}/auth/guest/register`, {
                email,
                password,
                password_confirmation: passwordConfirmation,
                first_name: firstName,
                last_name: lastName,
                profile_image: iconUrl
            }, {
                withCredentials: true
            });
            console.log(response);
            // 登録が成功したら、トップページにリダイレクト
            if (response.status === 200 && response.data.message === "Registration successful") {
                // ログイン成功
                localStorage.setItem('organizer_token', response.data.token);

                // クエリパラメータを取得
                const { startDate, startTime, endDate, endTime, total_guest, comment, hourly_rate, guide_id } = router.query;

                // クエリパラメータが存在するかチェック
                if (startDate && startTime && endDate && endTime && total_guest && hourly_rate && guide_id) {
                    // クエリパラメータが存在する場合、/guest/offer/confirmation へリダイレクト
                    router.push({
                        pathname: '/guest/offer/confirmation',
                        query: {
                            startDate,
                            startTime,
                            endDate,
                            endTime,
                            total_guest,
                            comment,
                            hourly_rate,
                            guide_id
                        }
                    });
                } else {
                    // クエリパラメータが存在しない場合、/ へリダイレクト
                    router.push('/');
                }

                await checkAuth();
                alert('Signup successful');
            } else {
                // ログイン失敗
                alert('Registration failed');
                console.error("Registration failed", response.data.message);
                router.push('/guest/signup');
            }
        } catch (error) {
            console.error("Registration error", error);
        }
    };

    const handleLogin = async () => {
        try {
            console.log(email);
            console.log(password);
            // CSRF cookieを取得
            await axios.get(`${apiUrl}/sanctum/csrf-cookie`, {
                withCredentials: true
            });
            console.log("CSRF cookie set successfully");
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
                localStorage.setItem('organizer_token', response.data.token);

                // クエリパラメータを取得
                const { startDate, startTime, endDate, endTime, total_guest, comment, hourly_rate, guide_id } = router.query;

                // クエリパラメータが存在するかチェック
                if (startDate && startTime && endDate && endTime && total_guest && hourly_rate && guide_id) {
                    // クエリパラメータが存在する場合、/guest/offer/confirmation へリダイレクト
                    router.push({
                        pathname: '/guest/offer/confirmation',
                        query: {
                            startDate,
                            startTime,
                            endDate,
                            endTime,
                            total_guest,
                            comment,
                            hourly_rate,
                            guide_id
                        }
                    });
                } else {
                    // クエリパラメータが存在しない場合、/ へリダイレクト
                    router.push('/');
                }

                await checkAuth();
                alert('Login successful');
            } else {
                // ログイン失敗
                alert('Login failed');
                console.error("Login failed", response.data.message);
                router.push('/guest/login');
            }
        } catch (error) {
            console.error("Login error", error);
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

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)

        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    }

// <-- ---------- useEffect ---------- -->

    useEffect(() => {
        const fetchIcon = async () => {
            try {
                const securedAxios = createSecuredAxiosInstance();
                const response = await securedAxios.get(`/api/guest/profile_image`, {
                    withCredentials: true
                });
                setIconUrl(response.data.url);
            } catch (error) {
                console.error("Error fetching icon URL", error);
            }
        };

        fetchIcon();
    }, []);


    return (
        <main className={styles.main}>
            <Tabs defaultValue={defaultTab} className="w-100">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">Signup</TabsTrigger>
                    <TabsTrigger value="login">LogIn</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                    {showFirstCard && (
                        <Card>
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl">Create an account</CardTitle>
                                <CardDescription>
                                Enter your email below to create your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid grid-cols-2 gap-6">
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
                                </div>
                                <form onSubmit={onSubmit}>
                                    <div className="grid gap-2">
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
                                    <div className="grid gap-2">
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
                                    </div>
                                    <div className="grid gap-2">
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
                                    <Button className="w-full" disabled={isLoading} onClick={handleFirstCardButtonClick}>
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
                                <CardTitle className="text-2xl">Create an account</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <form onSubmit={onSubmit}>
                                    <div className="grid gap-2">
                                        <Label htmlFor="firstname">First Name</Label>
                                        <Input
                                            id="firstname"
                                            placeholder="First"
                                            type="text"
                                            autoCapitalize="none"
                                            autoComplete="firstname"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lastname">Last Name</Label>
                                        <Input
                                            id="lastname"
                                            placeholder="Last"
                                            type="text"
                                            autoCapitalize="none"
                                            autoComplete="lastname"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="picture">Icon</Label>
                                        <Input
                                            id="icon"
                                            type="file"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            onChange={onIconChange}
                                        />
                                    </div>

                                    <Button className="w-full" disabled={isLoading} onClick={handleRegister}>
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
                            <CardTitle className="text-2xl">Login an account</CardTitle>
                            <CardDescription>
                            Enter your email below to login your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-6">
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
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="grid gap-2">
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
                                <div className="grid gap-2">
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
                                </div>

                                <Button className="w-full" disabled={isLoading} onClick={handleLogin}>
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

export default GuestAuth;
