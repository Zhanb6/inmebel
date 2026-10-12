"use client";

import { useProfileQuery } from "@/features/profiles";
import { ProfileWidget } from "@/widgets/profile/ProfileWidget";

export default function ProfileScreen() {
  const profileQuery = useProfileQuery();

  // Проверка состояния загрузки
  if (profileQuery.isLoading) {
    return <p>Загрузка профиля...</p>;
  }

  // Проверка ошибок
  if (profileQuery.isError) {
    return <p>Ошибка при загрузке профиля</p>;
  }

  const profile = profileQuery.data;

  return (
    <div className="size-full flex flex-col items-center justify-between p-4">
      <ProfileWidget data={profile} />
    </div>
  );
}
