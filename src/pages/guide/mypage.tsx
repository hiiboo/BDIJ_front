import React, { useState, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "../../components/Icons";
import { Input } from "@/components/ui/input";
import { uploadImage } from '../../utils/uploadImage';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"
import { utils } from '../../utils/utils';
import GuideProfile from '../../components/GuideProfile';
import StatusButton from '../../components/StatusButton';
import styles from '../../styles/profile.module.scss';
import {
  BookingStatus,
  LanguageLevel,
  UserType,
  UserStatus,
  UserData,
  GuestData,
  GuideData,
  PageProps
} from '../../types/types';

function GuideMypage({ isLoggedIn, userData }: PageProps): JSX.Element | null {

  const [guideData, setGuideData] = useState<GuideData | null>(null);

// <-- ---------- 定数の定義 ---------- -->

  const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

  // State
  const [email, setEmail] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
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

  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [userStatus, setUserStatus] = useState<boolean>(false); // ステータスを管理するための新しいステート

  useEffect(() => {

    const fetchUserInfo = async () => {
      try {
        const securedAxios = createSecuredAxiosInstance();
        const response = await securedAxios.get(`/api/guide`);
        setGuideData(response.data);
        setEmail(response.data.email);
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setIconUrl(response.data.iconUrl);
        setBirthday(response.data.birthday);
        setLanguageLevel(response.data.language_level);
        setIntroduction(response.data.introduction);
        setHourlyRate(response.data.hourly_rate);
        setUserStatus(response.data.status === UserStatus.Active);
      } catch (error) {
        console.error('Failed to fetch guide data', error);
      }
  };
  fetchUserInfo();
  }, []);

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

  const handleStatusToggle = async () => {
    try {
      const newStatus = userStatus ? UserStatus.Inactive : UserStatus.Active;
      const securedAxios = createSecuredAxiosInstance();
      const response = await securedAxios.put(`/api/guide/update-status`, { status: newStatus });

      if (response.status === 200) {
        alert('Status updated successfully');
        setUserStatus(newStatus === UserStatus.Active);
      } else {
        console.error("Update failed", response.data.message);
        alert('Update failed');
      }
    } catch (error) {
      console.error("Update error", error);
      alert('Update error');
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Validate password confirmation
      if (newPassword !== passwordConfirmation) {
        alert("Password confirmation does not match!");
        setIsLoading(false);
        return;
      }

      // Update user info
      const securedAxios = createSecuredAxiosInstance();
      const response = await securedAxios.put(`${apiUrl}/api/guide/update`, {
        email,
        currentPassword,
        newPassword,
        firstName,
        lastName,
        profile_image: iconUrl,
        birthday,
        gender,
        language_level: languageLevel,
        introduction,
        hourly_rate: hourlyRate,
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        alert('User info updated successfully');
      } else {
        console.error("Update failed", response.data.message);
        alert('Update failed');
      }
    } catch (error) {
      console.error("Update error", error);
      alert('Update error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
      // コンポーネントがマウントされた時に位置情報の許可を確認
      navigator.geolocation.getCurrentPosition(
      () => setIsLocationEnabled(true), // 位置情報へのアクセスが許可されている
      () => setIsLocationEnabled(false) // 位置情報へのアクセスが拒否されている
      );
  }, []);

  return (
    <main className={styles.main}>
      <Tabs defaultValue="view" className="w-100">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">View</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
        </TabsList>
        <TabsContent value="view">
          {/* <h3>{email ? email : 'Loading...'} </h3> */}
          <GuideProfile isLoggedIn={isLoggedIn} userData={userData} guideData={guideData} />
          <StatusButton isLoggedIn={isLoggedIn} userData={userData} />
          <div className="grid gap-2">
            <Label htmlFor="statusSwitch">Active</Label>
            <Switch
              id="statusSwitch"
              checked={userStatus}
              onCheckedChange={handleStatusToggle}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="locationSwitch">Location</Label>
            <Switch
                id="locationSwitch"
                checked={isLocationEnabled}
                onCheckedChange={handleLocationToggle}
            />
          </div>
        </TabsContent>
        <TabsContent value="edit">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Update Guide Info</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Current Password */}
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  placeholder="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* New Password */}
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  placeholder="New Password"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Password Confirmation */}
              <div className="grid gap-2">
                <Label htmlFor="passwordConfirmation">Confirm New Password</Label>
                <Input
                  id="passwordConfirmation"
                  placeholder="Confirm New Password"
                  type="password"
                  value={passwordConfirmation}
                  onChange={e => setPasswordConfirmation(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* First Name */}
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Last Name */}
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Icon */}
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  type="file"
                  onChange={onIconChange}
                  disabled={isLoading}
                />
              </div>

                {/* Birthday */}
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
                  <select id="gender" value={gender} onChange={e => setGender(e.target.value)}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                  </select>
              </div>

              <div className="grid gap-2">
                  <Label htmlFor="languageLevel">Available Languages</Label>
                  <select id="languageLevel" value={languageLevel} onChange={e => setLanguageLevel(e.target.value)}>
                      <option value="beginner">Beginner</option>
                      <option value="elementary">Elementary</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="upperintermediate">UpperIntermediate</option>
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

              {/* Submit Button */}
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Info
              </Button>
            </form>
          </CardContent>
        </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default GuideMypage;
