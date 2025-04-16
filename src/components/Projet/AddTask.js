import React, { useState } from 'react';
import Modal from '../Modal/Modal';

function AddTask({ onAddTask, categoryLabels, showAddTask, toggleAddTask, activeColumn }) {
   const [newTask, setNewTask] = useState({
      title: '',
      description: '',
      category: activeColumn,
   });

   const [titleError, setTitleError] = useState('');

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewTask({
         ...newTask,
         [name]: value,
      });
   };

   const validateForm = () => {
      let isValid = true;

      if (newTask.title.trim() === '') {
         setTitleError('Le titre de la tâche est requis.');
         isValid = false;
      } else {
         setTitleError('');
      }

      return isValid;
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm()) {
         onAddTask(newTask);
         setNewTask({
            title: '',
            description: '',
            category: activeColumn,
         });
         toggleAddTask();
      }
   };

   return (
      <Modal isOpen={showAddTask} onClose={toggleAddTask} title="Ajouter une nouvelle tâche">
         <form onSubmit={handleSubmit} className="space-y-6">
            <div>
               <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                  Titre de la tâche
               </label>
               <div className="mt-2">
                  <input
                     id="title"
                     type="text"
                     name="title"
                     value={newTask.title}
                     onChange={handleInputChange}
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
                     name="description"
                     value={newTask.description}
                     onChange={handleInputChange}
                     rows={4}
                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-mirage-600 sm:text-sm"
                     placeholder="Entrez la description de la tâche"
                  />
               </div>
            </div>

            <div className="flex justify-end gap-4">
               <button
                  type="button"
                  onClick={toggleAddTask}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mirage-500"
               >
                  Annuler
               </button>
               <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-mirage-600 rounded-md hover:bg-mirage-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mirage-500"
               >
                  Ajouter la tâche
               </button>
            </div>
         </form>
      </Modal>
   );
}

export default AddTask;
