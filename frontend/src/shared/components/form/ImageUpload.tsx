import { Control, useWatch } from "react-hook-form";
import { X } from "lucide-react";
import { LabeledInput } from "./LabeledInput";
import { useEffect } from "react";

interface ImageUploadProps {
  name: string;
  control: Control<any>;
  setValue: (name: string, value: any, options?: any) => void;
  error?: string;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  name,
  control,
  setValue,
  error,
  label = "Выберите изображения",
}) => {
  const selectedFiles = useWatch({
    control,
    name,
  }) as (File | string)[] | undefined;

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const currentFiles = selectedFiles ?? [];
    const newFiles = Array.from(files);

    setValue(name, [...currentFiles, ...newFiles], {
      shouldValidate: true,
    });
  };

  const handleRemoveFile = (index: number) => {
    if (!selectedFiles) return;

    const filesArray = [...selectedFiles];
    filesArray.splice(index, 1);

    setValue(name, filesArray.length ? filesArray : undefined, {
      shouldValidate: true,
    });
  };

  const getFileUrl = (file: File | string): string => {
    if (typeof file === "string") {
      return file; // Это URL
    }
    return URL.createObjectURL(file); // Это File объект
  };

  const getFileName = (file: File | string): string => {
    if (typeof file === "string") {
      return file.split("/").pop() || "image";
    }
    return file.name;
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
            // Пропускаем не-image файлы только для File объектов
            if (typeof file !== "string" && !file.type.startsWith("image/")) {
              return null;
            }

            const url = getFileUrl(file);
            const fileName = getFileName(file);

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
                  className="absolute top-0 right-0 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-700 transition-colors"
                >
                  <X size={16} strokeWidth={2.2} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
