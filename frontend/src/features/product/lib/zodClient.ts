"use client";
import {z} from "zod";
import { createProductSchema, starProductSchema } from "./zod";

export function useCreateProductSchema() {
  return createProductSchema();
}

export type TCreateProductSchema = z.infer<
  ReturnType<typeof useCreateProductSchema>
>;

export function useStarProductSchema() {
  return starProductSchema();
}

export type TStarProductSchema = z.infer<
  ReturnType<typeof useStarProductSchema>
>;