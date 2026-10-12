import React from "react";
import {cn} from "@/shared";

export const UserSVG: React.FC<React.SVGProps<SVGSVGElement>> = ({
	className,
	...props
}) => {
	return (
		<svg
			aria-hidden="true"
			className={cn(
				"inline w-4 h-4 text-blue-200 dark:text-blue-600 fill-accent-foreground",
				className,
			)}
			viewBox="0 0 16 21"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-label="LoadingSVG"
			{...props}
		>
			<path fillRule="evenodd" clipRule="evenodd"
			      d="M7.94118 13.9412C3.65828 13.9412 0 14.6445 0 17.4576C0 20.2719 3.63544 21 7.94118 21C12.2241 21 15.8824 20.2977 15.8824 17.4835C15.8824 14.6693 12.2479 13.9412 7.94118 13.9412Z"
			      fill="currentColor"/>
			<path fillRule="evenodd" clipRule="evenodd"
			      d="M8.23556 11.5882C11.1747 11.5882 13.5296 9.23229 13.5296 6.29412C13.5296 3.35594 11.1747 1 8.23556 1C5.29738 1 2.94141 3.35594 2.94141 6.29412C2.94141 9.23229 5.29738 11.5882 8.23556 11.5882Z"
			      fill="currentColor"/>
		</svg>
	);
};
