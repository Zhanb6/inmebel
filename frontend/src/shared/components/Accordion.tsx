import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui";
import { EmptyState } from ".";
import { type IPaginatedResponse, type IWysiwygItem } from "@/shared/types";
import { UseQueryResult } from "@tanstack/react-query";

export function AccordionConditional({
  query,
}: {
  query: UseQueryResult<IPaginatedResponse<IWysiwygItem>, Error>;
}) {
  const { isLoading, isError, data } = query;
  if (isLoading) return <AccordionSkeleton />;
  if (isError || !data || data.results.length === 0) return <EmptyState />;
  return <AccordionWidget items={data.results} />;
}

interface AccordionWidgetProps {
  items: IWysiwygItem[];
}

export function AccordionWidget({ items }: AccordionWidgetProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Accordion
        type="multiple"
        className="w-full bg-card border rounded-xl px-4"
      >
        {items.map((item) => (
          <AccordionItem key={item.id} value={`item-${item.id}`}>
            <AccordionTrigger>
              <div
                className="w-full text-left"
                dangerouslySetInnerHTML={{ __html: item.title }}
              />
            </AccordionTrigger>
            <AccordionContent>
              <div
                className="text-sm prose dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export function AccordionSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Accordion
        type="multiple"
        className="w-full bg-card border rounded-xl px-4"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className=" animate-shimmer shimmer"
          >
            <AccordionTrigger>
              <div className="w-50 h-4 rounded-xl animate-pulse bg-card-foreground" />
            </AccordionTrigger>
            <AccordionContent>
              <div className="w-30 h-3 text-sm prose dark:prose-invert rounded-xl animate-pulse bg-card-foreground" />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
