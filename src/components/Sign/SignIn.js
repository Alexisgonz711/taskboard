import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

/**
 * Composant de connexion.
 */
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleMail = (e) => {
    setEmail(e.target.value);
  };

  const handlePass = (e) => {
    setPass(e.target.value);
  };

  /**
   * @param {Event} e - événement de soumission du formulaire.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !pass) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      setError(null);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        pass
      );
      const user = userCredential.user;
      navigate("/");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(`Erreur lors de la connexion : ${errorCode} - ${errorMessage}`);
    }
  };

  // Rendu du composant
  return (
    <div className=" bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm border border-gray-300 shadow bg-white rounded-2xl p-6">
        <h2 className=" mb-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Connexion
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                placeholder="Entrez votre email"
                onChange={handleMail}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-mirage-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Mot de passe
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="Mot de passe"
                type="password"
                required
                placeholder="Entrez votre mot de passe"
                value={pass}
                onChange={handlePass}
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-mirage-600 sm:text-sm"
              />
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-mirage-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-mirage-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mirage-600"
            >
              Se connecter
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Vous n'avez pas de compte ?{" "}
          <Link
            to="/signup"
            className="font-semibold text-mirage-600 hover:text-mirage-500"
          >
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
