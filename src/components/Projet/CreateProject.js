import React, { useState, useEffect } from 'react';
import { addDoc, projetCollection, usersCollection } from '../../firebase';
import { useUser } from '../Sign/UserContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDocs, query, updateDoc, where, setDoc } from 'firebase/firestore';
import Modal from '../Modal/Modal';

const MAX_MEMBERS = 10;
const MAX_PROJECT_NAME_LENGTH = 50;

const addProjectToUser = async (userId, projectId) => {
   try {
      const userQuerySnapshot = await getDocs(
         query(usersCollection, where('uid', '==', userId))
      );

      if (!userQuerySnapshot.empty) {
         const userDoc = userQuerySnapshot.docs[0];
         const userData = userDoc.data();

         if (userData.uid !== userId) {
            return;
         }

         const projets = Array.isArray(userData.projets) ? [...userData.projets] : [];

         if (!projets.includes(projectId)) {
            projets.push(projectId);

            await updateDoc(doc(usersCollection, userDoc.id), {
               projets: projets,
               updatedAt: new Date()
            });
         }
      } else {
         const userDoc = doc(usersCollection, userId);
         await setDoc(userDoc, {
            uid: userId,
            projets: [projectId],
            createdAt: new Date(),
            updatedAt: new Date()
         });
      }
   } catch (error) {
      // Erreur silencieuse
   }
};

function CreateProject({ isOpen, onClose }) {
   const [projectName, setProjectName] = useState('');
   const [newMemberEmail, setNewMemberEmail] = useState('');
   const [projectMembers, setProjectMembers] = useState([]);
   const [projectNameError, setProjectNameError] = useState('');
   const [newMemberEmailError, setNewMemberEmailError] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isMounted, setIsMounted] = useState(true);
   const user = useUser();
   const navigate = useNavigate();

   useEffect(() => {
      setIsMounted(true);
      return () => {
         setIsMounted(false);
      };
   }, []);

   const resetForm = () => {
      if (!isMounted) return;
      setProjectName('');
      setNewMemberEmail('');
      setProjectMembers([]);
      setProjectNameError('');
      setNewMemberEmailError('');
   };

   const handleNewMemberEmailChange = (e) => {
      if (!isMounted) return;
      setNewMemberEmail(e.target.value);
      setNewMemberEmailError('');
   };

   const handleAddMember = async () => {
      if (!isMounted) return;

      if (projectMembers.length >= MAX_MEMBERS) {
         setNewMemberEmailError(`Le nombre maximum de membres (${MAX_MEMBERS}) a été atteint.`);
         return;
      }

      if (validateEmail(newMemberEmail)) {
         try {
            const memberQuery = await getDocs(
               query(usersCollection, where('email', '==', newMemberEmail))
            );

            if (!isMounted) return;

            if (memberQuery.empty) {
               setNewMemberEmailError("Cet utilisateur n'existe pas.");
               return;
            }

            const memberData = memberQuery.docs[0].data();

            if (projectMembers.some(member => member.email === newMemberEmail)) {
               setNewMemberEmailError("Ce membre est déjà dans le projet.");
               return;
            }

            setProjectMembers([...projectMembers, {
               email: newMemberEmail,
               uid: memberData.uid
            }]);
            setNewMemberEmail('');
            setNewMemberEmailError('');
         } catch (error) {
            if (!isMounted) return;
            setNewMemberEmailError("Erreur lors de la vérification de l'utilisateur.");
         }
      } else {
         setNewMemberEmailError("L'adresse e-mail n'est pas valide.");
      }
   };

   const handleProjectNameChange = (e) => {
      if (!isMounted) return;
      const value = e.target.value;
      if (value.length <= MAX_PROJECT_NAME_LENGTH) {
         setProjectName(value);
         setProjectNameError('');
      }
   };

   const validateEmail = (email) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
   };

   const validateForm = () => {
      let isValid = true;

      if (projectName.trim() === '') {
         setProjectNameError('Le nom du projet est requis.');
         isValid = false;
      } else if (projectName.length > MAX_PROJECT_NAME_LENGTH) {
         setProjectNameError(`Le nom du projet ne doit pas dépasser ${MAX_PROJECT_NAME_LENGTH} caractères.`);
         isValid = false;
      }

      return isValid;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (isSubmitting || !isMounted) return;

      if (validateForm()) {
         setIsSubmitting(true);
         try {
            if (user) {
               const userId = user.uid;
               const userEmail = user.email;

               const defaultTasks = {
                  aFaire: [],
                  enCours: [],
                  fait: [],
               };

               const allMembers = [
                  { email: userEmail, uid: userId },
                  ...projectMembers
               ];

               const newProject = {
                  name: projectName,
                  tasks: defaultTasks,
                  members: allMembers.map(member => member.email),
                  memberUIDs: allMembers.map(member => member.uid),
                  owner: userId,
                  ownerEmail: userEmail,
                  createdAt: new Date(),
                  updatedAt: new Date()
               };

               const docRef = await addDoc(projetCollection, newProject);

               if (!isMounted) return;

               await addProjectToUser(userId, docRef.id);

               if (!isMounted) return;

               for (const member of projectMembers) {
                  await addProjectToUser(member.uid, docRef.id);
                  if (!isMounted) return;
               }

               resetForm();
               onClose();
               navigate(`/projet/${docRef.id}`);
            }
         } catch (error) {
            if (!isMounted) return;
            setProjectNameError("Une erreur est survenue lors de la création du projet.");
         } finally {
            if (isMounted) {
               setIsSubmitting(false);
            }
         }
      }
   };

   const handleClose = () => {
      resetForm();
      onClose();
   };

   return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Créer un nouveau projet">
         <form onSubmit={handleSubmit} className="space-y-6">
            <div>
               <label htmlFor="projectName" className="block text-sm font-medium text-gray-900">
                  Nom du projet
               </label>
               <div className="mt-2">
                  <input
                     id="projectName"
                     type="text"
                     value={projectName}
                     onChange={handleProjectNameChange}
                     required
                     maxLength={MAX_PROJECT_NAME_LENGTH}
                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-mirage-600 sm:text-sm"
                     placeholder="Entrez le nom du projet"
                  />
               </div>
               {projectNameError && (
                  <p className="mt-1 text-sm text-red-600">{projectNameError}</p>
               )}
               <p className="mt-1 text-xs text-gray-500">
                  {projectName.length}/{MAX_PROJECT_NAME_LENGTH} caractères
               </p>
            </div>

            <div>
               <label htmlFor="memberEmail" className="block text-sm font-medium text-gray-900">
                  Ajouter un membre
               </label>
               <div className="mt-2 flex gap-2">
                  <input
                     id="memberEmail"
                     type="email"
                     value={newMemberEmail}
                     onChange={handleNewMemberEmailChange}
                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-mirage-600 sm:text-sm"
                     placeholder="Entrez l'email du membre"
                  />
                  <button
                     type="button"
                     onClick={handleAddMember}
                     disabled={isSubmitting || projectMembers.length >= MAX_MEMBERS}
                     className="px-4 py-1.5 bg-mirage-500 text-white rounded-md hover:bg-mirage-600 transition-colors duration-200 disabled:opacity-50"
                  >
                     Ajouter
                  </button>
               </div>
               {newMemberEmailError && (
                  <p className="mt-1 text-sm text-red-600">{newMemberEmailError}</p>
               )}
               <p className="mt-1 text-xs text-gray-500">
                  {projectMembers.length}/{MAX_MEMBERS} membres
               </p>
            </div>

            {projectMembers.length > 0 && (
               <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Membres du projet</h3>
                  <ul className="space-y-1">
                     {projectMembers.map((member, index) => (
                        <li key={index} className="text-sm text-gray-600">{member.email}</li>
                     ))}
                  </ul>
               </div>
            )}

            <div className="flex justify-end gap-4">
               <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mirage-500 disabled:opacity-50"
               >
                  Annuler
               </button>
               <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-mirage-500 rounded-md hover:bg-mirage-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mirage-500 disabled:opacity-50"
               >
                  {isSubmitting ? 'Création...' : 'Créer le projet'}
               </button>
            </div>
         </form>
      </Modal>
   );
}

export default CreateProject;
