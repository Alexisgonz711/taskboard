import React, { useState, useEffect } from 'react';
import { useUser } from '../../components/Sign/UserContext';
import {
   query,
   where,
   getDocs,
   getDoc,
   doc,
   deleteDoc,
   updateDoc,
   limit,
} from 'firebase/firestore';
import { projetCollection, usersCollection } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';

/**
 * Page des projets de l'utilisateur
 */
function Projet() {
   const user = useUser();
   const navigate = useNavigate();
   const [userProjects, setUserProjects] = useState([]);
   const [loading, setLoading] = useState(true);

   const deleteProject = async (projectId, projectMembers) => {
      if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
         return;
      }

      try {
         const projectDoc = await getDoc(doc(projetCollection, projectId));
         if (!projectDoc.exists() || projectDoc.data().owner !== user.uid) return;

         await deleteDoc(doc(projetCollection, projectId));

         const memberPromises = projectMembers.map(async (memberEmail) => {
            const memberSnapshot = await getDocs(
               query(usersCollection, where('email', '==', memberEmail), limit(1))
            );

            if (!memberSnapshot.empty) {
               const memberDoc = memberSnapshot.docs[0];
               const memberData = memberDoc.data();
               const updatedProjects = (memberData.projets || []).filter(pid => pid !== projectId);
               return updateDoc(doc(usersCollection, memberDoc.id), { projets: updatedProjects });
            }
         });

         await Promise.all(memberPromises);
         setUserProjects(prev => prev.filter(project => project.id !== projectId));
      } catch (error) {
         console.error('Erreur lors de la suppression du projet : ', error);
      }
   };

   useEffect(() => {
      const fetchProjects = async () => {
         try {
            if (!user) return;

            const [ownerSnapshot, memberSnapshot] = await Promise.all([
               getDocs(query(projetCollection, where("owner", "==", user.uid))),
               getDocs(query(projetCollection, where("memberUIDs", "array-contains", user.uid)))
            ]);

            const ownerProjects = ownerSnapshot.docs.map(doc => ({
               id: doc.id,
               ...doc.data(),
               isOwner: true
            }));

            const memberProjects = memberSnapshot.docs
               .filter(doc => doc.data().owner !== user.uid)
               .map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                  isOwner: false
               }));

            const allProjects = [...ownerProjects, ...memberProjects].sort((a, b) => {
               const dateA = a.updatedAt?.toDate() || a.createdAt?.toDate() || 0;
               const dateB = b.updatedAt?.toDate() || b.createdAt?.toDate() || 0;
               return dateB - dateA;
            });

            setUserProjects(allProjects);
         } catch (error) {
            console.error("Erreur lors de la récupération des projets :", error);
         } finally {
            setLoading(false);
         }
      };

      fetchProjects();
   }, [user]);

   if (loading) return <Loading />;

   return (
      <div className="w-full">
         <div className="flex items-center h-24 px-4 w-full">
            <h1 className="text-3xl font-bold text-gray-800">Mes Projets</h1>
         </div>

         <div className="p-6 space-y-8">
            {userProjects.length === 0 ? (
               <div className="text-center py-12">
                  <p className="text-gray-600">Vous n'avez pas encore de projet.</p>
               </div>
            ) : (
               userProjects.map(project => (
                  <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                     <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                           <div>
                              <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                              {!project.isOwner && (
                                 <span className="text-sm text-gray-500">Membre</span>
                              )}
                           </div>
                           <div className="flex items-center gap-4">
                              <button
                                 onClick={() => navigate(`/projet/${project.id}`)}
                                 className="px-4 py-2 bg-mirage-500 text-white hover:bg-mirage-600 rounded-lg transition-colors duration-200"
                              >
                                 Voir le projet
                              </button>
                              {project.isOwner ? (
                                 <button
                                    onClick={() => deleteProject(project.id, project.members)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                 >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                 </button>
                              ) : (
                                 <button disabled className="p-2 text-gray-400 cursor-not-allowed rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                 </button>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
   );
}

export default Projet;
