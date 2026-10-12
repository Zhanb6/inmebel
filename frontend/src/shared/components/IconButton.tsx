// shared/components/IconButton.tsx
import React from "react";
import {Button} from "@/shared/components/ui/button";
import {cn} from "@/shared/lib/utils";

type IconButtonProps = Omit<React.ComponentProps<"button">, "children"> & {
	icon: React.ReactNode;
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";
};

export function IconButton({
	icon,
	className,
	variant = "ghost",
	...props
}: IconButtonProps) {
	return (
		<Button
			{...props}
			variant={variant}
			className={cn(
				"rounded-full p-0 m-0 hover:opacity-80 transition",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				className,
			)}
		>
      <span className="size-full p-0 inline-flex items-center justify-center">
        {icon}
      </span>
		</Button>
	);
}
