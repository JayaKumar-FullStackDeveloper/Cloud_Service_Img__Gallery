// UserLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import UserHeader from './Components/header';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      < UserHeader/>
      <main className="flex-grow bg-gray-50">
        <Outlet /> 
      </main>
      <footer>
      </footer>
    </div>
  );
};

export default UserLayout;

