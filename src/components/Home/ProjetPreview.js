import React, { useState, useEffect } from "react";
import { useUser } from "../Sign/UserContext";
import { query, where, getDocs, getDoc, doc, limit } from "firebase/firestore";
import { projetCollection, usersCollection } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
/**
 * @returns {JSX.Element} Le composant d'aperçu de projet.
 */
export default function ProjectPreview() {
  const navigate = useNavigate();

  const user = useUser();

  const [userProjects, setUserProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  /**
   * Utilisé pour récupérer les projets de l'utilisateur actuel.
   */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        const projectsQuery = query(
          projetCollection,
          where("owner", "==", user.uid),
          limit(3)
        );

        const projectsSnapshot = await getDocs(projectsQuery);

        const projects = projectsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            lastActivity: doc.data().updatedAt || doc.data().createdAt,
          }))
          .sort(
            (a, b) =>
              (b.lastActivity?.toDate() || 0) - (a.lastActivity?.toDate() || 0)
          );

        setUserProjects(projects);
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  const formatDate = (date) => {
    const d = date.toDate();
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
      }
      return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
    } else if (days === 1) {
      return "Hier";
    } else if (days < 7) {
      return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
    } else {
      return d.toLocaleDateString();
    }
  };

  // projets de l'utilisateur
  return (
    <div className="p-6 space-y-8">
      <>
        {userProjects.length > 0 && (
          <h2 className="text-xl font-semibold text-mirage-950">
            Vos projets récents
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {userProjects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-mirage-900">
                Vous n'avez pas encore de projet.
              </p>
            </div>
          ) : (
            userProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 max-w-xs mx-auto w-full"
              >
                <div className="p-6">
                  <h3 className="text-lg font-medium text-mirage-950 mb-2">
                    {project.name}
                  </h3>
                  <div className="space-y-1 mb-4">
                    <p className="text-sm text-gray-500">
                      {project.createdAt
                        ? `Créé le ${project.createdAt
                            .toDate()
                            .toLocaleDateString()}`
                        : "Date inconnue"}
                    </p>
                    {project.updatedAt &&
                      project.updatedAt !== project.createdAt && (
                        <p className="text-sm text-gray-500">
                          Modifié {formatDate(project.updatedAt)}
                        </p>
                      )}
                  </div>
                  <button
                    onClick={() => navigate(`/projet/${project.id}`)}
                    className="w-full px-4 py-2 bg-mirage-500 text-white hover:bg-mirage-600 rounded-lg transition-colors duration-200"
                  >
                    Voir le projet
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </>
    </div>
  );
}
