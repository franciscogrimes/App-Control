import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/Layout";
import Login from "@/pages/Login.jsx";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Clientes from "@/pages/Clientes";
import Produtos from "@/pages/Produtos";
import Saidas from "@/pages/Saidas";
import Entradas from "@/pages/Entradas";

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
    element: <Layout />,
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
      }
    ]
  }
]);