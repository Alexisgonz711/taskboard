import React, { useState, useEffect } from 'react';
import { useUser } from '../../components/Sign/UserContext';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../../index.css';
import Loading from '../../components/Loading/Loading';

/**
 * Profil de l'utilisateur
 */
function Profile() {
   const currentUser = useUser();
   const [userRole, setUserRole] = useState('');
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchUserRole = async () => {
         try {
            if (currentUser) {
               const userDocRef = doc(db, 'users', currentUser.uid);
               const userDocSnap = await getDoc(userDocRef);

               if (userDocSnap.exists()) {
                  const userData = userDocSnap.data();
                  setUserRole(userData.role);
               }
            }
         } catch (error) {
            console.error('Erreur lors de la récupération des données : ', error);
            setError("Une erreur s'est produite lors du chargement des données.");
         } finally {
            setLoading(false);
         }
      };

      fetchUserRole();
   }, [currentUser]);

   return (
      <div className="min-h-screen w-full">
         <div className="flex items-center h-24 px-4 w-full">
            <h1 className="text-3xl font-bold text-mirage-950">
               Profil
            </h1>
         </div>

         <div className="max-w-7xl mx-auto px-4 py-6">
            {loading ? (
               <Loading />
            ) : (
               <>
                  {error && (
                     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                     </div>
                  )}

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                     <div className="p-6">
                        <div className="flex items-center space-x-4">
                           <div className="h-20 w-20 rounded-full bg-mirage-600 flex items-center justify-center text-white text-2xl font-semibold">
                              {currentUser.displayName?.charAt(0).toUpperCase()}
                           </div>
                           <div>
                              <h2 className="text-2xl font-semibold text-mirage-950">{currentUser.displayName}</h2>
                              <p className="text-mirage-600">{currentUser.email}</p>
                           </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                 <h3 className="text-sm font-medium text-gray-500">Rôle</h3>
                                 <p className="mt-1 text-lg font-medium text-mirage-950 capitalize">{userRole}</p>
                              </div>
                              <div>
                                 <h3 className="text-sm font-medium text-gray-500">Date d'inscription</h3>
                                 <p className="mt-1 text-lg font-medium text-mirage-950">
                                    {new Date(currentUser.metadata.creationTime).toLocaleDateString()}
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </>
            )}
         </div>
      </div>
   );
}

export default Profile;
