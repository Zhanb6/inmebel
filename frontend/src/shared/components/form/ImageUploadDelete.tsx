import { Control, useWatch } from "react-hook-form";
import { X } from "lucide-react";
import { LabeledInput } from "./LabeledInput";
import { useDeleteMediaProduct } from "@/features/product";

interface ImageUploadProps {
  name: string;
  control: Control<any>;
  setValue: (name: string, value: any, options?: any) => void;
  error?: string;
  label?: string;
  productId?: number;
}

export const ImageUploadDelete: React.FC<ImageUploadProps> = ({
  name,
  control,
  setValue,
  error,
  label = "Выберите изображения",
  productId,
}) => {
  const selectedFiles = useWatch({
    control,
    name,
  }) as (File | string)[] | undefined;

  const deleteMediaMutation = useDeleteMediaProduct();

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const currentFiles = selectedFiles ?? [];
    const newFiles = Array.from(files);

    setValue(name, [...currentFiles, ...newFiles], {
      shouldValidate: true,
    });
  };

  const handleRemoveFile = async (index: number) => {
    if (!selectedFiles) return;

    const fileToRemove = selectedFiles[index];

    // Если это URL (существующее медиа) и есть productId, удаляем с сервера
    if (typeof fileToRemove === "string" && productId) {
      try {
        // Находим ID медиа из URL
        const mediaId = extractMediaIdFromUrl(fileToRemove);

        if (mediaId) {
          await deleteMediaMutation.mutateAsync({
            productId,
            mediaId: parseInt(mediaId),
          });
        } else {
          console.warn("Не удалось извлечь ID медиа из URL:", fileToRemove);
        }
      } catch (error) {
        console.error("Ошибка при удалении медиа:", error);
        return;
      }
    }

    // Удаляем файл из формы (локально)
    const filesArray = [...selectedFiles];
    filesArray.splice(index, 1);

    setValue(name, filesArray.length ? filesArray : [], {
      shouldValidate: true,
    });
  };

  // Функция для извлечения ID медиа из URL - УЛУЧШЕННАЯ ВЕРСИЯ
  const extractMediaIdFromUrl = (url: string): string | null => {
    try {
      // Парсим URL и ищем числовой ID в пути
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname
        .split("/")
        .filter((segment) => segment);

      // Ищем сегмент, который является числом и находится после 'media'
      for (let i = 0; i < pathSegments.length - 1; i++) {
        if (pathSegments[i] === "media" && /^\d+$/.test(pathSegments[i + 1])) {
          return pathSegments[i + 1];
        }
      }

      // Альтернативный подход: ищем любой числовой сегмент в пути
      const numericSegment = pathSegments.find((segment) =>
        /^\d+$/.test(segment),
      );
      return numericSegment || null;
    } catch {
      // Если URL невалидный, пробуем извлечь число из строки
      const match = url.match(/\/(\d+)\/[^\/]+$/);
      return match ? match[1] : null;
    }
  };

  const getFileUrl = (file: File | string): string => {
    if (typeof file === "string") {
      return file;
    }
    return URL.createObjectURL(file);
  };

  const getFileName = (file: File | string): string => {
    if (typeof file === "string") {
      return file.split("/").pop() || "image";
    }
    return file.name;
  };

  const getMediaId = (file: File | string): number | null => {
    if (typeof file === "string") {
      const mediaId = extractMediaIdFromUrl(file);
      return mediaId ? parseInt(mediaId) : null;
    }
    return null;
  };

  const isDeleting = (file: File | string): boolean => {
    if (typeof file === "string" && productId) {
      const mediaId = getMediaId(file);
      return mediaId ? deleteMediaMutation.isPending : false;
    }
    return false;
  };

  return (
    <>
      <LabeledInput
        label={label}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files)}
        error={error}
      />

      {selectedFiles && selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          {selectedFiles.map((file, idx) => {
            if (typeof file !== "string" && !file.type.startsWith("image/")) {
              return null;
            }

            const url = getFileUrl(file);
            const fileName = getFileName(file);
            const mediaId = getMediaId(file);
            const deleting = isDeleting(file);

            return (
              <div
                key={idx}
                className="relative w-24 h-24 border rounded overflow-hidden"
              >
                <img
                  src={url}
                  alt={fileName}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  disabled={deleting}
                  className="absolute top-0 right-0 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {deleting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <X size={16} strokeWidth={2.2} />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
