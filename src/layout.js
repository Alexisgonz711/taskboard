import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from './components/Sign/UserContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Sidebar from './components/Sidebar/Sidebar';
import Loading from './components/Loading/Loading';

function Layout() {
   const user = useUser();
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
         if (user) {
            setLoading(false);
         } else {
            setLoading(false);
         }
      });

      return () => {
         unsubscribe();
      };
   }, []);

   if (loading) {
      return <Loading />;
   }

   if (!user) {
      return <Navigate to="/sign" />;
   }

   return (
      <div className="flex flex-col lg:flex-row h-screen">
         <Sidebar />
         <main className="flex-1 overflow-auto bg-white relative pt-16 lg:pt-0">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(100%_50%_at_50%_0%,theme(colors.mirage.200/0.3)_0,theme(colors.mirage.100/0.1)_50%,theme(colors.mirage.50/0.05)_100%)]"></div>
            <div className="relative z-10">
               <Outlet />
            </div>
         </main>
      </div>
   );
}

export default Layout;
