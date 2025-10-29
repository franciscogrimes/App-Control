import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/Layout";
import Login from "@/Pages/Login";
import Signup from "@/Pages/Signup";
import Dashboard from "@/Pages/Dashboard";
import Clientes from "@/Pages/Clientes";
import Produtos from "@/Pages/Produtos";
import Pedidos from "@/Pages/Pedidos";

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
        path: "/pedidos",
        element: <Pedidos />
      },
      {
        path: "/produtos",
        element: <div>Página de Produtos em construção</div>
      }
    ]
  }
]);