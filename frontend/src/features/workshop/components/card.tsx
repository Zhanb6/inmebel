import Link from "next/link";
import { IWorkshopRequestIn } from "../types";

interface CardProps {
  data: IWorkshopRequestIn;
  session?: string | undefined;
}

export default function Card({ data, session }: CardProps) {
  return (
    <div className="max-w-sm w-full bg-[#F8F9F8] rounded-2xl p-4 shadow-sm text-[#1B5E20]">
      <p className="text-sm text-gray-500 mb-1">
        {new Date(data.created_at).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <h2 className="font-bold text-lg text-black mb-2">
        {data.furniture_type?.name || "Тип мебели не указан"}
      </h2>

      <p className="text-gray-600 mb-4">
        {data.request_status?.name || "Без статуса"}
      </p>

      <div className="flex items-center gap-2 mb-1 text-gray-600 text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-4 text-[#4CAF50]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.5-7.5 11.25-7.5 11.25S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
        <span>{data.address || "Адрес не указан"}</span>
      </div>

      <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-4 text-[#7E57C2]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <span>
          от {Number(data.price_from).toLocaleString("ru-RU")} тг до{" "}
          {Number(data.price_to).toLocaleString("ru-RU")} тг
        </span>
      </div>

      <div className="border-t border-gray-200 pt-3 flex justify-end">
        <button className="flex items-center justify-center bg-[#85ac8d] text-white text-sm font-semibold w-[202px] h-[40px] rounded-[12px] hover:bg-[#6d8f74] transition-colors">
          Подробнее
        </button>
      </div>
    </div>
  );
}
