import React from 'react';
import { Link } from 'react-router-dom';

function Error() {
   return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-mirage-50 to-mirage-100">
         <div className="text-center  max-w-md w-full mx-4">
            <h1 className="text-9xl font-bold text-mirage-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-mirage-900 mb-2">Page non trouvée</h2>
            <p className="text-mirage-700 mb-8">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
            <Link
               to="/"
               className="inline-flex items-center px-6 py-3 bg-mirage-600 text-white rounded-lg hover:bg-mirage-700 transition-colors duration-200"
            >
               Retour à l'accueil
            </Link>
         </div>
      </div>
   );
}

export default Error;
