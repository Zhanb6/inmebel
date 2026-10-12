import React from "react";
import {cn} from "@/shared";

export const StarSVG: React.FC<React.SVGProps<SVGSVGElement>> = ({
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
			viewBox="0 0 24 23"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-label="LoadingSVG"
			{...props}
		>
			<path
				d="M15.4422 8.16633L13.3597 1.30967C12.9488 -0.0361654 11.0505 -0.0361654 10.6538 1.30967L8.55718 8.16633H2.25301C0.878844 8.16633 0.312177 9.93717 1.43134 10.7305L6.58801 14.4138L4.56218 20.9447C4.15134 22.2622 5.68134 23.3247 6.77218 22.4888L11.9997 18.5222L17.2272 22.503C18.318 23.3388 19.848 22.2763 19.4372 20.9588L17.4113 14.428L22.568 10.7447C23.6872 9.93717 23.1205 8.1805 21.7463 8.1805H15.4422V8.16633Z"
				fill="currentColor"/>

		</svg>
	);
};
