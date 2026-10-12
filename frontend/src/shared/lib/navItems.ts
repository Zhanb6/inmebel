export const getClientNavItems = (userRole?: string) => [
  {
    key: "home",
    href: "/",
    icon: "/assets/images/home.svg",
    label: "Главная",
  },
  {
    key: "requests",
    href: "/client/request",
    icon: "/assets/images/calculator.svg",
    label: "Заказать",
  },
  {
    key: "furniture",
    href: "/furniture/list",
    icon: "/assets/images/note-favorite.svg",
    label: "Заказы",
  },
  // ...(userRole
  //   ? [
  //       {
  //         key: "product",
  //         href: "/product",
  //         icon: "/assets/images/bart.svg",
  //         label: "Продукты",
  //       },
  //     ]
  //   : []),
  {
    key: "profile",
    href: "/profile",
    icon: "/assets/images/user.svg",
    label: "Профиль",
  },
];

export const getWorkshopNavItems = (userRole?: string) => [
  {
    key: "home",
    href: "/",
    icon: "/assets/images/home.svg",
    label: "Главная",
  },
  {
    key: "furniture",
    href: "/orders",
    icon: "/assets/images/note-favorite.svg",
    label: "Заказы",
  },
  // ...(userRole
  //   ? [
  //       {
  //         key: "product",
  //         href: "/product",
  //         icon: "/assets/images/bart.svg",
  //         label: "Продукты",
  //       },
  //     ]
  //   : []),
      ...(userRole
    ? [
        {
          key: "product2",
          href: "/custom",
          icon: "/assets/images/note-favorite.svg",
          label: "Корзины",
        },
      ]
    : []),
  {
    key: "profile",
    href: "/profile",
    icon: "/assets/images/user.svg",
    label: "Профиль",
  },
];
