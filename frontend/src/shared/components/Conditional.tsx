import React, {ReactNode} from "react";
import type {UseQueryResult} from "@tanstack/react-query";
import {EmptyState, ErrorState, Loading} from "./";

type TQ = UseQueryResult<any, any>;

type ConditionalProps = {
	children: ReactNode | ((results: TQ[]) => ReactNode);
	query?: TQ;
	queries?: Array<TQ | undefined>;
	skeleton?: ReactNode;
	error?: ReactNode | ((errors: unknown[], results: TQ[]) => ReactNode);
	empty?: ReactNode | ((results: TQ[]) => ReactNode);
	treatErrorAsEmpty?: boolean;
	requireData?: boolean;
	mode?: "all" | "any";
};

/**
 * Conditional rendering component that encapsulates the state logic of UseQueryResult (TanStack Query).
 *
 * The component automatically determines the state of the passed queries: loading, error, success,
 * or successfully loaded but empty data, and renders the corresponding component.
 *
 * @param {ConditionalProps} props - Component properties.
 * @param {ReactNode | ((results: TQ[]) => ReactNode)} props.children - Content to render upon successful data load. Can be a function that receives the array of results.
 * @param {TQ} [props.query] - A single UseQueryResult object (for backward compatibility).
 * @param {Array<TQ | undefined>} [props.queries] - An array of UseQueryResult objects to check.
 * @param {ReactNode} [props.skeleton=<Loading/>] - Content to render when any query is in the pending state (loading, fetching, or waiting).
 * @param {ReactNode | ((errors: unknown[], results: TQ[]) => ReactNode)} [props.error=<ErrorState/>] - Content to render if an error occurs in any of the queries. Can be a function that receives an array of errors and results.
 * @param {ReactNode | ((results: TQ[]) => ReactNode)} [props.empty=<EmptyState/>] - Content to render if queries complete successfully but contain no data (data is falsy or an empty array), only applies if `requireData` is false.
 * @param {boolean} [props.treatErrorAsEmpty=true] - If true, any error state will render the component specified by the `empty` prop instead of the `error` prop. This is useful for user-friendly error messages like "No results found" on API failure.
 * @param {boolean} [props.requireData=true] - If true, success requires that `data` is not null/undefined. If false, success only requires `isSuccess`, and handling of null/empty data is delegated to the `empty` prop logic.
 * @param {"all" | "any"} [props.mode="all"] - Check mode: "all" (all queries must be successful) or "any" (at least one query must be successful) to transition to the `isReady` state.
 * @returns {ReactNode} One of the child components (`skeleton`, `error`, `empty`, `children`).
 */
export function Conditional({
	children,
	query,
	queries,
	skeleton = <Loading/>,
	error = <ErrorState/>,
	empty = <EmptyState/>,
	treatErrorAsEmpty = true,
	requireData = true,
	mode = "all",
}: ConditionalProps): ReactNode {
	const list = (queries ?? (query ? [query] : [])).filter(Boolean) as TQ[];

	if (list.length === 0) return skeleton;

	const anyError = list.some(q => q.isError);
	if (anyError) {
		const errors = list.filter(q => q.isError).map(q => q.error);
		if (treatErrorAsEmpty) {
			return typeof empty === "function" ? empty(list) : empty;
		}
		return typeof error === "function" ? error(errors, list) : error;
	}

	const anyPending = list.some(q => q.isPending);
	if (anyPending) return skeleton;

	const hasData = (q: TQ) =>
		requireData ? q.data !== undefined && q.data !== null : q.isSuccess;

	const successAll = list.every(q => q.isSuccess && hasData(q));
	const successAny = list.some(q => q.isSuccess && hasData(q));
	const isReady = mode === "all" ? successAll : successAny;

	if (!isReady) return skeleton;

	const allDataFalsy = list.every(q => !q.data || (Array.isArray(q.data) && q.data.length === 0));

	if (!requireData && allDataFalsy) {
		return typeof empty === "function" ? empty(list) : empty;
	}

	return typeof children === "function" ? (children as any)(list) : <>{children}</>;
}
