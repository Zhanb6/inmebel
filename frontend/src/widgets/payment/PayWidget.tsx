import {useTranslation} from "@/i18n";
import {usePaymentScreenContext} from "@/features/payment/providers";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/components/ui";
import {useState} from "react";
import {cn} from "@/shared";
import {IconButton} from "@/shared/components";
import {ArrowLeft} from "lucide-react";

type TPayWidgetTab = "kaspi" | "other"

export function PayWidget() {
	const {t} = useTranslation("widgets.payment.PayWidget");
	const {setActiveWidget} = usePaymentScreenContext()
	const [currentTab, setCurrentTab] = useState<TPayWidgetTab>("kaspi")
	return (
		<div className="h-full flex flex-col gap-4 justify-between">
			<div
				className="w-full h-12 shrink-0 flex items-center justify-between gap-2"
			>
				<IconButton
					aria-label={"back"}
					variant="secondary"
					className="size-9"
					onClick={(event) => {
						event.preventDefault()
						setActiveWidget("plans")
					}}
					icon={
						<ArrowLeft
							className="size-6"
						/>
					}
				/>
				<h3 className="w-full flex items-center text-start gap-2 text-xl font-semibold truncate">
					{t("Pay for a subscription")}
				</h3>
			</div>

			<div className="h-full flex flex-col gap-4">
				<Tabs defaultValue={currentTab} onValueChange={(value) => setCurrentTab(value as TPayWidgetTab)}>
					<TabsList className="w-full bg-card">
						<TabsTrigger
							value="kaspi"
							className={cn(currentTab === "kaspi" ? "text-foreground" : " text-muted-foreground")}
						>{t("Kaspi bank")}</TabsTrigger>
						<TabsTrigger
							value="other"
							className={cn(currentTab === "other" ? "text-foreground" : " text-muted-foreground")}
						>{t("Other card")}</TabsTrigger>
					</TabsList>
					<TabsContent value="kaspi">
						<div className="flex flex-col bg-card rounded-2xl">
							<div className="h-10 flex py-2 px-4">
								<input
									type="text"
									placeholder={t("Card number")}
									className="w-full"
								/>
							</div>
							<div className="w-full h-px bg-separator"></div>
							<div className="h-10 flex gap-2 px-4">
								<div className="flex py-2">
									<input
										type="text"
										placeholder={t("Expiration date")}
										className="w-full"
									/>
								</div>
								<div className="w-px h-full bg-separator"></div>
								<div className="flex py-2">
									<input
										type="text"
										placeholder="CVV/CVC"
										className="w-full"
									/>
								</div>
							</div>
						</div>
					</TabsContent>
					<TabsContent value="other">
						<div className="flex flex-col bg-card rounded-2xl">
							<div className="h-10 flex py-2 px-4">
								<input
									type="text"
									placeholder={t("Card number")}
									className="w-full"
								/>
							</div>
							<div className="w-full h-px bg-separator"></div>
							<div className="h-10 flex gap-2 px-4">
								<div className="flex py-2">
									<input
										type="text"
										placeholder={t("Expiration date")}
										className="w-full"
									/>
								</div>
								<div className="w-px h-full bg-separator"></div>
								<div className="flex py-2">
									<input
										type="text"
										placeholder="CVV/CVC"
										className="w-full"
									/>
								</div>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
			<button
				onClick={() => {
					setActiveWidget("main")
				}}
				className="bg-button text-button-foreground rounded-full p-2"
			>{t("Pay")}</button>
		</div>
	)
}