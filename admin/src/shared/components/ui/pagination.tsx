import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "./card";

export interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  total,
  from,
  to,
  onPageChange,
  className = "",
}) => {
  if (lastPage <= 1) return null;

  // Функция для получения ссылок пагинации
  const getPaginationLinks = () => {
    const paginationLinks = [];

    // Добавляем кнопку "Предыдущая"
    if (currentPage > 1) {
      paginationLinks.push({
        label: "&laquo;",
        page: currentPage - 1,
        active: false,
      });
    }

    // Добавляем номера страниц
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(lastPage, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      paginationLinks.push({
        label: i.toString(),
        page: i,
        active: i === currentPage,
      });
    }

    // Добавляем кнопку "Следующая"
    if (currentPage < lastPage) {
      paginationLinks.push({
        label: "&raquo;",
        page: currentPage + 1,
        active: false,
      });
    }

    return paginationLinks;
  };

  const paginationLinks = getPaginationLinks();

  return (
    <Card className={`bg-gray-50 border-gray-200 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-2">
          {/* Кнопка "Назад" */}
          <button
            className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Назад
          </button>

          {/* Номера страниц */}
          <div className="flex gap-1">
            {paginationLinks.map((link, index) => (
              <button
                key={index}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors min-w-[40px] ${
                  link.active
                    ? "bg-gray-800 text-white hover:bg-gray-900"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => onPageChange(link.page)}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>

          {/* Кнопка "Вперед" */}
          <button
            className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
          >
            Вперед
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Информация о записях */}
        <div className="text-center text-sm text-gray-500 mt-2">
          Показано {from} - {to} из {total} пользователей
        </div>
      </CardContent>
    </Card>
  );
};

export default Pagination;
