import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/Layout";
import Login from "@/pages/login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/dashboard";
import Clientes from "@/pages/Clientes";
import Produtos from "@/pages/Produtos";
import Pedidos from "@/pages/Pedidos";

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