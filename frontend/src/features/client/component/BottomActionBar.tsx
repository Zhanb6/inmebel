import { Button } from "@/shared/components/ui";
import { LoadingSVG } from "@/shared/components";
import { useState, useRef, useCallback } from "react";

interface BottomActionBarProps {
  isLoadingPrice: boolean;
  priceRange: {
    price_from: number;
    price_to: number;
    price?: number;
  } | null;
  formatPrice: (price: number) => string;
  isSubmitting: boolean;
  disabled: boolean;
  onSubmit: () => void;
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  canProceedToNext: boolean;
}

const BottomActionBar: React.FC<BottomActionBarProps> = ({
  isLoadingPrice,
  priceRange,
  formatPrice,
  isSubmitting,
  disabled,
  onSubmit,
  currentStep,
  onNextStep,
  onPrevStep,
  canProceedToNext,
}) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const isProcessing = useRef(false);

  const handleSubmit = useCallback(async () => {
    if (isProcessing.current || disabled) return;

    isProcessing.current = true;
    setIsButtonClicked(true);

    try {
      await onSubmit();
    } finally {
      // Можно сбросить флаг через некоторое время
      setTimeout(() => {
        isProcessing.current = false;
        setIsButtonClicked(false);
      }, 2000); // 2 секунды до разблокировки
    }
  }, [onSubmit, disabled]);

  const handleNextStep = useCallback(() => {
    if (!canProceedToNext || isProcessing.current) return;

    isProcessing.current = true;
    setIsButtonClicked(true);

    try {
      onNextStep();
    } finally {
      // Сброс через короткое время
      setTimeout(() => {
        isProcessing.current = false;
        setIsButtonClicked(false);
      }, 500);
    }
  }, [onNextStep, canProceedToNext]);

  const handlePrevStep = useCallback(() => {
    if (isProcessing.current) return;

    isProcessing.current = true;
    onPrevStep();

    // Сброс после перехода
    setTimeout(() => {
      isProcessing.current = false;
    }, 100);
  }, [onPrevStep]);

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Основные параметры";
      case 2:
        return "Конфигурация мебели";
      case 3:
        return "Контактная информация";
      default:
        return "";
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white p-2 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      {/* Индикатор прогресса */}
      <div className="px-4 pt-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col">
            <span className="font-medium text-[11px] text-gray-600">
              Шаг {currentStep} из 3
            </span>
            <span className="font-medium text-[12px] text-black">
              {getStepTitle()}
            </span>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full ${
                  currentStep >= step ? "bg-[#85ac8d]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Отображение цены - ТОЛЬКО price */}
        <div className="flex justify-between items-center">
          <span className="font-medium text-[11px]">Итого к оплате:</span>
          <div className="text-xl font-bold text-black text-right">
            {isLoadingPrice ? (
              <div className="flex items-center gap-2">
                <LoadingSVG />
                <span>Расчет...</span>
              </div>
            ) : priceRange?.price ? (
              <span>{formatPrice(priceRange.price)} ТГ</span>
            ) : (
              <span className="text-gray-500">—</span>
            )}
          </div>
        </div>
      </div>

      {/* Кнопки навигации */}
      <div className="p-4 flex gap-3">
        {/* Кнопка назад */}
        {currentStep > 1 && (
          <Button
            type="button"
            className="flex-1 h-12 border border-gray-300 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
            onClick={handlePrevStep}
            disabled={isProcessing.current}
          >
            Назад
          </Button>
        )}

        {/* Кнопка далее или отправки */}
        {currentStep < 3 ? (
          <Button
            type="button"
            className={`flex-1 h-12 rounded-full transition-colors ${
              !canProceedToNext || isProcessing.current
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#58AB41] hover:bg-[#6d8f73]"
            }`}
            onClick={handleNextStep}
            disabled={
              !canProceedToNext || isProcessing.current || isButtonClicked
            }
          >
            {isButtonClicked ? "..." : "Далее"}
          </Button>
        ) : (
          <Button
            type="button" // Меняем на button, так как submit обрабатываем через handleSubmit
            className="flex-1 h-12 bg-[#58AB41] rounded-full disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-[#6d8f73] transition-colors"
            disabled={
              disabled ||
              isSubmitting ||
              isProcessing.current ||
              isButtonClicked
            }
            onClick={handleSubmit}
          >
            {isSubmitting || isButtonClicked ? (
              <div className="flex items-center gap-2">
                <LoadingSVG />
                <span>Создание...</span>
              </div>
            ) : (
              "Создать заявку"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BottomActionBar;
