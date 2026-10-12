/*
 * Copyright (c) 2025. Sayat Raykul
 */
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigationNodes } from "@/core/hooks/useNavigationNodes";
import {
  INavigationContext,
  TNavigationNode,
  TAnyNodeKey,
  TNodeKey,
  TTabNode,
  isTab,
} from "@/shared/types/navigation";
import { NavigationContext } from "@/shared/lib/navigation";

type Props = {
  children: React.ReactNode;
  initialKey?: TNodeKey; // optional override
  persistKey?: string; // optional sessionStorage key
};

export function NavigationProvider({
  children,
  initialKey,
  persistKey,
}: Props) {
  const allNodes: TNavigationNode[] = useNavigationNodes();

  // (Optional) apply guards/visibility here later if you add them
  const nodes = useMemo(() => allNodes, [allNodes]);

  // Use tabs (properly narrowed) to compute defaults
  const tabs: TTabNode[] = useMemo(
    () => nodes.filter((n): n is TTabNode => isTab(n) && !n.parentKey),
    [nodes],
  );

  const computeDefault = (): TAnyNodeKey => {
    if (initialKey && nodes.some((n) => n.key === initialKey))
      return initialKey;
    if (persistKey) {
      try {
        const saved = sessionStorage.getItem(persistKey) as TNodeKey | null;
        if (saved && nodes.some((n) => n.key === saved)) return saved;
      } catch {
        /* ignore */
      }
    }
    return tabs[0]?.key ?? "empty";
  };

  const [activeNodeKey, setActiveNodeKey] =
    useState<TAnyNodeKey>(computeDefault);
  const [nodeHistory, setNodeHistory] = useState<TNodeKey[]>(
    activeNodeKey !== "empty" ? [activeNodeKey as TNodeKey] : [],
  );

  // Persist active key
  useEffect(() => {
    if (!persistKey || activeNodeKey === "empty") return;
    try {
      sessionStorage.setItem(persistKey, activeNodeKey as TNodeKey);
    } catch {
      /* ignore */
    }
  }, [activeNodeKey, persistKey]);

  // Keep active key valid when nodes change
  useEffect(() => {
    const ensureValid = () => {
      if (activeNodeKey === "empty") {
        const next = computeDefault();
        if (next !== "empty") {
          setActiveNodeKey(next);
          setNodeHistory([next as TNodeKey]);
        }
        return;
      }
      if (!nodes.some((n) => n.key === activeNodeKey)) {
        const next = computeDefault();
        setActiveNodeKey(next);
        setNodeHistory(next !== "empty" ? [next as TNodeKey] : []);
      }
    };
    ensureValid();
  }, [nodes, tabs.length]); // re-evaluate when structure changes

  const activeNode = useMemo(
    () => nodes.find((n) => n.key === activeNodeKey),
    [nodes, activeNodeKey],
  );

  const go = useCallback((key: TNodeKey) => {
    setActiveNodeKey(key);
    setNodeHistory((prev) => [...prev, key]);
  }, []);

  const back = useCallback(() => {
    setNodeHistory((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.slice(0, -1);
      const last = next[next.length - 1] as TNodeKey | undefined;
      setActiveNodeKey(last ?? "empty");
      return next;
    });
  }, []);

  const value: INavigationContext = {
    activeNodeKey,
    setActiveNodeKey,
    go,
    back,
    nodeHistory,
    activeNode,
    nodes,
    tabs, // now TTabNode[] thanks to the type guard
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}
