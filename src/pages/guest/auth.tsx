import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import axios, { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

// <-- ---------- 定数の定義 ---------- -->

    const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
    const router = useRouter();

    // デフォルトのタブを決定
    let defaultTab = "signup";
    if (typeof router.query.tab === 'string') {
        defaultTab = router.query.tab;
    }

// <-- ---------- 関数の定義 ---------- -->

    const handleRegister = async () => {
        try {
            const formData = new FormData();

            formData.append('email', email);
            formData.append('password', password);
            formData.append('password_confirmation', passwordConfirmation);
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);

            if (iconFile) {
                formData.append('profile_image', iconFile);
            }

            const response = await axios.post(`${apiUrl}/auth/guest/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            if (response.status === 200 && response.data.message === "Registration successful") {
                localStorage.setItem('user_token', response.data.token);
                console.log("Register successfully");
                await handleRegisterLogin();
            } else {
                if (response.status === 422) {
                    alert('The email address is already registered.'); // ここでアラートメッセージを表示
                } else {
                    alert('Registration failed');
                }
                console.error("Registration failed", response.data.message);
                router.push('/').then(() => window.location.reload());
            }
        } catch (error) {
            if (axios.isAxiosError(error)) { // <-- ここでエラーがAxiosErrorかどうかを確認
                if (error.response && error.response.status === 422) {
                    alert('The email address is already registered.');
                } else {
                    console.error("Registration error", error);
                    alert(`Registration failed: ${error.message}`);
                }
            } else {
                console.error("Registration error", error);
                alert('An unexpected error occurred.');
            }
        }
    };


    const handleRegisterLogin = async () => {
        try {
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
                alert('Register & Login successful');
                router.push('/guest').then(() => window.location.reload());
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
                alert('Login successful');
                router.push('/guest').then(() => window.location.reload());
            }else {
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

    const isPasswordShort = password.length < 8;
    const isPasswordDiffernt = password !== passwordConfirmation;

    const isShortOfInfoRegisterFirst = !email || !password || !passwordConfirmation;

    // サブミットボタンの有効・無効を管理
    const isSubmitDisabledRegisterFirst = isPasswordShort || isPasswordDiffernt || isShortOfInfoRegisterFirst;
    const isSubmitDisabledRegisterSecond = !firstName || !lastName;

    const isShortOfInfoLogin = !email || !password;
    const isSubmitDisabledLogin = isPasswordShort || isShortOfInfoLogin;


    return (
        <main className={styles.main}>
            <Tabs defaultValue={defaultTab} className="w-100">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">Signup</TabsTrigger>
                    <TabsTrigger value="login">LogIn</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl m-4">Create an account</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <form onSubmit={onSubmit}>
                                <div className="grid gap-2 mt-2 mb-8">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        placeholder="Email"
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
                                        placeholder="Please Enter Your Password Again"
                                        type="password"
                                        autoCapitalize="none"
                                        autoComplete="password"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        value={passwordConfirmation}
                                        onChange={e => setPasswordConfirmation(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2 mt-2 mb-8">
                                    {/* <Label htmlFor="firstname">First Name</Label> */}
                                    <Input
                                        id="firstname"
                                        placeholder="First name"
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
                                    {/* <Label htmlFor="lastname mt-2 mb-8">Last Name</Label> */}
                                    <Input
                                        id="lastname"
                                        placeholder="Last name"
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
                                {isPasswordShort && <div className="text-red-500 text-xs">Password must be at least 8 characters long.</div>}
                                {isPasswordDiffernt && <div className="text-red-500 text-xs">Something wrong with confirm password.</div>}
                                {isShortOfInfoRegisterFirst && <div className="text-red-500 text-xs">Enter your email and password.</div>}
                                {isSubmitDisabledRegisterSecond && <div className="text-red-500 text-xs">Enter your information.</div>}
                                <Button className="w-full my-4" disabled={isLoading || isSubmitDisabledRegisterFirst || isSubmitDisabledRegisterSecond} onClick={handleRegister}>
                                    {isLoading && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Complete sign-up!
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
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

export default GuestAuth;
