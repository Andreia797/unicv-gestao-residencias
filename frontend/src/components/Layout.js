import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full">
        <Header />
      </header>
      <div className="flex flex-1">
        <aside className="w-64">
          <Sidebar />
        </aside>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;