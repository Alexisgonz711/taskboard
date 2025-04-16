import React, { useState } from 'react';
import Modal from '../Modal/Modal';

/**
 * Composant de modification ou suppression d'une tâche existante.
 *
 * @param {Object} props
 * @param {Object} task
 * @param {Object} categoryLabels
 * @param {function} onClose
 * @param {function} onUpdate
 * @param {function} onDelete
 * @param {boolean} showTask
 * @param {boolean} isOwner
 */
function TaskEdit({
   task,
   onClose,
   onUpdate,
   onDelete,
   showTask,
   isOwner,
}) {
   const [newTitle, setNewTitle] = useState(task.title);
   const [newDescription, setNewDescription] = useState(task.description);
   const [titleError, setTitleError] = useState('');

   const validateForm = () => {
      let isValid = true;

      if (newTitle.trim() === '') {
         setTitleError('Titre de la tâche requis.');
         isValid = false;
      } else {
         setTitleError('');
      }

      return isValid;
   };

   const handleUpdateTask = (e) => {
      e.preventDefault();
      if (validateForm()) {
         const updatedTask = {
            ...task,
            title: newTitle,
            description: newDescription,
         };

         onUpdate(updatedTask);
         onClose();
      }
   };

   const handleDeleteClick = () => {
      onDelete(task.id);
   };

   return (
      <Modal isOpen={showTask} onClose={onClose} title="Modifier la tâche">
         <form onSubmit={handleUpdateTask} className="space-y-6">
            <div>
               <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                  Titre de la tâche
               </label>
               <div className="mt-2">
                  <input
                     id="title"
                     type="text"
                     value={newTitle}
                     onChange={(e) => setNewTitle(e.target.value)}
                     required
                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-mirage-600 sm:text-sm"
                     placeholder="Entrez le titre de la tâche"
                  />
               </div>
               {titleError && (
                  <p className="mt-1 text-sm text-red-600">{titleError}</p>
               )}
            </div>

            <div>
               <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                  Description
               </label>
               <div className="mt-2">
                  <textarea
                     id="description"
                     value={newDescription}
                     onChange={(e) => setNewDescription(e.target.value)}
                     rows={4}
                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-mirage-600 sm:text-sm"
                     placeholder="Entrez la description de la tâche"
                  />
               </div>
            </div>

            <div className="flex justify-end gap-4">
               <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mirage-500"
               >
                  Annuler
               </button>
               {isOwner && (
                  <button
                     type="button"
                     onClick={handleDeleteClick}
                     className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                     Supprimer
                  </button>
               )}
               <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-mirage-600 rounded-md hover:bg-mirage-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mirage-500"
               >
                  Enregistrer
               </button>
            </div>
         </form>
      </Modal>
   );
}

export default TaskEdit;
