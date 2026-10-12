import { IconButton } from "@/shared/components/IconButton";
import { EditIcon } from "lucide-react";

export function EditableCardWidgetError({
  title,
  error,
}: {
  title: string;
  error: string;
}) {
  return (
    <div className="w-full h-32 space-y-4 bg-secondary p-4 rounded-lg">
      <div className="w-full h-12 flex items-center justify-between">
        <div className="text-lg font-semibold mb-2">{title}</div>
        <IconButton icon={<EditIcon />} aria-label="edit" />
      </div>
      <div className="w-full flex justify-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    </div>
  );
}
