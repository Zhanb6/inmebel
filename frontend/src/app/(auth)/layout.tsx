// app/(auth)/layout.tsx
import React from "react";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		// full-bleed background; center a narrow “device” column
		<div
			className="min-h-dvh w-full flex justify-center"
			style={
				{
					["--app-max-w" as any]: "420px", // keep in sync with CoreShell default
					["--app-frame-gap" as any]: "16px",
				} as React.CSSProperties
			}
		>
			{/* framed column (no CoreShell, no BottomNav) */}
			<div
				className="min-h-dvh w-full flex flex-col border-l border-r border-border"
				style={{
					maxWidth: "var(--app-max-w)",
				}}
			>

				<main
					className="flex-1 overflow-auto"
					style={{
						background: `url("/assets/images/bg.png")`,
						backgroundPosition: "center center",
						backgroundRepeat: "no-repeat",
						backgroundSize: "cover",
					}}
				>
					{children}
				</main>
			</div>
		</div>
	);
}
