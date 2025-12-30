import { Outlet } from 'react-router-dom';
import { Navbar } from "./components/navbar"

export function Layout() {
  return (
 <>
      <Navbar />
      <main className="pt-28 min-h-screen">
        <Outlet />
      </main>
    </>
  );
}