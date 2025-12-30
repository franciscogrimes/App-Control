import { TiThMenu } from "react-icons/ti";
import { MdClose } from "react-icons/md";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../../../public/logo.svg'

export function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Clientes", path: "/clientes" },
    { name: "Produtos", path: "/produtos" },
    { name: "Saidas", path: "/saidas" },
    { name: "Entradas", path: "/entradas" },
  ];

  const handleMenuClick = (item) => {
    setActiveItem(item.path);
    setSidebarOpen(false); 
  };

  return (
<nav className="fixed top-0 left-0 z-50 w-full bg-[#800020] backdrop-blur-lg border-b border-white/30 shadow-2xl">
      <div className="flex justify-between items-center p-2">
        <div className="flex justify-center items-center">
          <img 
            src={logo} 
            alt="Logo Juliana" 
            width={100}
            className="mx-auto"
          />
        </div>

        <button
          className="text-white text-4xl lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <MdClose size={35} /> : <TiThMenu size={35} />}
        </button>

        <div className="hidden lg:flex gap-6">
          {menuItems.map((item) => {
            const isActive =
              activeItem === item.path || location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => handleMenuClick(item)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <aside
  className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[99999] lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex justify-between items-center bg-[#800020] text-white">
          <span className="font-semibold text-lg">Menu</span>
          <button onClick={() => setSidebarOpen(false)}>
            <MdClose size={28} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive =
              activeItem === item.path || location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => handleMenuClick(item)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-[#800020] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </nav>
  );
}
