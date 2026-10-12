import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { X } from "lucide-react";

import type { Swiper as SwiperType } from "swiper";

interface ScrollablePickerProps {
  title: string;
  items: Array<{
    id: number | string;
    name: string;
    image?: string;
    color?: string;
    code?: string;
    media?: {
      original_url?: string;
      preview_url?: string;
    };
  }>;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
  type?: "image" | "color";
}

export const ScrollablePicker: React.FC<ScrollablePickerProps> = ({
  title,
  items,
  value,
  onChange,
  error,
  disabled = false,
  type = "image",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Функция для получения URL изображения
  const getImageUrl = (item: any) => {
    return (
      item.media?.original_url || item.image || "/assets/images/fasade1.PNG"
    );
  };

  // Функция для получения цвета
  const getColor = (item: any) => {
    if (item.color) return item.color;
    if (item.code) return item.code;
    if (item.media?.preview_url) return `url(${item.media.preview_url})`;
    if (item.media?.original_url) return `url(${item.media.original_url})`;
    if (item.image) return `url(${item.image})`;
    return "#CCCCCC";
  };

  // Обработчик клика с поддержкой двойного клика
  const handleClick = (item: any) => {
    if (disabled) return;

    if (clickTimeout) {
      // Двойной клик - показываем модальное окно
      clearTimeout(clickTimeout);
      setClickTimeout(null);

      // Находим индекс элемента для установки активного слайда
      const itemIndex = items.findIndex((i) => i.id === item.id);
      setActiveIndex(itemIndex);
      setShowModal(true);
    } else {
      // Одинарный клик - выбираем элемент
      const timeout = setTimeout(() => {
        onChange(item.id);
        setClickTimeout(null);
      }, 300); // Задержка для определения двойного клика
      setClickTimeout(timeout);
    }
  };

  // Закрытие модального окна
  const closeModal = () => {
    setShowModal(false);
    if (thumbsSwiper) {
      thumbsSwiper.destroy();
      setThumbsSwiper(null);
    }
  };

  // Обработчик изменения активного слайда
  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  // Функция для выбора активного элемента
  const handleSelectActive = () => {
    const activeItem = items[activeIndex];
    if (activeItem) {
      onChange(activeItem.id);
    }
    closeModal();
  };

  // Находим выбранный элемент
  const selectedItem = items.find((item) => item.id === value) || items[0];

  // Находим индекс выбранного элемента
  const selectedIndex = items.findIndex((item) => item.id === value);

  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">{title}</label>

        {items.length === 0 ? (
          <div className="text-gray-400 text-center py-4 border border-gray-200 rounded-lg bg-gray-50">
            Нет доступных вариантов
          </div>
        ) : (
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 pt-2 px-1"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {items.map((item) => {
                const colorValue = getColor(item);
                const isImageColor = colorValue.startsWith("url");

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`
                      flex flex-col items-center flex-shrink-0 focus:outline-none
                      transition-all duration-200
                      ${
                        disabled
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:scale-105"
                      }
                    `}
                    onClick={() => handleClick(item)}
                    disabled={disabled}
                    title={`${item.name} (двойной клик для детального просмотра)`}
                  >
                    <div className="relative">
                      {type === "color" ? (
                        <div className="relative">
                          {isImageColor ? (
                            <div
                              className="w-14 h-14 rounded-full bg-cover bg-center border-2 border-gray-300"
                              style={{ backgroundImage: colorValue }}
                            />
                          ) : (
                            <div
                              className={`
                                w-14 h-14 rounded-full
                                ${
                                  value === item.id
                                    ? "border-3 border-[#58AB41]"
                                    : "border-2 border-gray-300"
                                }
                              `}
                              style={{ backgroundColor: colorValue }}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={getImageUrl(item)}
                            alt={item.name}
                            className={`
                              w-16 h-16 object-cover rounded-md
                              transition-all duration-200
                              ${
                                value === item.id
                                  ? "border-3 border-[#58AB41]"
                                  : "border-2 border-gray-300 hover:border-gray-400"
                              }
                            `}
                            onError={(e) => {
                              e.currentTarget.src =
                                "/assets/images/fasade1.PNG";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      {/* Модальное окно с Swiper */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#939393B3] p-4">
          <div className=" rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Основной слайдер */}
            <div className="p-4">
              <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Navigation, Thumbs]}
                className="mb-4"
                initialSlide={selectedIndex}
                onSlideChange={handleSlideChange}
              >
                {items.map((item) => (
                  <SwiperSlide key={item.id}>
                    <div className="flex items-center justify-center h-64">
                      {type === "color" ? (
                        <div
                          className="w-full h-full rounded-lg"
                          style={{
                            backgroundColor: getColor(item),
                            backgroundImage: getColor(item).startsWith("url")
                              ? getColor(item)
                                  .replace("url(", "")
                                  .replace(")", "")
                              : undefined,
                          }}
                        />
                      ) : (
                        <img
                          src={getImageUrl(item)}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = "/assets/images/fasade1.PNG";
                          }}
                        />
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Подвал модального окна */}
            <div className="p-4">
              <div className="flex justify-center items-center">
                <button
                  onClick={handleSelectActive}
                  className="px-4 py-2 bg-[#58AB41] text-white rounded-md hover:bg-[#4a8f37] transition-colors"
                >
                  Выбрать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
