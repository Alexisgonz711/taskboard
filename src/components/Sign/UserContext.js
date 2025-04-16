import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

// Création d'un contexte utilisateur
const UserContext = createContext();

/**
 * @returns {object}
 */
export const useUser = () => {
   return useContext(UserContext);
};

/**
 * @param {object} props
 */
export const UserProvider = ({ children }) => {
   const [authUser, setAuthUser] = useState(null);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
         if (user) {
            setAuthUser(user);
         } else {
            setAuthUser(null);
         }
      });

      return () => {
         unsubscribe();
      };
   }, []);
   return (
      <UserContext.Provider value={authUser}>{children}</UserContext.Provider>
   );
};
