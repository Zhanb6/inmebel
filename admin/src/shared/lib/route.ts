import { lazy } from "react";

// Auth компоненты
export const RegisterClient = lazy(() => import("../../pages/auth/register/client"));
export const Login = lazy(() => import("../../pages/auth/login/login"));
export const Select = lazy(() => import("../../pages/auth/select/select"));

// Main компоненты
export const Home = lazy(() => import("../../pages/main/home/home"));
export const Request = lazy(() => import("../../pages/main/request/request"));
export const RequestId = lazy(() => import("../../pages/main/request/id/request"));
export const Order = lazy(() => import("../../pages/main/order/order"));
export const OrderId = lazy(() => import("../../pages/main/order/id/order"));
export const User = lazy(() => import("../../pages/main/user/user"));
export const UserId = lazy(() => import("../../pages/main/user/id/user"));
export const Product = lazy(() => import("../../pages/main/product/product"));
export const ProductId = lazy(() => import("../../pages/main/product/id/product"));
export const Categoris = lazy(() => import("../../pages/main/categories/categories"));
export const CategorisId = lazy(() => import("../../pages/main/categories/id/categories"));
 



// Layout компоненты
export const AuthLayout = lazy(() => import("../../pages/auth/layout"));
export const MainLayout = lazy(() => import("../../pages/main/layout"));
