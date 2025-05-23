import React from 'react';

function Modal({ isOpen, onClose, title, children }) {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-mirage-950">{title}</h2>
               <button
                  onClick={onClose}
                  className="text-mirage-950 hover:text-mirage-900"
               >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>
            {children}
         </div>
      </div>
   );
}

export default Modal;
