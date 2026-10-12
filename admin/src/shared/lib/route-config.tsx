import type { RouteObject } from "react-router-dom";
import {
  AuthLayout,
  MainLayout,
  Login,
  Home,
  Request,
  Select,
  RegisterClient,
  RequestId,
  Order,
  OrderId,
  User,
  UserId,
  Product,
  ProductId,
  Categoris,
  CategorisId,
} from "../lib/route";

// Создаем компоненты-обертки для защиты маршрутов
import { ProtectedRoute, AuthRoute } from "../components/ProtectedRoute";

export const routes: RouteObject[] = [
  {
    // Маршруты только для неавторизованных пользователей
    element: <AuthRoute />,
    children: [
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register/client", element: <RegisterClient /> },
          { path: "select", element: <Select /> },
        ],
      },
    ],
  },
  {
    // Защищенные маршруты - требуют авторизации
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { path: "/", element: <Home /> },
          {
            path: "/request",
            element: <Request />,
          },
          {
            path: "/request/:id",
            element: <RequestId />,
          },
          {
            path: "/order",
            element: <Order />,
          },
          {
            path: "/order/:id",
            element: <OrderId />,
          },
          {
            path: "/user",
            element: <User />,
          },
          {
            path: "/user/:id",
            element: <UserId />,
          },
          {
            path: "/product",
            element: <Product />,
          },
          {
            path: "/product/:id",
            element: <ProductId />,
          },
          {
            path: "/categories",
            element: <Categoris />,
          },
          {
            path: "/categories/:id",
            element: <CategorisId />,
          },
        ],
      },
    ],
  },
];
