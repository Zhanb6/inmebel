import React from "react";
import { Skeleton } from "../ui/skeleton";

interface UsersSkeletonProps {
  statsCount?: number;
  cardsCount?: number;
  className?: string;
}

const UsersSkeleton: React.FC<UsersSkeletonProps> = ({
  statsCount = 3,
  cardsCount = 6,
  className = "",
}) => {
  return (
    <div className={`space-y-6 p-4 rounded-lg mt-4 ${className}`}>
      {/* Скелетоны для статистики */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: statsCount }).map((_, index) => (
          <div key={`stat-${index}`} className="flex flex-col gap-2">
            <Skeleton className="h-[120px] w-full bg-gray-300" />
          </div>
        ))}
      </div>

      {/* Скелетоны для карточек пользователей */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: cardsCount }).map((_, index) => (
          <div key={`card-${index}`} className="flex flex-col gap-2">
            <Skeleton className="h-[280px] w-full bg-gray-300" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersSkeleton;
