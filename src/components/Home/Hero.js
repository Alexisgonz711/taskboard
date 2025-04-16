import React, { useState } from 'react';
import CreateProject from '../Projet/CreateProject';

export default function Hero() {
   const [isModalOpen, setIsModalOpen] = useState(false);

   return (
      <>
         <div className="flex items-center justify-between h-24 px-4 w-full">
            <h1 className="text-3xl font-bold text-mirage-950">
               Espace de travail
            </h1>
            <button
               onClick={() => setIsModalOpen(true)}
               className="px-4 py-2 bg-mirage-500 text-white hover:bg-mirage-600 rounded-lg transition-colors duration-200"
            >
               Créer un projet
            </button>
         </div>
         <CreateProject isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
   );
}
