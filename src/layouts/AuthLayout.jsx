import React from 'react';
import { Outlet } from 'react-router-dom';
import { PiCardsBold } from "react-icons/pi";

const AuthLayout = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <PiCardsBold className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            FlashCard App
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Học tập hiệu quả với thẻ ghi nhớ
          </p>
        </div>
        
        {/* Auth Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">
          <Outlet />
        </div>
        
       
      </div>
    </div>
  );
};

export default AuthLayout;