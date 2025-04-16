import React, { useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useUser } from "../Sign/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import CreateProject from "../Projet/CreateProject";
import {
  HomeIcon,
  PlusCircleIcon,
  BriefcaseIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth)
    navigate("/sign");
  };

  const navigation = [
    {
      name: "Accueil",
      href: "/",
      icon: HomeIcon,
    },
    {
      name: "Créer un projet",
      href: "#",
      icon: PlusCircleIcon,
      onClick: () => setIsModalOpen(true),
    },
    {
      name: "Mes Projets",
      href: "/projet",
      icon: BriefcaseIcon,
    },
  ];

  return (
    <>
      {/* Navigation mobile */}
      <nav className="lg:hidden bg-white shadow-sm fixed w-full z-40">
        <div className="flex items-center justify-between px-4 h-16">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-mirage-950"
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-gray-600" />
            )}
          </button>
          <picture>
            <source srcSet="/logo.webp" type="image/webp" />
            <source srcSet="/logo.png" type="image/png" />
            <img
              src="/logo.png"
              alt="TaskBoard Logo"
              width="512"
              height="512"
              loading="eager"
              className="h-24 w-auto object-contain"
              fetchpriority="high"
            />
          </picture>
          <div className="w-8" />
        </div>

        {/* Overlay mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Menu mobile */}
        <div
          className={`fixed inset-y-0 left-0 z-50 bg-white transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } ${window.innerWidth < 600 ? "w-full" : "w-80"}`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <XMarkIcon className="w-6 h-6 text-mirage-950" />
              </button>
            </div>

            <div className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) =>
                item.onClick ? (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.onClick();
                      setIsOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-mirage-950  hover:bg-mirage-100 rounded-lg transition-colors duration-200"
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-2 text-mirage-950  hover:bg-mirage-100 rounded-lg transition-colors duration-200"
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                )
              )}
            </div>

            {user && (
              <div className="p-4 border-t border-gray-200">
                <Link
                  to={`/profile/${user.uid}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-mirage-950 hover:bg-mirage-100 rounded-lg transition-colors duration-200"
                >
                  <UserCircleIcon className="w-5 h-5 mr-3" />
                  {user.displayName}
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center w-full px-4 py-2 mt-2 text-mirage-950  hover:bg-mirage-100  rounded-lg transition-colors duration-200"
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar Desktop */}
      <aside className="hidden bg-gray-50 lg:flex flex-col w-64 text-mirage-950 shadow-lg border-r">
        <div className="flex items-center justify-center h-24 px-4 border-b">
          <picture>
            <source srcSet="/logo.webp" type="image/webp" />
            <source srcSet="/logo.png" type="image/png" />
            <img
              src="/logo.png"
              alt="TaskBoard Logo"
              width="512"
              height="512"
              loading="eager"
              className="h-24 w-auto object-contain"
              fetchpriority="high"
            />
          </picture>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) =>
            item.onClick ? (
              <button
                key={item.name}
                onClick={item.onClick}
                className="flex items-center w-full px-4 py-2 text-mirage-950 hover:bg-mirage-100 rounded-lg transition-colors duration-200"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-4 py-2 text-mirage-950 hover:bg-mirage-100 rounded-lg transition-colors duration-200"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          )}
        </nav>

        {user && (
          <div className="p-4 border-t border-gray-200">
            <Link
              to={`/profile/${user.uid}`}
              className="flex items-center px-4 py-2 text-mirage-950 hover:bg-mirage-100 rounded-lg transition-colors duration-200"
            >
              <UserCircleIcon className="w-5 h-5 mr-3" />
              {user.displayName}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 mt-2 text-mirage-950 hover:bg-mirage-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
              Se déconnecter
            </button>
          </div>
        )}
      </aside>

      {/* Modal de création de projet */}
      <CreateProject
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
