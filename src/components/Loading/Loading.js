import React from 'react';

function Loading() {
   return (
      <div className="w-full h-full flex items-center justify-center py-12">
         <div className="relative">
            <div className="w-16 h-16 border-4 border-mirage-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-mirage-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
         </div>
      </div>
   );
}

export default Loading;
