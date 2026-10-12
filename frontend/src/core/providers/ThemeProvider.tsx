"use client";

import {useEffect, useState} from "react";
import {ThemeProvider as NextThemesProvider} from "next-themes";

export function ThemeProvider({children}: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div style={{visibility: "hidden"}}/>;
	}

	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="light"
			enableSystem
			disableTransitionOnChange
			enableColorScheme
			themes={["dark", "light"]}
		>
			{children}
		</NextThemesProvider>
	);
}
