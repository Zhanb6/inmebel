import React from "react";
import {cn} from "@/shared/lib/utils";

export interface AppHeaderProps {
	title?: React.ReactNode;
	leftAction?: React.ReactNode;
	rightAction?: React.ReactNode;
	className?: string;
}

export function AppHeader({
	title,
	leftAction,
	rightAction,
	className,
}: AppHeaderProps) {
	return (
		<div
			className={cn(
				"w-full h-12 shrink-0 grid grid-cols-[3rem_1fr_3rem] items-center justify-between justify-items-center gap-2",
				className,
			)}
		>
			<div className="flex items-center gap-2">{leftAction}</div>
			<div className="w-full flex items-center text-start gap-2 text-xl font-semibold truncate">
				{title}
			</div>
			<div className="flex items-center gap-2">{rightAction}</div>
		</div>
	);
}
