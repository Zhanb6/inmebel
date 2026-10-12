"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { tokenStore } from "@/shared/lib/tokenStore";

export function SessionManager() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.access) {
      tokenStore.set(
        (session as any).access.token,
        (session as any).refresh.token,
      );
    } else {
      // tokenStore.clear();
      console.log("tokenClear sessionManager core/components");
    }
  }, [session]);

  return null;
}
