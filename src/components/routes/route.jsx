import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "@/Layout";
import { ProtectedRoute } from "@/components/routes/ProtectedRoute";
import Login from "@/pages/Login.jsx";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Clientes from "@/pages/Clientes";
import Produtos from "@/pages/Produtos";
import Saidas from "@/pages/Saidas";
import Entradas from "@/pages/Entradas";
import Servicos from "@/pages/Services";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/clientes",
        element: <Clientes />
      },
      {
        path: "/produtos",
        element: <Produtos />
      },
      {
        path: "/saidas",
        element: <Saidas />
      },
      {
        path: "/entradas",
        element: <Entradas />
      },
      {
        path: "/servicos",
        element: <Servicos />
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />
  }
]);