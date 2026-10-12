"use client";

import Footer from "@/shared/components/layout/Footer";
import Header from "@/shared/components/layout/header";

import React from "react";

export default function WorkshopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Footer>{children}</Footer>
    </>
  );
}
