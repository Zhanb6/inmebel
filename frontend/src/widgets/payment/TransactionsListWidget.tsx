import {type IPaginatedResponse} from "@/shared";
import {type IFilteredTransaction, TransactionCard, TransactionCardSkeleton} from "@/features/payment";
import {TodayTomorrowOtherWidget, TodayTomorrowOtherWidgetSkeleton} from "@/shared/components";

interface ITransactionsListWidgetProps {
	data?: IPaginatedResponse<IFilteredTransaction> | undefined
}

export function TransactionsListWidget({data}: ITransactionsListWidgetProps) {
	return <TodayTomorrowOtherWidget<IFilteredTransaction> items={data?.results} Card={TransactionCard}/>;
}

export function TransactionsListWidgetSkeleton({data}: ITransactionsListWidgetProps) {
	return <TodayTomorrowOtherWidgetSkeleton CardSkeleton={TransactionCardSkeleton}/>;
}
