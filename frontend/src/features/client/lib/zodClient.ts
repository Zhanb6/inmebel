"use client";

import { z } from "zod";
import { useMemo } from "react";
import { createClientRequestSchema } from "./zod";

export function useClientRequestSchema() {
  // Просто возвращаем схему как есть
  return useMemo(() => {
    return createClientRequestSchema;
  }, []);
}

// Тип должен быть создан из схемы
export type TClientRequestSchema = z.infer<typeof createClientRequestSchema>;