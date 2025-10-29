import { Outlet } from 'react-router-dom';
import { Navbar } from "./components/navbar"

export function Layout() {
  return (
    <div className=" flex flex-col">
      <header className="bg-white shadow-md">
        <div className="container mx-auto">
          <Navbar />
        </div>
      </header>

        <Outlet /> 
    </div>
  );
}