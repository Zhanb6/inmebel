"use client";

import {motion} from "framer-motion";
import {useNavigation} from "@/shared/lib/navigation";
import {Button} from "@/shared/components/ui/button";
import {cn} from "@/shared/lib/utils";
import {Ref} from "react";

type Props = { containerRef?: Ref<HTMLDivElement> };

export function FloatingBottomNavigationBar({containerRef}: Props) {
	const {tabs, go, activeNodeKey} = useNavigation();

	return (
		// Fixed to viewport; container has safe-area + vertical gap as *padding*
		<div
			ref={containerRef}
			className="fixed bottom-0 inset-x-0 z-30 pointer-events-none"
			style={{
				// include safe area + extra vertical gap so measurement is accurate
				paddingBottom:
					"calc(env(safe-area-inset-bottom) + var(--app-frame-gap))",
			}}
		>
			<nav
				className="pointer-events-auto bg-muted border border-border rounded-full shadow-lg px-4 py-2"
				style={{
					// Centered floating dock with horizontal gap from frame lines
					width: "calc(var(--app-max-w) - var(--app-frame-gap) * 2)",
					maxWidth: "calc(100vw - var(--app-frame-gap) * 2)", // defensive on tiny viewports
					marginLeft: "auto",
					marginRight: "auto",
				}}
			>
				<div className="flex justify-around items-center">
					{tabs.map((tab) => {
						const {title, key, icon: Icon} = tab;
						const active = key === activeNodeKey;
						return (
							<Button
								key={key}
								variant="link"
								className="relative flex flex-col items-center w-16 p-0 [&>svg]:!w-6 [&>svg]:!h-6"
								onClick={() => go(key)}
							>
								{active && (
									<motion.div
										layoutId="activeIndicator"
										className="absolute w-10 h-10 bg-muted-foreground rounded-full"
										transition={{type: "spring", stiffness: 300, damping: 20}}
									/>
								)}

								<motion.div
									initial={{scale: 1, opacity: 0.7}}
									animate={{
										scale: active ? 1.2 : 1,
										opacity: active ? 1 : 0.7,
										y: active ? 0 : -4,
									}}
									transition={{duration: 0.2}}
									className="relative flex items-center justify-center h-10 w-10 p-0"
								>
									{Icon && (
										<Icon
											style={{
												width: "1.5rem",
												height: "1.5rem",
											}}
											className={cn(
												active
													? "text-primary-foreground"
													: "text-muted-foreground",
											)}
										/>
									)}
								</motion.div>

								<motion.span
									initial={{opacity: 1, y: 0}}
									animate={{opacity: active ? 0 : 1, y: active ? 5 : 0}}
									transition={{duration: 0.3}}
									className={cn(
										"absolute text-xs font-medium transition-all -bottom-1",
										active
											? "text-primary-foreground"
											: "text-muted-foreground",
									)}
								>
									{active ? "" : title}
								</motion.span>
							</Button>
						);
					})}
				</div>
			</nav>
		</div>
	);
}
