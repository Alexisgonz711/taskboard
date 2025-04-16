import React from 'react';

export default function TaskCard({ task, onEdit }) {
   return (
      <div className="relative overflow-hidden bg-mirage-200 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group relative">
         <div className="bg-mirage-600 absolute w-1.5 top-0 bottom-0 left-0"></div>
         <div className="p-4">
            <h4 className="font-medium mb-2 text-mirage-950">{task.title}</h4>
            {task.description && (
               <p className="text-mirage-900 text-xs">{task.description}</p>
            )}
         </div>
         <button
            onClick={() => onEdit(task)}
            className="absolute top-2 right-2 p-1 text-mirage-900 hover:text-mirage-950 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
         >
            <svg
               className="w-4 h-4"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
               />
            </svg>
         </button>
      </div>
   );
}
