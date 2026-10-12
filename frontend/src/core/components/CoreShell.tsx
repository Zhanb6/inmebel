"use client";
import {renderNode, useNavigation} from "@/shared";
import {BottomNavigationBar} from "@/widgets/nav-bar";
import {CSSProperties, ReactNode, useLayoutEffect, useMemo, useRef, useState} from "react";

export function CoreShell({
	children,
	header,
	maxWidth = 420, // px
	frameGap = 16, // px horizontal & vertical gap near borders
}: {
	children: ReactNode;
	header?: ReactNode;
	maxWidth?: number;
	frameGap?: number;
}) {
	const {activeNode} = useNavigation();
	const content = useMemo(
		() => renderNode(activeNode) ?? children,
		[activeNode, children],
	);

	// measure bottom bar (container) height
	const barRef = useRef<HTMLDivElement>(null);
	const [bottomPad, setBottomPad] = useState(0);

	useLayoutEffect(() => {
		const update = () => {
			const el = barRef.current;
			if (!el) return;
			const rect = el.getBoundingClientRect();
			setBottomPad(rect.height);
		};
		update();
		const ro = new ResizeObserver(update);
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		barRef.current && ro.observe(barRef.current);
		window.addEventListener("resize", update);
		return () => {
			window.removeEventListener("resize", update);
			ro.disconnect();
		};
	}, []);

	return (
		<div
			className="min-h-dvh w-full flex justify-center"
			style={
				{
					// shared variables used by the bar
					["--app-max-w" as any]: `${maxWidth}px`,
					["--app-frame-gap" as any]: `${frameGap}px`,
				} as CSSProperties
			}
		>
			<div
				className="min-h-dvh w-full flex flex-col relative border-l border-r border-border"
				style={{
					maxWidth: "var(--app-max-w)",
				}}
			>
				{/* Optional header */}
				{header ? (
					<div
						className="sticky top-0 z-20 border-b"
						style={{paddingTop: "env(safe-area-inset-top)"}}
					>
						<div className="h-12 px-4 flex items-center">{header}</div>
					</div>
				) : null}

				{/* Scrollable content with exact padding equal to bar height */}
				<main
					className="w-full flex-1 overflow-auto px-4 pt-4"
					style={{paddingBottom: bottomPad}}
				>
					{content}
				</main>

				{/* Fixed bottom bar (we pass the ref to measure its full height) */}
				<BottomNavigationBar containerRef={barRef}/>
			</div>
		</div>
	);
}
