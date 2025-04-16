import React, { useState } from "react";
import { auth, usersCollection } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from 'firebase/firestore';

/**
 * Composant d'inscription.
 */
export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleDisplayNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  /**
   * @param {Event} e - événement de soumission du formulaire.
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!displayName || !email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      setError(null);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user) {
        throw new Error("Échec de la création du compte");
      }

      await updateProfile(user, { displayName: displayName });

      await setDoc(doc(usersCollection, user.uid), {
        uid: user.uid,
        displayName: displayName,
        email: email,
        role: "user",
        projets: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      navigate("/");

    } catch (error) {
      let errorMessage = "Une erreur est survenue lors de la création du compte.";

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "Cette adresse email est déjà utilisée.";
          break;
        case 'auth/invalid-email':
          errorMessage = "L'adresse email n'est pas valide.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "La création de compte est temporairement désactivée.";
          break;
        case 'auth/weak-password':
          errorMessage = "Le mot de passe est trop faible.";
          break;
        default:
          errorMessage = "Une erreur est survenue lors de la création du compte.";
          break;
      }

      setError(errorMessage);
    }
  };

  // Rendu du composant
  return (
    <div className="bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-sm border border-gray-300 shadow bg-white rounded-2xl p-6">
        <h2 className=" mb-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Inscription
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-900"
            >
              Pseudo
            </label>
            <div className="mt-2">
              <input
                id="displayName"
                name="pseudo"
                pattern="^[a-zA-Z0-9_]{3,15}$"
                type="text"
                value={displayName}
                autoComplete="pseudo"
                onChange={handleDisplayNameChange}
                placeholder="Entrez votre pseudo"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-mirage-600 sm:text-sm"
              />
            </div>
          </div>

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
                onChange={handleEmailChange}
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
                value={password}
                onChange={handlePasswordChange}
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
              S'inscrire
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Vous avez déjà un compte ?{" "}
          <Link
            to="/sign"
            className="font-semibold text-mirage-600 hover:text-mirage-500"
          >
            S'identifier
          </Link>
        </p>
      </div>
    </div>
  );
}
