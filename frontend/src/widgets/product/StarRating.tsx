"use client";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (v: number) => void;
}

export default function StarRating({ value, onChange }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const stars = [1, 2, 3, 4, 5];

  const current = hover ?? value;

  function getFill(star: number) {
    if (current >= star) return 1; // full
    if (current >= star - 0.5) return 0.5; // half
    return 0;
  }

  return (
    <div className="flex gap-1 select-none">
      {stars.map((star, i) => {
        const fill = getFill(star);

        return (
          <div
            key={i}
            className="relative cursor-pointer w-10 h-10"
            onMouseLeave={() => setHover(null)}
          >
            {/* Левая половина клика */}
            <div
              className="absolute left-0 top-0 w-1/2 h-full z-20"
              onMouseEnter={() => setHover(star - 0.5)}
              onClick={() => onChange(star - 0.5)}
            />
            {/* Правая половина клика */}
            <div
              className="absolute right-0 top-0 w-1/2 h-full z-20"
              onMouseEnter={() => setHover(star)}
              onClick={() => onChange(star)}
            />

            {/* Серый фон звезды */}
            <Star
              size={40}
              className="text-gray-300 absolute top-0 left-0"
              fill="currentColor"
            />

            {/* Зеленая заливка внутри звезды */}
            {fill > 0 && (
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: `${fill * 100}%`, height: "100%" }}
              >
                <Star
                  size={40}
                  className="text-green-500"
                  fill="currentColor"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
