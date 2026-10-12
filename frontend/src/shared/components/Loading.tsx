import { LoadingSVG } from "./svg";
import { SVGAttributes } from "react";
import { cn } from "@/shared";

interface ILoadingProps extends SVGAttributes<SVGSVGElement> {
  className?: string; // Optional additional class for styling
}

export function Loading({ className }: ILoadingProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <LoadingSVG className={cn("w-10 h-10", className)} />
    </div>
  );
}
