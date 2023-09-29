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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import styles from '../../styles/admin.module.scss';
import { uploadImage } from '../../utils/uploadImage';
import { utils } from '../../utils/utils';

enum Gender {
    male,
    female,
    other
}

enum LanguageLevel {
    beginner,
    elementary,
    intermediate,
    upper_intermediate,
    advanced,
    proficiency,
}

enum user_type {
    guest,
    guide
}


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
            console.log(birthday);
            console.log(gender);
            console.log(languageLevel);
            console.log(introduction);
            console.log(hourlyRate);

            // CSRFトークンを取得
            await fetchCsrfToken();
            const registerData = {
                email,
                password,
                password_confirmation: passwordConfirmation,
                first_name: firstName,
                last_name: lastName,
                profile_image: iconUrl,
                birthday,
                gender,
                level: languageLevel,
                introduction,
                hourly_rate: hourlyRate,
                user_type: user_type.guide,
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
                gender,
                level: languageLevel,
                introduction,
                hourly_rate: hourlyRate,
                user_type: user_type.guide,
            }, {
                withCredentials: true
            });
            console.log(response);
            // 登録が成功したら、トップページにリダイレクト
            if (response.status === 200 && response.data.message === "Registration successful") {
                // localStorage.setItem('user_token', response.data.token);
                alert('Signup successful');
                await handleLogin();
            } else {
                // ログイン失敗
                alert('Registration failed');
                console.error("Registration failed", response.data.message);
                router.push('/');
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
            const response = await axios.post(`${apiUrl}/auth/user/login/`, {
                email,
                password,
            }, {
                withCredentials: true
            });
            console.log(response);
            if (response.status === 200 && response.data.message === "Login successful") {
                // ログイン成功
                localStorage.setItem('user_token', response.data.token);

                router.push('/guide/mypage');

                await checkAuth();
                alert('Login successful');
            } else {
                // ログイン失敗
                alert('Login failed');
                console.error("Login failed", response.data.message);
                router.push('/');
            }
        } catch (error) {
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
                                    <div className="grid gap-2">
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

                                    <div className="grid gap-2">
                                        <Label htmlFor="birthday">Birthday</Label>
                                        <Input
                                            id="birthday"
                                            type="date"
                                            disabled={isLoading}
                                            value={birthday}
                                            onChange={e => setBirthday(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <select placeholder='' id="gender" value={gender} onChange={e => setGender(e.target.value)}>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="languageLevel">Available Languages</Label>
                                        <select placeholder='' id="languageLevel" value={languageLevel} onChange={e => setLanguageLevel(e.target.value)}>
                                            <option value="beginner">Beginner</option>
                                            <option value="elementary">Elementary</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="upper_intermediate">UpperIntermediate</option>
                                            <option value="advanced">Advanced</option>
                                            <option value="proficiency">Proficiency</option>
                                        </select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="introduction">Introduction</Label>
                                        <Input
                                            id="introduction"
                                            type="text"
                                            placeholder='Please write a self-introduction. By sharing detailed information about yourself, your hobbies, and your profession, guests are more likely to reach out to you for requests!'
                                            disabled={isLoading}
                                            value={introduction}
                                            onChange={e => setIntroduction(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="hourlyRate">Hourly Rate</Label>
                                        <p><small>Please set your hourly rate for guiding based on your language proficiency level and prior experience.</small></p>
                                        <p>1h ¥
                                            <Input
                                                id="hourlyRate"
                                                type="number"
                                                disabled={isLoading}
                                                value={hourlyRate}
                                                onChange={e => setHourlyRate(e.target.value)}
                                            />
                                            / Person
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="locationSwitch">Location</Label>
                                        <Switch
                                            id="locationSwitch"
                                            checked={isLocationEnabled}
                                            onCheckedChange={handleLocationToggle}
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

export default GuideAuth;