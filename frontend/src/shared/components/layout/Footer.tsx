/*
 * Copyright (c) 2025. Sayat Raykul
 */

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useParams, usePathname } from "next/navigation";
import { getClientNavItems, getWorkshopNavItems } from "@/shared/lib/navItems";
import { useSession } from "next-auth/react";
import { ShoppingBasket, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { useLikeProduct } from "@/features/product";
import { useAddCart } from "@/features/cart";
import { toast } from "react-toastify";

export default function Footer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const params = useParams();
  const requestId = parseInt(params.id as string, 10);

  const { data: session, status } = useSession();
  const userRole = (session as any)?.loginOut?.role;

  const addCartMutation = useAddCart();
  const addLikeCatMutation = useLikeProduct();

  const handleAddToCart = (productId: number) => {
    addCartMutation.mutate(
      { product_id: productId, quantity: 1 },
      {
        onSuccess: () => {
          toast.success("Товар добавлен в корзину 🛒");
        },
        onError: () => {
          toast.error("Ошибка! Не удалось добавить товар.");
        },
      },
    );
  };

  const handleLikeToCart = (productId: number, isCurrentlyLiked: boolean) => {
    addLikeCatMutation.mutate(productId, {
      onSuccess: () => {
        const action = isCurrentlyLiked ? "удален из" : "добавлен в";
        toast.success(
          `Товар ${action} избранного ${isCurrentlyLiked ? "❤️" : "🛒"}`,
        );
      },
      onError: () => {
        const action = isCurrentlyLiked ? "удалить из" : "добавить в";
        toast.error(`Ошибка! Не удалось ${action} избранного.`);
      },
    });
  };

  const navItems =
    userRole === "workshop"
      ? getWorkshopNavItems(userRole)
      : getClientNavItems(userRole);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const isProductPage = pathname.startsWith("/product/");

  // Проверка: это страница создания или обновления продукта
  const isProductCreateOrUpdatePage =
    pathname === "/product/create" || pathname.startsWith("/product/update/");

  // Проверка: пользователь является клиентом
  const isClient = userRole === "client";

  // === LOADING STATE ===
  if (status === "loading") {
    return (
      <div>
        {children}

        {/* bottom navigation */}
        <div className="fixed bottom-0 inset-x-0 z-30">
          <nav
            className="bg-white px-6 rounded-t-[16px] p-4 shadow-[0_-4px_6px_rgba(0,0,0,0.1)]"
            style={{
              width: "calc(var(--app-max-w))",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div className="flex justify-around items-center">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex justify-center">
                  <div className="relative flex flex-col items-center w-16 p-0">
                    <div className="relative flex flex-col items-center">
                      <div className="w-[26px] h-[26px] bg-gray-300 rounded-full animate-pulse" />
                      <div className="h-2 w-8 bg-gray-200 rounded mt-2 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div>
      {children}

      <div className="fixed bottom-0 inset-x-0 z-30">
        <nav
          className="bg-white rounded-t-[16px] p-4 shadow-[0_-4px_6px_rgba(0,0,0,0.1)]"
          style={{
            width: "calc(var(--app-max-w))",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {/* Показываем кнопки "В корзину" и "Купить сейчас" только для клиентов на страницах продукта, но не на create/update */}
          {isClient && isProductPage && !isProductCreateOrUpdatePage && (
            <div
              className=" pt-3 pb-4 bg-white"
              style={{
                width: "calc(var(--app-max-w))",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <Button
                  className="
                flex-1 w-[162px] h-[48px]
                bg-[#58AB41] text-white
                rounded-[12px]
                font-semibold text-[16px]
                flex items-center justify-center gap-2
                shadow-sm
              "
                  onClick={() => handleAddToCart(requestId)}
                >
                  <ShoppingBasket className="w-[20px] h-[20px]" />В корзину{" "}
                </Button>

                <Button
                  className="
                flex-1 w-[200px] h-[48px]
                bg-[#58AB41] text-white
                rounded-[12px]
                font-semibold text-[16px]
                flex items-center justify-center gap-2
                shadow-sm
              "
                >
                  Купить сейчас
                  <ArrowRight className="w-[20px] h-[20px]" />
                </Button>
              </div>
            </div>
          )}
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className="flex justify-center"
                >
                  <div className="relative flex flex-col items-center w-16 p-0">
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute w-12 bg-accent rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      />
                    )}

                    <motion.div
                      initial={{ scale: 1, opacity: 0.7 }}
                      animate={{
                        scale: active ? 1.2 : 1,
                        opacity: active ? 1 : 0.7,
                      }}
                      transition={{ duration: 0.2 }}
                      className="relative flex items-center justify-center h-10 w-10"
                    >
                      <div className="flex flex-col items-center">
                        <Image
                          src={item.icon}
                          alt={item.key}
                          width={24}
                          height={24}
                          className={`w-[26px] h-[26px] ${
                            active ? "brightness-0 invert-0" : ""
                          }`}
                        />
                        <span
                          className={`text-[12px] mt-1 opacity-90 ${
                            active ? "text-black" : "text-[#C4C4C4]"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
